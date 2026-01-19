import { prisma } from '@/lib/client';
import ApiariesFilter from '@/components/admin/ApiariesFilter';
import { requireAdmin } from '@/lib/auth-helpers';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

type SearchParams = {
  page?: string;
  search?: string;
};

export default async function AdminApiariesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
 await requireAdmin();

  const searchParamsResult = (await searchParams) || {};
  const { page = '1', search = '' } = searchParamsResult;

  const apiariesPerPage = 20;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const totalApiaries = await prisma.apiary.count();
  const totalPages = Math.ceil(totalApiaries / apiariesPerPage);

  const apiaries = await prisma.apiary.findMany({
    skip: (currentPage - 1) * apiariesPerPage,
    take: apiariesPerPage,
    where: {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { hives: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {totalApiaries} {totalApiaries === 1 ? 'bijenstand' : 'bijenstanden'}
            </span>
            <h1 className="platform-hero__title">Alle bijenstanden</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Bijenstanden' }]} />

      <section className="home-features">
        <div className="container">
          <ApiariesFilter
            apiaries={apiaries}
            currentPath={'/admin/apiaries'}
            totalPages={totalPages}
            currentPage={currentPage}
            search={search}
          />
        </div>
      </section>
    </div>
  );
}
