import prisma from '@/lib/client';
import { requireAdmin } from '@/lib/auth-helpers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ObservationsTable from '@/components/shared/ObservationsTable';

export default async function AdminHiveDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ hiveId: string }>;
  searchParams: Promise<{ returnUrl?: string; page?: string }>;
}) {
  await requireAdmin();
  const { returnUrl } = (await searchParams) || '/admin/hives';
  const { page } = await searchParams;
  const { hiveId } = await params;
  const observationsPerPage = 5;
  const currentPage = Number(page ?? '1');
  const totalObservations = await prisma.observation.count({
    where: { hiveId: parseInt(hiveId) },
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);
  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },

    include: {
      apiary: {
        include: {
          user: true,
        },
      },
      observations: {
        skip: (currentPage - 1) * observationsPerPage,
        take: observationsPerPage,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!hive) {
    notFound();
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">{hive.name}</h1>
          <p className="page-header__subtitle">
            Type: {hive.type} | Volk: {hive.colonyType}
          </p>
          <p className="page-header__subtitle">
            Bijenstand:{' '}
            <Link href={`/admin/apiaries/${hive.apiary.id}`}>
              {hive.apiary.name}
            </Link>
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Waarnemingen</h2>
            <Link href={returnUrl ?? '/admin/hives'}>
              <button className="btn btn--secondary">← Terug</button>
            </Link>
          </div>

          <ObservationsTable
            observations={hive.observations}
            showUser={false}
            showHive={false}
            showApiary={false}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={`/admin/hives/${hiveId}`}
          />
        </div>
      </section>
    </>
  );
}
