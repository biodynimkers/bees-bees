import prisma from '@/lib/client';
import HivesFilter from '@/components/admin/HivesFilter';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';

export default async function AdminHivesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const searchParamsResult = await searchParams;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const hivesPerPage = 50;
  const totalHives = await prisma.hive.count();
  const totalPages = Math.ceil(totalHives / hivesPerPage);

  const hives = await prisma.hive.findMany({
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

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header__top">
            <h1 className="page-header__title">Alle kasten</h1>
            <p className="page-header__subtitle">
              Totaal: {totalHives} {totalHives === 1 ? "kast" : "kasten"}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <HivesFilter
            hives={hives}
            showApiary={true}
            showUser={true}
            currentPath={'/admin/hives'}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
