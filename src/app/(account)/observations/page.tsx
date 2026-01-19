import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import { pollenColors } from '@/lib/pollenColors';

export const dynamic = 'force-dynamic';

type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
};
export default async function AccountObservationsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
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

  const searchParamsResult = await searchParams;

  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const search = searchParamsResult?.search ?? '';
  const colorFilter = searchParamsResult?.color ?? '';
  const observationsPerPage = 5;

  // Build dynamic where clause based on search parameters
  const baseWhere = {
    hive: {
      apiary: {
        userId: userId,
      },
    },
  };

  const whereClause: any = { ...baseWhere }; //uitbreiden met zoekfilter en kleurfilter

  // search filter toevoegen
  if (search) {
    whereClause.OR = [
      {
        notes: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        hive: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      {
        hive: {
          apiary: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    ];
  }

  // kleurfilter toevoegen, later vervangen door een apart model voor kleuren (model ObservationColor)!
  if (colorFilter) {
    whereClause.pollenColor = {
      contains: colorFilter,
    };
  }

  const totalObservations = await prisma.observation.count({
    where: whereClause,
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);

  const allColors = pollenColors
    .filter(c => !c.isNoPollenOption)
    .map(c => ({
      value: c.hex, // hier ga ik op filteren
      label: c.species.join(', '), // optioneel voor weergave
      hex: c.hex,
    }));

  const observations = await prisma.observation.findMany({
    where: whereClause,
    skip: (currentPage - 1) * observationsPerPage,
    take: observationsPerPage,
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
          <div className="nav__container" style={{ padding: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div>
                <h1 className="heading-primary">
                  Mijn waarnemingen ({totalObservations})
                </h1>
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
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <ObservationsFilter
            observations={observations}
            showHive={true}
            showApiary={true}
            showUser={false}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={`/observations`}
            search={search}
            colorFilter={colorFilter}
            allColors={allColors}
            placeholder="Zoek op bijenstand, behuizing of notities"
          />
        </div>
      </section>
    </>
  );
}
