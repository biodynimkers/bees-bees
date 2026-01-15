import { prisma } from '@/lib/client';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import Link from 'next/link';

export default async function AdminObservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParamsResult = await searchParams;
  const currentPage = Number(searchParamsResult?.page ?? '1');
  const observationsPerPage = 5;
  const totalObservations = await prisma.observation.count();
  const totalPages = Math.ceil(totalObservations / observationsPerPage);

  const observations = await prisma.observation.findMany({
    skip: (currentPage - 1) * observationsPerPage,
    take: observationsPerPage,
    include: {
      hive: {
        include: {
          apiary: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div className="page-header__top">
            <h1 className="heading-primary">Alle waarnemingen</h1>
            <p className="page-header__subtitle">
              Totaal: {totalObservations} {totalObservations === 1 ? 'waarneming' : 'waarnemingen'}
            </p>
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <ObservationsFilter
            observations={observations}
            showHive={true}
            showApiary={true}
            showUser={true}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={'/admin/observations'}
          />
        </div>
      </section>
    </>
  );
}
