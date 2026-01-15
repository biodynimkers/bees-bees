import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import { notFound } from 'next/navigation';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
export const dynamic = 'force-dynamic';
 
export default async function AccountApiaryHivePage({
  params,
  searchParams,
}: {
  params: Promise<{ hiveId: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { hiveId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');
 
  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    include: {
      apiary: true,
    },
  });
 
  if (!hive) {
    notFound();
  }
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const totalObservations = await prisma.observation.count({
    where: { hiveId: parseInt(hiveId) },
  });
  const observationsPerPage = 20;
  const totalPages = Math.ceil(totalObservations / observationsPerPage);
  const observations = await prisma.observation.findMany({
    where: { hiveId: parseInt(hiveId) },
    include: {
      hive: {
        include: {
          apiary: {
            include: {
              user: true,
            },
          },
        },
      },
    },
    skip: (currentPage - 1) * observationsPerPage,
    take: observationsPerPage,
    orderBy: { createdAt: 'desc' },
  });
 
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "var(--space-12)" }}>
            <div>
              <h1 className="heading-primary">{hive.name} ({totalObservations} {totalObservations === 1 ? 'waarneming' : 'waarnemingen'})</h1>
            </div>
            <div className="page-header__actions">
              <Link
                href={`/observations/new?hiveId=${hiveId}&hiveName=${hive.name}`}
              >
                <button className="btn btn--secondary">
                  + Waarneming toevoegen
                </button>
              </Link>
              <Link href={`/hives/${hive.id}/edit`}>
                <button className="btn btn--secondary">Wijzig kast</button>
              </Link>
              {hive && (
                <DeleteEntityButton id={hive.id} type="hive" label="Verwijder" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alternate">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Kast informatie</h2>
          </div>
          <div className="grid grid-two-columns">
            <div className="card">
              <p className="card__label">Bijenstand</p>
              <p className="card__value">{hive.apiary.name}</p>
              <p className="card__label">Type kast</p>
              <p className="card__value">{hive.type}</p>
              <p className="card__label">Type volk</p>
              <p className="card__value">{hive.colonyType}</p>
            </div>
            <div className="card">
              <p className="card__label">Foto</p>
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: 'var(--color-soft-gray)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-light)',
                fontSize: '0.875rem',
                border: '1px dashed rgba(0, 0, 0, 0.15)'
              }}>
                Geen foto geüpload
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Waarnemingen</h2>
          </div>
 
          {observations.length > 0 ? (
            <>
              <section className="section ">
                <div className="container">
                  <ObservationsFilter
                    observations={observations}
                    showHive={false}
                    showApiary={false}
                    showUser={false}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    currentPath={`/hives/${hiveId}`}
                  />
                </div>
              </section>
            </>
          ) : (
            <div
              className="card"
              style={{ textAlign: 'center', padding: 'var(--space-16)' }}
            >
              <p style={{ color: 'var(--color-text-light)' }}>
                Nog geen waarnemingen
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}