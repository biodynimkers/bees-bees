import { prisma } from '@/lib/client';
import ApiariesFilter from '@/components/admin/ApiariesFilter';
import Link from 'next/link';

export default async function AdminApiariesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParamsResult = await searchParams;
  const apiariesPerPage = 50; // Meer items voor filtering
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const totalApiaries = await prisma.apiary.count();
  const totalPages = Math.ceil(totalApiaries / apiariesPerPage);

  const apiaries = await prisma.apiary.findMany({
    skip: (currentPage - 1) * apiariesPerPage,
    take: apiariesPerPage,
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
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header__top">
            <h1 className="page-header__title">Alle bijenstanden</h1>
            <p className="page-header__subtitle">
              Totaal: {totalApiaries} {totalApiaries === 1 ? "bijenstand" : "bijenstanden"}
            </p>
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <ApiariesFilter
            apiaries={apiaries}
            currentPath={'/admin/apiaries'}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
