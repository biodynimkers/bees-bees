import prisma from '@/lib/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-helpers';
import HivesTable from '@/components/admin/HivesTable';
export default async function ApiaryDetailPage({
  params,
}: {
  params: Promise<{ apiaryId: string }>;
}) {
  const { apiaryId } = await params;
  await requireAdmin();

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      hives: {
        include: {
          _count: { select: { observations: true } },
        },
      },
    },
  });

  if (!apiary) notFound();

  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <Link href="/admin/apiaries" className="button button--outline">
        ← Terug naar bijenstanden
      </Link>

      <h1>{apiary.name}</h1>
      <p>
        Eigenaar:{' '}
        <Link href={`/admin/users/${apiary.user.id}`}>{apiary.user.name}</Link>
      </p>
      <p>
        Locatie: {apiary.latitude}, {apiary.longitude}
      </p>

      <h2 style={{ marginTop: '2rem' }}>Kasten in deze bijenstand</h2>
      <HivesTable
        hives={apiary.hives}
        showApiary={false}
        currentPath={`/admin/apiaries/${apiaryId}`}
      />
    </div>
  );
}
