import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import HivesTable from '@/components/admin/HivesTable';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

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
  const hivesPerPage = 20;
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
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {totalHives} {totalHives === 1 ? 'behuizing' : 'behuizingen'}
            </span>
            <h1 className="platform-hero__title">Behuizingen van {user.name}</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Gebruikers', href: '/admin/users' }, { label: user.name, href: `/admin/users/${userId}` }, { label: 'Behuizingen' }]} />

      <section className="home-features">
        <div className="container">
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
    </div>
  );
}
