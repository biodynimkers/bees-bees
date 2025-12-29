import prisma from '@/lib/client';
import HivesTable from '@/components/admin/HivesTable';
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
  const hivesPerPage = 5;
  const totalHives = await prisma.hive.count();
  const totalPages = Math.ceil(totalHives / hivesPerPage);

  const hives = await prisma.hive.findMany({
    include: {
      apiary: {
        include: {
          user: true,
        },
      },
      _count: {
        select: { observations: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <Link href="/admin/">Naar startpagina beheerder</Link>
      <h1>Alle Kasten</h1>
      <p className="subtitle">Totaal: {hives.length} kasten</p>

      <HivesTable
        hives={hives}
        showApiary={true}
        showUser={true}
        currentPath={'/admin/hives'}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
