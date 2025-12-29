import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import HivesTable from '@/components/admin/HivesTable';

export default async function UserHivesPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdmin();

  const { userId } = await params;

  // Get user info
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    redirect('/admin/users');
  }

  const hives = await prisma.hive.findMany({
    where: {
      apiary: { userId },
    },
    include: {
      apiary: {
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          observations: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href={`/admin/users/${userId}`}
          className="button button--outline"
        >
          ← Terug naar de imker
        </Link>
      </div>

      <h1>Kasten van {user.name}</h1>
      <p className="subtitle">Totaal: {hives.length} kasten</p>

      <HivesTable
        hives={hives}
        showApiary={true}
        showUser={false}
        currentPath={`/admin/users/${userId}/hives`}
      />
    </div>
  );
}
