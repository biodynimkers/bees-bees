import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function AccountObservationsPage(searchParams: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      apiaries: {
        include: {
          hives: {
            include: {
              observations: {
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) redirect('/auth/login');

  // const allObservations = user.apiaries.flatMap(apiary =>
  //   apiary.hives.flatMap(hive =>
  //     hive.observations.map(observation => ({
  //       ...observation,
  //       hiveName: hive.type,
  //       hiveId: hive.id,
  //       apiaryName: apiary.name,
  //       apiaryId: apiary.id,
  //     }))
  //   )
  // );

  const searchParamsResult = await searchParams.searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const observationsPerPage = 5;
  const totalObservations = await prisma.observation.count({
    where: {
      hive: {
        apiary: {
          userId: userId,
        },
      },
    },
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);
  const observations = await prisma.observation.findMany({
    where: {
      hive: {
        apiary: {
          userId: userId,
        },
      },
    },

    include: {
      hive: {
        select: {
          type: true,
          name: true,
          apiary: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="page-header__title">Mijn observaties</h1>
          <p className="page-header__subtitle">
            {totalObservations} {totalObservations === 1 ? 'waarneming' : 'waarnemingen'}
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          {observations.length > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
                <h2 style={{ 
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: "400"
                }}>
                  Mijn observaties
                </h2>
                <Link href="/hives">
                  <button className="btn btn--primary">
                    + Nieuwe observatie
                  </button>
                </Link>
              </div>

              <div className="grid grid--2">
                {observations.map(observation => (
                  <Link
                    key={observation.id}
                    href={`/observations/${observation.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                        <div>
                          <p className="card__category">
                            {new Date(observation.createdAt).toLocaleDateString('nl-BE')}
                          </p>
                          <h3 className="card__title">{observation.hive.name}</h3>
                        </div>
                        <span style={{ 
                          fontSize: "0.875rem",
                          padding: "var(--space-2) var(--space-3)",
                          background: "rgba(0, 0, 0, 0.05)",
                          borderRadius: "4px"
                        }}>
                          {new Date(observation.createdAt).toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="card__text" style={{ marginBottom: "var(--space-2)" }}>
                        {observation.hive.type} - {observation.hive.apiary.name}
                      </p>
                      <div style={{ display: "flex", gap: "var(--space-4)", fontSize: "0.875rem", color: "var(--color-text-light)" }}>
                        <span>{observation.beeCount} bijen</span>
                        {observation.pollenColor && (
                          <span>Stuifmeel: {observation.pollenColor}</span>
                        )}
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
                  <Link href={`/observations?page=${currentPage > 1 ? currentPage - 1 : 1}`}>
                    <button className="btn btn--secondary" disabled={currentPage === 1}>
                      Vorige
                    </button>
                  </Link>
                  <span style={{ color: "var(--color-text-light)" }}>
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link href={`/observations?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}>
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
                Nog geen observaties
              </h2>
              <p style={{ 
                color: "var(--color-text-light)",
                marginBottom: "var(--space-8)"
              }}>
                Begin met het toevoegen van observaties aan uw kasten
              </p>
              <Link href="/apiaries">
                <button className="btn btn--primary btn--lg">
                  Naar bijenstanden
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  
  );
}
