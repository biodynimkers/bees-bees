import prisma from '@/lib/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-helpers';
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
      <table className="table">
        <thead>
          <tr>
            <th>Naam</th>
            <th>Type</th>
            <th>Volk</th>
            <th>Waarnemingen</th>
          </tr>
        </thead>
        <tbody>
          {apiary.hives.map(hive => (
            <tr key={hive.id}>
              <td>
                <Link href={`/admin/hives/${hive.id}`}>{hive.name}</Link>
              </td>
              <td>{hive.type}</td>
              <td>{hive.colonyType}</td>
              <td>{hive._count.observations}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
