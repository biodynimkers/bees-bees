import prisma from '@/lib/client';
import { requireAdmin } from '@/lib/auth-helpers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ObservationsTable from '@/components/admin/ObservationsTable';

export default async function AdminHiveDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ hiveId: string }>;
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  await requireAdmin();
  const { returnUrl } = (await searchParams) || '/admin/hives';
  const { hiveId } = await params;
  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    include: {
      apiary: {
        include: {
          user: true,
        },
      },
      observations: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!hive) notFound();

  return (
    <div className="container" style={{ marginTop: '6rem' }}>
      <Link
        href={returnUrl ?? '/admin/hives'}
        className="button button--outline"
      >
        ← Terug
      </Link>
      <h1>{hive.name}</h1>
      <p>Type: {hive.type}</p>
      <p>Volk: {hive.colonyType}</p>
      <Link href={`/admin/apiaries/${hive.apiary.id}`}>
        Bijenstand: {hive.apiary.name}
      </Link>
      <h2 style={{ marginTop: '2rem' }}>Observaties</h2>
      <ObservationsTable
        observations={hive.observations}
        showUser={false}
        showHive={false}
        showApiary={false}
      />
    </div>
  );
}
