import { prisma } from '@/lib/client';
import ApiariesTable from '@/components/admin/ApiariesTable';
import Link from 'next/link';

export default async function AdminApiariesPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const { returnUrl } = (await searchParams) || '/admin';
  const apiaries = await prisma.apiary.findMany({
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
      />
    </div>
  );
}
