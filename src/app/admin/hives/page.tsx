import prisma from '@/lib/client';
import HivesFilter from '@/components/admin/HivesFilter';
import { requireAdmin } from '@/lib/auth-helpers';
import { HIVE_TYPES, COLONY_TYPES } from '@/lib/hiveOptions';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

type SearchParams = {
  page?: string;
  search?: string;
  type?: string;
  colony?: string;
};

export default async function AdminHivesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const searchParamsResult = await searchParams;
  const {
    page = '1',
    search = '',
    type = '',
    colony = '',
  } = searchParamsResult;
  const currentPage = Number(page);
  const hivesPerPage = 20;
  // const totalHives = await prisma.hive.count();

  const baseWhere = {};

  const whereClause: any = { ...baseWhere };

  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        apiary: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  if (type) {
    whereClause.type = type;
  }

  if (colony) {
    whereClause.colonyType = colony;
  }

  const totalHives = await prisma.hive.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalHives / hivesPerPage);

  const hives = await prisma.hive.findMany({
    where: whereClause,
    skip: (currentPage - 1) * hivesPerPage,
    take: hivesPerPage,
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
      _count: {
        select: { observations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  const types = HIVE_TYPES;
  const colonies = COLONY_TYPES;

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {totalHives} {totalHives === 1 ? 'behuizing' : 'behuizingen'}
            </span>
            <h1 className="platform-hero__title">Alle behuizingen</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Behuizingen' }]} />

      <section className="home-features">
        <div className="container">
          <HivesFilter
            hives={hives}
            showApiary={true}
            showUser={true}
            currentPath={'/admin/hives'}
            totalPages={totalPages}
            currentPage={currentPage}
            search={search}
            typeFilter={type}
            colonyFilter={colony}
            types={types}
            colonies={colonies}
          />
        </div>
      </section>
    </div>
  );
}
