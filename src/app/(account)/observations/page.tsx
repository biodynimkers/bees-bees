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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-12)" }}>
            <div>
              <h1 className="heading-primary">Mijn waarnemingen ({totalObservations} {totalObservations === 1 ? 'waarneming' : 'waarnemingen'})</h1>
            </div>
            <div className="page-header__actions">
              <Link href="/observations/new">
                <button className="btn btn--secondary">
                  + Nieuwe waarneming
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          {observations.length > 0 ? (
        <>
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
          ) : null}
        </div>
      </section>
    </>
  );
}
