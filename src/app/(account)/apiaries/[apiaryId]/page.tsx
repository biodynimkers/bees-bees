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
              <h1 className="heading-primary">{apiary?.name}</h1>
              <div className="page-header__meta">
                <div className="page-header__meta-item">
                  <span className="page-header__meta-label">Kasten</span>
                  <span className="page-header__meta-value">{totalHives}</span>
                </div>
                <div className="page-header__meta-item">
                  <span className="page-header__meta-label">Coördinaten</span>
                  <span className="page-header__meta-value">
                    {apiary?.latitude.toFixed(6)}, {apiary?.longitude.toFixed(6)}
                  </span>
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

      <section className="section section-alternate">
        <div className="container">
          <h2 className="heading-secondary" style={{ 
            fontFamily: "var(--font-display)",
            fontSize: "1.5rem",
            fontWeight: "500",
            marginBottom: "var(--space-6)"
          }}>
            Locatie & Foerageergebied
          </h2>
          
          <div className="grid grid-two-columns gap-large">
            {/* Kaart Links */}
            <div>
              <ApiaryMapWrapper
                latitude={apiary?.latitude!}
                longitude={apiary?.longitude!}
              />
            </div>

            {/* Info Rechts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
              <div className="card">
                <h3 style={{ 
                  fontFamily: "var(--font-body)",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  marginBottom: "var(--space-4)"
                }}>
                  Foerageergebied
                </h3>

                <div style={{ marginBottom: "var(--space-6)" }}>
                  <h4 style={{ 
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "var(--space-2)",
                    color: "var(--color-text)"
                  }}>
               
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div style={{ 
                        width: "20px", 
                        height: "3px", 
                        background: "#FF0000",
                        borderRadius: "2px",
                        flexShrink: 0
                      }}></div>
                      <span style={{ fontSize: "0.875rem" }}>200m</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div style={{ 
                        width: "20px", 
                        height: "3px", 
                        background: "#0000FF",
                        borderRadius: "2px",
                        flexShrink: 0
                      }}></div>
                      <span style={{ fontSize: "0.875rem" }}>2 km</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <div style={{ 
                        width: "20px", 
                        height: "3px", 
                        background: "#800080",
                        borderRadius: "2px",
                        flexShrink: 0
                      }}></div>
                      <span style={{ fontSize: "0.875rem" }}>7 km</span>
                    </div>
                  </div>
                </div>

                <div style={{ 
                  padding: "var(--space-4)",
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "8px",
                  borderLeft: "3px solid #3b82f6"
                }}>
                  <h4 style={{ 
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "var(--space-2)",
                    color: "var(--color-text)"
                  }}>
                    Kaart bedienen
                  </h4>
                  <ul style={{ 
                    fontSize: "0.875rem",
                    color: "var(--color-text-light)",
                    lineHeight: 1.6,
                    margin: 0,
                    paddingLeft: "var(--space-5)"
                  }}>
                    <li>Gebruik <strong>+ en -</strong> knoppen om te zoomen</li>
                    <li><strong>Scroll</strong> met muis om in/uit te zoomen</li>
                    <li><strong>Sleep</strong> met muis om kaart te verplaatsen</li>
                    <li>Klik op <strong>Fullscreen</strong> voor groter beeld</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">
              Kasten in deze stand
            </h2>
            {hives.length > 0 && (
              <Link href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}>
                <button className="btn btn--secondary">
                  + Nieuwe kast
                </button>
              </Link>
            )}
          </div>

          {hives?.length ? (
            <>
              <div className="grid grid-three-columns">
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
                      <h3 className="heading-tertiary">
                        {hive.name}
                      </h3>
                      <div className="card__divider">
                        <p className="card__label">Bijenstand</p>
                        <p className="card__value">{apiary?.name}</p>
                        <p className="card__label">Type kast</p>
                        <p className="card__value">{hive.type}</p>
                        <p className="card__label">Type volk</p>
                        <p className="card__value">{hive.colonyType}</p>
                        <p className="card__label">Waarnemingen</p>
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
              <h2 className="heading-secondary" style={{ 
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
                <button className="btn btn--secondary btn--lg">
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
