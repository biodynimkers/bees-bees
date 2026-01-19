import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import ApiaryMapWrapper from '@/components/shared/ApiaryMapWrapper';

export const dynamic = 'force-dynamic';

export default async function AccountApiaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ apiaryId: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { apiaryId } = await params;
  const apiaryOwner = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { userId: true },
  });

  if (!apiaryOwner) {
    redirect('/not-found');
  }

  if (
    apiaryOwner.userId !== session?.user.id &&
    session?.user.role !== 'ADMIN'
  ) {
    redirect('/unauthorized');
  }

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      userId: true,
    },
  });
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const totalHives = await prisma.hive.count({
    where: { apiaryId: parseInt(apiaryId) },
  });
  const hivesPerPage = 20;
  const totalPages = Math.ceil(totalHives / hivesPerPage);
  const hives = await prisma.hive.findMany({
    where: { apiaryId: parseInt(apiaryId) },
    skip: (currentPage - 1) * hivesPerPage,
    take: hivesPerPage,
    include: {
      observations: true,
    },
  });

  return (
    <>
      <section className="page-header" data-page="01">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 'var(--space-12)',
            }}
          >
            <div>
              <h1 className="heading-primary">
                {apiary?.name} ({totalHives})
              </h1>
            </div>
            <div className="page-header__actions">
              <Link href={`/apiaries/${apiary?.id}/edit`}>
                <button className="btn btn--secondary">Bewerk</button>
              </Link>
              {apiary && (
                <DeleteEntityButton
                  id={apiary.id}
                  type="apiary"
                  label="Verwijder"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alternate">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Locatie & Foerageergebied</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: 'var(--space-8)',
            }}
          >
            {/* Kaart Links - Groter */}
            <div style={{ minHeight: '600px' }}>
              <ApiaryMapWrapper
                latitude={apiary?.latitude!}
                longitude={apiary?.longitude!}
                showGbifData={true}
              />
            </div>

            {/* Info Rechts - Compacter */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <Link href="/drachtkalender">
                <button className="btn btn--primary" style={{ width: '100%' }}>
                  Drachtkalender
                </button>
              </Link>

              <div className="card" style={{ padding: 'var(--space-4)' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: 'var(--space-3)',
                  }}
                >
                  Foerageergebied
                </h3>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '3px',
                          background: '#FF0000',
                          borderRadius: '2px',
                          flexShrink: 0,
                        }}
                      ></div>
                      <span style={{ fontSize: '0.8rem' }}>200m</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '3px',
                          background: '#0000FF',
                          borderRadius: '2px',
                          flexShrink: 0,
                        }}
                      ></div>
                      <span style={{ fontSize: '0.8rem' }}>2 km</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '3px',
                          background: '#800080',
                          borderRadius: '2px',
                          flexShrink: 0,
                        }}
                      ></div>
                      <span style={{ fontSize: '0.8rem' }}>7 km</span>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: 'var(--space-3)',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #3b82f6',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: 'var(--space-2)',
                      color: 'var(--color-text)',
                    }}
                  >
                    Kaart bedienen
                  </h4>
                  <ul
                    style={{
                      fontSize: '0.9rem',
                      color: 'var(--color-text)',
                      lineHeight: 1.6,
                      margin: 0,
                      paddingLeft: 'var(--space-4)',
                    }}
                  >
                    <li>
                      Gebruik <strong>+/-</strong> om te zoomen
                    </li>
                    <li>
                      <strong>Sleep</strong> om te verplaatsen
                    </li>
                    <li>
                      Klik op <strong>Fullscreen</strong> voor groter
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Behuizingen in deze stand</h2>
            {hives.length > 0 && (
              <Link
                href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
              >
                <button className="btn btn--secondary">
                  + Nieuwe behuizing
                </button>
              </Link>
            )}
          </div>

          {hives?.length ? (
            <>
              <div className="grid grid-three-columns">
                {hives.map(hive => (
                  <Link
                    key={hive.id}
                    href={`/hives/${hive.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card">
                      <p className="card__category">Behuizing</p>
                      <h3 className="heading-tertiary">{hive.name}</h3>
                      <div className="card__divider">
                        <p className="card__label">Bijenstand</p>
                        <p className="card__value">{apiary?.name}</p>
                        <p className="card__label">Type behuizing</p>
                        <p className="card__value">{hive.type}</p>
                        <p className="card__label">Variëteit</p>
                        <p className="card__value">{hive.colonyType}</p>
                        <p className="card__label">Waarnemingen</p>
                        <p className="card__value">
                          {hive.observations.length}
                        </p>
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
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    marginTop: 'var(--space-12)',
                  }}
                >
                  <Link
                    href={`/apiaries/${apiaryId}?page=${currentPage > 1 ? currentPage - 1 : 1}`}
                  >
                    <button
                      className="btn btn--secondary"
                      disabled={currentPage === 1}
                    >
                      Vorige
                    </button>
                  </Link>
                  <span style={{ color: 'var(--color-text-light)' }}>
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link
                    href={`/apiaries/${apiaryId}?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
                  >
                    <button
                      className="btn btn--secondary"
                      disabled={currentPage === totalPages}
                    >
                      Volgende
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--space-16) 0' }}>
              <h2
                className="heading-secondary"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: '400',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Nog geen behuizingen
              </h2>
              <p
                style={{
                  color: 'var(--color-text-light)',
                  marginBottom: 'var(--space-8)',
                }}
              >
                Voeg uw eerste behuizing toe aan deze stand
              </p>
              <Link
                href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
              >
                <button className="btn btn--secondary btn--lg">
                  + Eerste behuizing toevoegen
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
