import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import ObservationsTable from '@/components/shared/ObservationsTable';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
export default async function AdminUserObservationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdmin();
  const { userId } = await params;
  const { page } = await searchParams;
  const observationsPerPage = 20;
  const currentPage = Number(page ?? '1');
  const totalObservations = await prisma.observation.count({
    where: {
      hive: { apiary: { userId } },
    },
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);

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
    skip: (currentPage - 1) * observationsPerPage,
    take: observationsPerPage,

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
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {totalObservations}
            </span>
            <h1 className="platform-hero__title">Waarnemingen van {user.name}</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Gebruikers', href: '/admin/users' }, { label: user.name, href: `/admin/users/${userId}` }, { label: 'Waarnemingen' }]} />

      <section className="home-features">
        <div className="container">
          <ObservationsTable
            observations={observations}
            showUser={false}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={`/admin/users/${userId}/observations`}
          />
        </div>
      </section>
    </div>
  );
}
