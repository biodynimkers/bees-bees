import prisma from '@/lib/client';
import ApiariesTable from '@/components/admin/ApiariesTable';
import { requireAdmin } from '@/lib/auth-helpers';
import Link from 'next/link';
export default async function AdminUserApiariesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdmin(); // Zorgt ervoor dat alleen admins toegang hebben
  const { userId } = await params;
  const apiaries = await prisma.apiary.findMany({
    where: { userId },
    include: { user: true, _count: true },
  });

  return (
    <div style={{ marginTop: '6rem' }}>
      <Link href={`/admin/users/${userId}`}>Terug naar de Imker</Link>
      <ApiariesTable
        apiaries={apiaries}
        showUser={false}
        currentPath={`/admin/users/${userId}/apiaries`}
      />
    </div>
  );
}
