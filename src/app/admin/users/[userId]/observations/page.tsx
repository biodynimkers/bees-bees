import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import ObservationsTable from '@/components/admin/ObservationsTable';
export default async function AdminUserObservationsPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdmin();
  const { userId } = await params;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    redirect('/admin/users');
  }

  // Get all observations
  const observations = await prisma.observation.findMany({
    where: {
      hive: {
        apiary: {
          userId,
        },
      },
    },
    include: {
      hive: {
        include: {
          apiary: { include: { user: true } },
        },
      },
    },
  });
  return (
    <div style={{ marginTop: '6rem' }}>
      <Link href={`/admin/users/${userId}`} className="button button--outline">
        ← Terug naar de imker
      </Link>
      <h1>Observaties van {user.name}</h1>
      <ObservationsTable observations={observations} showUser={false} />
    </div>
  );
}
