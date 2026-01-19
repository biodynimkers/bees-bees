import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import ApiaryMapWrapper from '@/components/shared/ApiaryMapWrapper';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

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
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">{totalHives} {totalHives === 1 ? 'behuizing' : 'behuizingen'}</span>
            <h1 className="platform-hero__title">{apiary?.name}</h1>
            <div className="btn-group">
              <Link href={`/apiaries/${apiary?.id}/edit`} className="btn btn--secondary">
                Bewerk
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

      <Breadcrumbs items={[
        { label: 'Account', href: '/account' },
        { label: 'Bijenstanden', href: '/apiaries' },
        { label: apiary?.name || 'Bijenstand' }
      ]} />

      <section className="home-features">
        <div className="container">
          <h2 className="feature-card__title">Locatie & Foerageergebied</h2>
          
          <div className="map-layout">
            <div className="map-layout__map">
              <ApiaryMapWrapper
                latitude={apiary?.latitude!}
                longitude={apiary?.longitude!}
                showGbifData={true}
              />
            </div>

            <div className="map-layout__info">
              <Link href="/drachtkalender" className="btn btn--primary">
                Drachtkalender
              </Link>

              <div className="map-info-card">
                <h3 className="map-info-card__title">Foerageergebied</h3>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#FF0000' }}></span>
                  <span>200m</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#0000FF' }}></span>
                  <span>2 km</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: '#800080' }}></span>
                  <span>7 km</span>
                </div>
              </div>

              <div className="map-info-card">
                <h3 className="map-info-card__title">Kaart bedienen</h3>
                <ul className="map-info-list">
                  <li>Gebruik +/- om te zoomen</li>
                  <li>Sleep om te verplaatsen</li>
                  <li>Klik op Fullscreen voor groter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container">
          <div className="section-header">
            <h2 className="feature-card__title">Behuizingen in deze stand</h2>
            {hives.length > 0 && (
              <Link href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`} className="btn btn--secondary">
                + Nieuwe behuizing
              </Link>
            )}
          </div>

          {hives?.length ? (
            <>
              <div className="home-features__grid">
                {hives.map(hive => (
                  <Link
                    key={hive.id}
                    href={`/hives/${hive.id}`}
                    className="feature-card"
                  >
                    <span className="feature-card__label">Behuizing</span>
                    <h3 className="feature-card__title">{hive.name}</h3>
                    <div className="feature-card__meta">
                      <div className="meta-item">
                        <span className="meta-label">Bijenstand</span>
                        <span className="meta-value">{apiary?.name}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Type behuizing</span>
                        <span className="meta-value">{hive.type}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Variëteit</span>
                        <span className="meta-value">{hive.colonyType}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Waarnemingen</span>
                        <span className="meta-value">{hive.observations.length}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <Link href={`/apiaries/${apiaryId}?page=${currentPage > 1 ? currentPage - 1 : 1}`} className="btn btn--secondary">
                    Vorige
                  </Link>
                  <span className="pagination-info">
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link href={`/apiaries/${apiaryId}?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`} className="btn btn--secondary">
                    Volgende
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h2 className="feature-card__title">Nog geen behuizingen</h2>
              <p className="feature-card__text">Voeg uw eerste behuizing toe aan deze stand</p>
              <Link href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`} className="btn btn--primary">
                + Eerste behuizing toevoegen
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
