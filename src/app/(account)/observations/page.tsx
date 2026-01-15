import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import ObservationsFilter from '@/components/shared/ObservationsFilter';

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
          id: true,
          type: true,
          name: true,
          apiary: {
            include: {
              user: true, // If you need user data
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
          <h1 className="heading-primary">Mijn waarnemingen ({totalObservations} {totalObservations === 1 ? 'waarneming' : 'waarnemingen'})</h1>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          {observations.length > 0 ? (
        <>
          <div className="section-header">
            <h2 className="heading-secondary">
              Overzicht
            </h2>
            <Link href="/observations/new">
              <button className="btn btn--secondary">
                + Nieuwe waarneming
              </button>
            </Link>
          </div>

          <ObservationsFilter
            observations={observations}
            showHive={true}
            showApiary={true}
            showUser={false}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={`/observations`}
          />
        </>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: '400',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Nog geen observaties
              </h2>
              <p
                style={{
                  color: 'var(--color-text-light)',
                  marginBottom: 'var(--space-8)',
                }}
              >
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
