import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import { notFound } from 'next/navigation';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import { pollenColors } from '@/lib/pollenColors';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';
import ScrollToSection from '@/components/shared/ScrollToSection';

export const dynamic = 'force-dynamic';
type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
  returnUrl?: string;
};

export default async function AccountApiaryHivePage({
  params,
  searchParams,
}: {
  params: Promise<{ hiveId: string }>;
  searchParams?: Promise<SearchParams>;
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
  const search = searchParamsResult?.search ?? '';
  const colorFilter = searchParamsResult?.color ?? '';
  const returnUrl = searchParamsResult?.returnUrl ?? '';
  const observationsPerPage = 20;

  const baseWhere = {
    hiveId: parseInt(hiveId, 10),
  };
  const whereClause: any = { ...baseWhere };

  if (search) {
    whereClause.OR = [
      {
        notes: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        hive: {
          apiary: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      },
    ];
  }

  if (colorFilter) {
    whereClause.pollenColor = {
      contains: colorFilter,
    };
  }

  const totalObservations = await prisma.observation.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalObservations / observationsPerPage);

  const allColors = pollenColors
    .filter(c => !c.isNoPollenOption)
    .map(c => ({
      value: c.hex, // hier ga ik op filteren
      label: c.species.join(', '), // optioneel voor weergave
      hex: c.hex,
    }));

  const observations = await prisma.observation.findMany({
    where: whereClause,
    skip: (currentPage - 1) * observationsPerPage,
    take: observationsPerPage,
    include: {
      hive: {
        include: {
          apiary: {
            include: { user: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="platform-page">
      <ScrollToSection />
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              {totalObservations}{' '}
              {totalObservations === 1 ? 'waarneming' : 'waarnemingen'}
            </span>
            <h1 className="platform-hero__title">{hive.name}</h1>
            <div className="btn-group">
              <Link
                href={`/hives/${hive.id}/edit`}
                className="btn btn--secondary"
              >
                Bewerk
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
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          returnUrl
            ? { label: 'Bijenstand', href: returnUrl }
            : { label: 'Behuizingen', href: '/hives' },
          { label: hive.name },
        ]}
      />

      <section className="home-features">
        <div className="container">
          <h2 className="feature-card__title">Behuizing informatie</h2>
          <div className="home-features__grid">
            <div className="feature-card">
              <h3 className="feature-card__title">Details</h3>
              <div className="feature-card__meta">
                <div className="meta-item">
                  <span className="meta-label">Bijenstand</span>
                  <span className="meta-value meta-value--small">
                    {hive.apiary.name}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Type behuizing</span>
                  <span className="meta-value meta-value--small">
                    {hive.type}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Variëteit</span>
                  <span className="meta-value meta-value--small">
                    {hive.colonyType}
                  </span>
                </div>
              </div>
            </div>
            <div className="feature-card">
              <h3 className="feature-card__title">Foto upload</h3>
              <div className="empty-photo">Coming soon</div>
            </div>
            <div className="feature-card">
              <h3 className="feature-card__title">Extra foto</h3>
              <div className="empty-photo">Coming soon</div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features" id="observations-section">
        <div className="container">
          <div className="section-header">
            <h2 className="feature-card__title">
              Waarnemingen in deze behuizing
            </h2>
            <Link
              href={`/observations/new?hiveId=${hiveId}&hiveName=${hive.name}`}
              className="btn btn--secondary"
            >
              + Waarneming toevoegen
            </Link>
          </div>

          {observations.length === 0 ? (
            // Check if any filters are applied to determine which EmptyState to show
            search || colorFilter ? (
              <EmptyState
                title="Geen waarnemingen gevonden"
                description="Er zijn geen waarnemingen die voldoen aan de huidige filters. Probeer je zoekcriteria aan te passen."
                buttonText="Filters wissen"
                buttonHref={`/hives/${hiveId}`}
              />
            ) : (
              <EmptyState
                title="Nog geen waarnemingen"
                description="Deze behuizing heeft nog geen waarnemingen. Gebruik de knop hierboven om de eerste waarneming toe te voegen."
              />
            )
          ) : (
            <ObservationsFilter
              observations={observations}
              showHive={false}
              showApiary={false}
              showUser={false}
              currentPage={currentPage}
              totalPages={totalPages}
              currentPath={`/hives/${hiveId}`}
              search={search}
              colorFilter={colorFilter}
              allColors={allColors}
              placeholder="Zoek op notities"
            />
          )}
        </div>
      </section>
    </div>
  );
}
