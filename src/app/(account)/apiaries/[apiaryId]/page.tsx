import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import ApiaryMapWrapper from '@/components/shared/ApiaryMapWrapper';

export const dynamic = 'force-dynamic';

export default async function AccountApiaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ apiaryId: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { apiaryId } = await params;
  const apiaryOwner = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { userId: true },
  });

  if (!apiaryOwner) {
    redirect('/not-found');
  }

  if (
    apiaryOwner.userId !== session?.user.id &&
    session?.user.role !== 'ADMIN'
  ) {
    redirect('/unauthorized');
  }

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      userId: true,
    },
  });
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const totalHives = await prisma.hive.count({
    where: { apiaryId: parseInt(apiaryId) },
  });
  const hivesPerPage = 3;
  const totalPages = Math.ceil(totalHives / hivesPerPage);
  const hives = await prisma.hive.findMany({
    where: { apiaryId: parseInt(apiaryId) },
    skip: (currentPage - 1) * hivesPerPage,
    take: hivesPerPage,
    include: {
      observations: true,
    },
  });

  return (
    <>
      <section className="page-header" data-page="01">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-12)" }}>
            <div>
              <h1 className="page-header__title">{apiary?.name}</h1>
              <div className="page-header__meta">
                <div className="page-header__meta-item">
                  <span className="page-header__meta-label">Kasten</span>
                  <span className="page-header__meta-value">{totalHives}</span>
                </div>
              </div>
            </div>
            <div className="page-header__actions">
              <Link href={`/apiaries/${apiary?.id}/edit`}>
                <button className="btn btn--secondary">
                  Wijzig bijenstand
                </button>
              </Link>
              {apiary && (
                <DeleteEntityButton
                  id={apiary.id}
                  type="apiary"
                  label="Verwijder"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <h2 style={{ 
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: "500",
            marginBottom: "var(--space-6)"
          }}>
            Locatie & Foerageergebied
          </h2>
          
          <div className="grid grid--cols-two gap-lg">
            <div className="card">
              <h3 style={{ 
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "var(--space-4)",
                color: "var(--color-text)"
              }}>
                Coördinaten
              </h3>
              <div style={{ marginBottom: "var(--space-4)" }}>
                <p style={{ 
                  fontSize: "0.875rem",
                  color: "var(--color-text-light)",
                  marginBottom: "var(--space-2)"
                }}>
                  GPS Locatie
                </p>
                <p style={{ 
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem"
                }}>
                  {apiary?.latitude.toFixed(6)}, {apiary?.longitude.toFixed(6)}
                </p>
              </div>
              <a 
                href={`https://www.google.com/maps?q=${apiary?.latitude},${apiary?.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button className="btn btn--secondary btn--sm" style={{ width: "100%" }}>
                  Open in Google Maps
                </button>
              </a>
            </div>

            <div className="card">
              <h3 style={{ 
                fontFamily: "var(--font-body)",
                fontSize: "1.125rem",
                fontWeight: 600,
                marginBottom: "var(--space-2)"
              }}>
                Kaartlagen
              </h3>
              <p style={{ 
                fontSize: "0.875rem",
                color: "var(--color-text-light)",
                lineHeight: 1.6,
                marginBottom: "var(--space-4)"
              }}>
                Activeer nuttige informatie op de kaart voor tijdens je wandelingen in het foerageergebied.
              </p>

              <div className="map-controls">
                <div className="map-control-item">
                  <div className="map-control-item__label">
                    <p className="map-control-item__title">Plantwaarnemingen</p>
                    <p className="map-control-item__desc">Bijvriendelijke planten via waarnemingen.be</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="plantToggle" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="map-control-item">
                  <div className="map-control-item__label">
                    <p className="map-control-item__title">Afstandsindicatie</p>
                    <p className="map-control-item__desc">Toon afstand tot planten in popups</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="distanceToggle" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="map-control-item">
                  <div className="map-control-item__label">
                    <p className="map-control-item__title">Alleen binnen 2 km</p>
                    <p className="map-control-item__desc">Filter planten op primair foerageergebied</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="rangeToggle" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="map-control-item">
                  <div className="map-control-item__label">
                    <p className="map-control-item__title">Bloeitijd huidige maand</p>
                    <p className="map-control-item__desc">Toon alleen wat nu bloeit</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" id="seasonToggle" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="map-legend">
                <div className="map-legend-item">
                  <div className="map-legend-circle" style={{ color: "#3b82f6" }}></div>
                  <span>2 km (80% foerageergebied)</span>
                </div>
                <div className="map-legend-item">
                  <div className="map-legend-circle" style={{ color: "#9333ea" }}></div>
                  <span>7 km (maximaal bereik)</span>
                </div>
                <div className="map-legend-item">
                  <div style={{ 
                    width: "12px", 
                    height: "12px", 
                    borderRadius: "50%", 
                    background: "#f97316" 
                  }}></div>
                  <span>Nectarplanten</span>
                </div>
                <div className="map-legend-item">
                  <div style={{ 
                    width: "12px", 
                    height: "12px", 
                    borderRadius: "50%", 
                    background: "#dc2626" 
                  }}></div>
                  <span>Stuifmeelbronnen</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="map-container" style={{ height: "600px" }}>
            <ApiaryMapWrapper
              latitude={apiary?.latitude!}
              longitude={apiary?.longitude!}
              apiaryName={apiary?.name || ''}
            />
          </div>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">
              Kasten in deze stand
            </h2>
            {hives.length > 0 && (
              <Link href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}>
                <button className="btn btn--primary">
                  + Nieuwe kast
                </button>
              </Link>
            )}
          </div>

          {hives?.length ? (
            <>
              <div className="grid grid--3">
                {hives.map(hive => (
                  <Link
                    key={hive.id}
                    href={`/hives/${hive.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card">
                      <p className="card__category">
                        Kast
                      </p>
                      <h3 className="card__title">
                        {hive.name}
                      </h3>
                      <div className="card__divider">
                        <p className="card__label">Bijenstand</p>
                        <p className="card__value">{apiary?.name}</p>
                        <p className="card__label">Type kast</p>
                        <p className="card__value">{hive.type}</p>
                        <p className="card__label">Type volk</p>
                        <p className="card__value">{hive.colonyType}</p>
                        <p className="card__label">Observaties</p>
                        <p className="card__value">{hive.observations.length}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  gap: "var(--space-4)",
                  marginTop: "var(--space-12)"
                }}>
                  <Link href={`/apiaries/${apiaryId}?page=${currentPage > 1 ? currentPage - 1 : 1}`}>
                    <button className="btn btn--secondary" disabled={currentPage === 1}>
                      Vorige
                    </button>
                  </Link>
                  <span style={{ color: "var(--color-text-light)" }}>
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link href={`/apiaries/${apiaryId}?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}>
                    <button className="btn btn--secondary" disabled={currentPage === totalPages}>
                      Volgende
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-16) 0" }}>
              <h2 style={{ 
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: "400",
                marginBottom: "var(--space-4)"
              }}>
                Nog geen kasten
              </h2>
              <p style={{ 
                color: "var(--color-text-light)",
                marginBottom: "var(--space-8)"
              }}>
                Voeg uw eerste bijenkast toe aan deze stand
              </p>
              <Link href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}>
                <button className="btn btn--primary btn--lg">
                  + Eerste kast toevoegen
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
