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
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="page-header">
          <h1 className="title">Mijn observaties</h1>
        </div>

        {observations.length > 0 ? (
          <>
            <div className="observations-list">
              {observations.map(observation => (
                <Link
                  key={observation.id}
                  href={`/observations/${observation.id}`}
                  className="observation-card observation-card--link"
                >
                  <div className="observation-card__header">
                    <h3 className="card__title">
                      {new Date(observation.createdAt).toLocaleDateString(
                        'nl-BE'
                      )}{' '}
                      {new Date(observation.createdAt).toLocaleTimeString(
                        'nl-BE',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </h3>
                    <h2>{observation.hive.name}</h2>
                    <span className="badge">{observation.beeCount} bijen</span>
                  </div>
                  <p className="card__text text-secondary">
                    {observation.hive.type} - {observation.hive.apiary.name}
                  </p>
                  {observation.pollenColor && (
                    <p className="card__text">
                      Stuifmeelkleur: {observation.pollenColor}
                    </p>
                  )}
                </Link>
              ))}
            </div>
            <div>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/observations?page=${
                  currentPage > 1 ? currentPage - 1 : currentPage
                }`}
              >
                Vorige pagina
              </Link>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/observations?page=${
                  currentPage < totalPages ? currentPage + 1 : currentPage
                }`}
              >
                Volgende pagina
              </Link>
              <div
                style={{
                  backgroundColor: 'lightBlue',
                  display: 'inline-block',
                }}
              >
                {`pagina ${currentPage} van ${totalPages} `}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2 className="section__title">Nog geen observaties</h2>
            <p className="text-secondary mb-lg">
              Begin met het toevoegen van observaties aan uw kasten
            </p>
            <Link
              href="/account/apiaries"
              className="button button--primary button--large"
            >
              Naar bijenstanden
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
