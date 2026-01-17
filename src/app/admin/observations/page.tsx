import { prisma } from '@/lib/client';
import { redirect } from 'next/navigation';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { pollenColors } from '@/lib/pollenColors';

export const dynamic = 'force-dynamic';

type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
};

export default async function AdminObservationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const search = searchParamsResult?.search ?? '';
  const colorFilter = searchParamsResult?.color ?? '';
  const observationsPerPage = 5;

  // ADMIN: geen userId-filter
  const baseWhere = {};

  const whereClause: any = { ...baseWhere };

  // Add search filter
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

  // Add color filter
  if (colorFilter) {
    whereClause.pollenColor = {
      contains: colorFilter,
    };
  }

  const totalObservations = await prisma.observation.count({
    where: whereClause,
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);

  // Get all unique colors for filter dropdown
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
        include: {
          apiary: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header__top">
            <h1 className="heading-primary">Alle waarnemingen</h1>
            <p className="page-header__subtitle">
              Totaal: {totalObservations}{' '}
              {totalObservations === 1 ? 'waarneming' : 'waarnemingen'}
              {search && ` (gefilterd op "${search}")`}
              {colorFilter && ` (kleur: ${colorFilter})`}
            </p>
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <ObservationsFilter
            observations={observations}
            showHive={true}
            showApiary={true}
            showUser={true}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={'/admin/observations'}
            search={search}
            colorFilter={colorFilter}
            allColors={allColors}
            placeholder="Zoek op bijenstand, kast of notities"
          />
        </div>
      </section>
    </>
  );
}
