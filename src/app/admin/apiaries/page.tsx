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
          <h1 className="page-header__title">Alle bijenstanden</h1>
          <p className="page-header__subtitle">
            Totaal: {totalApiaries} {totalApiaries === 1 ? 'bijenstand' : 'bijenstanden'}
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="section-header">
            <Link href="/admin">
              <button className="btn btn--secondary">← Terug naar dashboard</button>
            </Link>
          </div>
          
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
