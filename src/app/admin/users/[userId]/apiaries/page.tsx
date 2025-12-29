import prisma from '@/lib/client';
import ApiariesTable from '@/components/admin/ApiariesTable';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
export default async function AdminUserApiariesPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin(); // Zorgt ervoor dat alleen admins toegang hebben

  const { userId } = await params;
  const searchParamsResult = await searchParams;
  const apiariesPerPage = 5;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const totalApiaries = await prisma.apiary.count();
  const totalPages = Math.ceil(totalApiaries / apiariesPerPage);
  const apiaries = await prisma.apiary.findMany({
    where: { userId },
    skip: (currentPage - 1) * apiariesPerPage,
    take: apiariesPerPage,
    include: { user: true, _count: true },
  });

  return (
    <div style={{ marginTop: '6rem' }}>
      <Link href={`/admin/users/${userId}`}>Terug naar de Imker</Link>
      <ApiariesTable
        apiaries={apiaries}
        showUser={false}
        currentPath={`/admin/users/${userId}/apiaries`}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
}
