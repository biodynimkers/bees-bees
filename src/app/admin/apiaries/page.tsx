import { prisma } from '@/lib/client';
import ApiariesTable from '@/components/admin/ApiariesTable';
import Link from 'next/link';

export default async function AdminApiariesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParamsResult = await searchParams;
  const apiariesPerPage = 5;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const totalApiaries = await prisma.apiary.count();
  const totalPages = Math.ceil(totalApiaries / apiariesPerPage);

  const apiaries = await prisma.apiary.findMany({
    skip: (currentPage - 1) * apiariesPerPage,
    take: apiariesPerPage,
    include: {
      user: true,
      _count: {
        select: { hives: true },
      },
    },
  });

  return (
    <div style={{ marginTop: '6rem' }}>
      <Link href="/admin/">Naar startpagina beheerder</Link>
      <ApiariesTable
        apiaries={apiaries}
        showUser={true}
        currentPath={'/admin/apiaries'}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
