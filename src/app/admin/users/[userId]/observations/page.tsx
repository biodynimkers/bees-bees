import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/auth-helpers';
import ObservationsTable from '@/components/shared/ObservationsTable';
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
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">Waarnemingen van {user.name}</h1>
          <p className="page-header__subtitle">Totaal: {totalObservations}</p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <Link href={`/admin/users/${userId}`}>
              <button className="btn btn--secondary">← Terug naar imker</button>
            </Link>
          </div>

          <ObservationsTable
            observations={observations}
            showUser={false}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={`/admin/users/${userId}/observations`}
          />
        </div>
      </section>
    </>
  );
}
