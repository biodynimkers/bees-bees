import { prisma } from '@/lib/client';
import ObservationsTable from '@/components/admin/ObservationsTable';
import Link from 'next/link';
export default async function AdminObservationsPage() {
  const observations = await prisma.observation.findMany({
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
      <Link href="/admin/">Naar startpagina beheerder</Link>
      <ObservationsTable
        observations={observations}
        showHive={true}
        showApiary={true}
        showUser={true}
      />
    </div>
  );
}
