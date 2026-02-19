import prisma from '@/lib/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-helpers';
import HivesTable from '@/components/admin/HivesTable';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import ApiaryMapWrapper from '@/components/shared/ApiaryMapWrapper';
export default async function ApiaryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ apiaryId: string }>;
  searchParams: Promise<{ returnUrl?: string; page?: string }>;
}) {
  const { apiaryId } = await params;
  const { page } = await searchParams;

  await requireAdmin();
  const { returnUrl } = (await searchParams) || '/admin/apiaries';
  const hivesPerPage = 20;
  const currentPage = Number(page ?? '1');
  const totalHives = await prisma.hive.count({
    where: { apiaryId: parseInt(apiaryId) },
  });
  const totalPages = Math.ceil(totalHives / hivesPerPage);

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    include: {
      user: { select: { id: true, name: true, email: true } },
      hives: {
        skip: (currentPage - 1) * hivesPerPage,
        take: hivesPerPage,
        include: {
          _count: { select: { observations: true } },
        },
      },
    },
  });

  if (!apiary) notFound();

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Eigenaar:{' '}
              <Link
                href={`/admin/users/${apiary.user.id}`}
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                {apiary.user.name}
              </Link>
            </span>
            <h1 className="platform-hero__title">{apiary.name}</h1>
            <p
              style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.85)',
                marginTop: '8px',
              }}
            >
              Locatie:{' '}
              {apiary.latitude && apiary.longitude
                ? `${apiary.latitude}, ${apiary.longitude}`
                : 'Niet ingesteld'}
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          returnUrl && returnUrl
            ? { label: 'Bijenstanden', href: returnUrl }
            : { label: 'Bijenstanden', href: '/admin/apiaries' },
          { label: apiary.name },
        ]}
      />

      {apiary.latitude && apiary.longitude && (
        <section className="home-features">
          <div className="container">
            <h2 className="feature-card__title">Locatie & Foerageergebied</h2>
            <div className="map-layout">
              <div className="map-layout__map">
                <ApiaryMapWrapper
                  latitude={apiary.latitude}
                  longitude={apiary.longitude}
                  showGbifData={true}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="home-features">
        <div className="container">
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: '400',
              marginBottom: 'var(--s-8)',
              color: 'rgb(14, 97, 93)',
            }}
          >
            Behuizingen in deze bijenstand
          </h2>

          <HivesTable
            hives={apiary.hives}
            showApiary={false}
            showUser={false}
            currentPath={`/admin/apiaries/${apiaryId}`}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </section>
    </div>
  );
}
