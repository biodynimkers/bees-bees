import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import HivesTable from '@/components/admin/HivesTable';

export default async function UserHivesPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();

  const { userId } = await params;
  const searchParamsResult = await searchParams;
  const hivesPerPage = 5;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const totalHives = await prisma.hive.count({
    where: {
      apiary: { userId },
    },
  });
  const totalPages = Math.ceil(totalHives / hivesPerPage);

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
    skip: (currentPage - 1) * hivesPerPage,
    take: hivesPerPage,
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
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">Behuizingen van {user.name}</h1>
          <p className="page-header__subtitle">
            Totaal: {totalHives} {totalHives === 1 ? 'behuizing' : 'behuizingen'}
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <Link href={`/admin/users/${userId}`}>
              <button className="btn btn--secondary">← Terug naar imker</button>
            </Link>
          </div>

          <HivesTable
            hives={hives}
            showApiary={true}
            showUser={false}
            currentPath={`/admin/users/${userId}/hives`}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </>
  );
}
