import { prisma } from '@/lib/client';
import ApiariesTable from '@/components/admin/ApiariesTable';
export default async function AdminApiariesPage() {
  const apiaries = await prisma.apiary.findMany({
    include: {
      user: true,
      _count: {
        select: { hives: true },
      },
    },
  });
  return <ApiariesTable apiaries={apiaries} showUser={true} />;
}
