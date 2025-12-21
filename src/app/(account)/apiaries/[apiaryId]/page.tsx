import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';

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
          <div className="grid grid--2" style={{ alignItems: "flex-start", gap: "var(--space-16)" }}>
            <div>
              <h2 style={{ 
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: "500",
                marginBottom: "var(--space-6)"
              }}>
                Locatie details
              </h2>
              <div className="card" style={{ marginBottom: "var(--space-8)" }}>
                <div style={{ marginBottom: "var(--space-4)" }}>
                  <p style={{ 
                    fontSize: "0.875rem",
                    color: "var(--color-text-light)",
                    marginBottom: "var(--space-2)"
                  }}>
                    Coördinaten
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
            </div>

            <div>
              <div 
                style={{
                  width: "100%",
                  height: "400px",
                  background: "rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${apiary?.latitude},${apiary?.longitude}&zoom=15&maptype=satellite`}
                />
              </div>
            </div>
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
                      <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-light)', marginBottom: 'var(--space-3)', fontWeight: '600' }}>
                        Kast
                      </p>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: '400', marginBottom: 'var(--space-4)' }}>
                        {hive.name}
                      </h3>
                      <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
                        <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-light)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Bijenstand</p>
                        <p style={{ fontSize: '0.9375rem', marginBottom: 'var(--space-3)' }}>{apiary?.name}</p>
                        <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-light)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Type kast</p>
                        <p style={{ fontSize: '0.9375rem', marginBottom: 'var(--space-3)' }}>{hive.type}</p>
                        <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-light)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Type volk</p>
                        <p style={{ fontSize: '0.9375rem', marginBottom: 'var(--space-3)' }}>{hive.colonyType}</p>
                        <p style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-light)', marginBottom: 'var(--space-2)', fontWeight: '600' }}>Observaties</p>
                        <p style={{ fontSize: '0.9375rem' }}>{hive.observations.length}</p>
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
