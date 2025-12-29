import prisma from '@/lib/client';
import { requireAdmin } from '@/lib/auth-helpers';
import { notFound } from 'next/navigation';
import Link from 'next/link';

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
      <table className="table">
        <thead>
          <tr>
            <th>Datum</th>
            <th>Tijd</th>
            <th>Aantal bijen</th>
            <th>Stuifmeelkleur</th>
            <th>nota's</th>
          </tr>
        </thead>
        <tbody>
          {hive.observations.map(observation => (
            <tr key={observation.id}>
              <td>
                {new Date(observation.createdAt).toLocaleDateString('nl-BE', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </td>
              <td>
                {new Date(observation.createdAt).toLocaleTimeString('nl-BE', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </td>
              <td>{observation.beeCount}</td>
              <td>{observation.pollenColor}</td>
              <td>{observation.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
