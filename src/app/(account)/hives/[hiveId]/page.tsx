import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';

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

  if (!hive) redirect('/apiaries');
  const apiaryId = hive.apiary.id;
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const totalObservations = await prisma.observation.count({
    where: { hiveId: parseInt(hiveId) },
  });
  const observationsPerPage = 3;
  const totalPages = Math.ceil(totalObservations / observationsPerPage);
  const observations = await prisma.observation.findMany({
    where: { hiveId: parseInt(hiveId) },
    skip: (currentPage - 1) * observationsPerPage,
    take: observationsPerPage,
  });

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">{hive.name}</h1>
          <p className="page-header__subtitle">
            Bijenstand: {hive.apiary.name}
          </p>
          
          <div className="page-header__meta">
            <div className="page-header__meta-item">
              <span className="page-header__meta-label">Type kast</span>
              <span className="page-header__meta-value">{hive.type}</span>
            </div>
            <div className="page-header__meta-item">
              <span className="page-header__meta-label">Type volk</span>
              <span className="page-header__meta-value">{hive.colonyType}</span>
            </div>
            <div className="page-header__meta-item">
              <span className="page-header__meta-label">Observaties</span>
              <span className="page-header__meta-value">{totalObservations}</span>
            </div>
          </div>

          <div className="page-header__actions">
            <Link href={`/observations/new?hiveId=${hiveId}&hiveName=${hive.name}`}>
              <button className="btn btn--primary">+ Observatie toevoegen</button>
            </Link>
            <Link href={`/hives/${hive.id}/edit`}>
              <button className="btn btn--secondary">Wijzig kast</button>
            </Link>
            {hive && (
              <DeleteEntityButton
                id={hive.id}
                type="hive"
                label="Verwijder"
              />
            )}
          </div>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">
              Observaties
            </h2>
          </div>

          {observations.length > 0 ? (
            <>
              <div className="grid grid--3">
                {observations.map(obs => (
                  <Link
                    key={obs.id}
                    href={`/observations/${obs.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card">
                      <p className="card__category">
                        Observatie
                      </p>
                      <h3 className="card__title">
                        {new Date(obs.createdAt).toLocaleDateString('nl-BE', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </h3>
                      <p className="card__date">
                        {new Date(obs.createdAt).toLocaleTimeString('nl-BE', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <div className="card__divider">
                        <p className="card__label">Bijenstand</p>
                        <p className="card__value">{hive.apiary.name}</p>
                        <p className="card__label">Kast</p>
                        <p className="card__value">{hive.name}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 'var(--space-3)',
                    marginTop: 'var(--space-12)',
                  }}
                >
                  {currentPage > 1 && (
                    <Link href={`/hives/${hiveId}?page=${currentPage - 1}`}>
                      <button className="btn btn--secondary">← Vorige</button>
                    </Link>
                  )}
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 var(--space-4)',
                      fontSize: '0.875rem',
                      color: 'var(--color-text-light)',
                    }}
                  >
                    Pagina {currentPage} van {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Link href={`/hives/${hiveId}?page=${currentPage + 1}`}>
                      <button className="btn btn--secondary">Volgende →</button>
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div
              className="card"
              style={{ textAlign: 'center', padding: 'var(--space-16)' }}
            >
              <p style={{ color: 'var(--color-text-light)' }}>
                Nog geen observaties
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
