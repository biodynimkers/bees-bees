import prisma from '@/lib/client';
import { requireAdmin } from '@/lib/auth-helpers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import { pollenColors } from '@/lib/pollenColors';
import EmptyState from '@/components/shared/EmptyState';
import ScrollToSection from '@/components/shared/ScrollToSection';

export const dynamic = 'force-dynamic';
type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
  returnUrl?: string;
};

export default async function AdminHiveDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ hiveId: string }>;
  searchParams?: Promise<SearchParams>;
}) {
  await requireAdmin();
  const { hiveId } = await params;

  const searchParamsResult = (await searchParams) || {};
  const {
    page = '1',
    search = '',
    color = '',
    returnUrl = '',
  } = searchParamsResult;

  const currentPage = Number(page);
  const observationsPerPage = 2;
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

  if (color) {
    whereClause.pollenColor = {
      contains: color,
    };
  }

  const totalObservations = await prisma.observation.count({
    where: whereClause,
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);

  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId, 10) },
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
              {hive.type} • {hive.colonyType}
            </span>
            <h1 className="platform-hero__title">{hive.name}</h1>
            <p
              style={{
                fontSize: '1.125rem',
                color: 'rgba(255, 255, 255, 0.9)',
                marginTop: '12px',
              }}
            >
              Bijenstand:{' '}
              <Link
                href={`/admin/apiaries/${hive.apiary.id}`}
                style={{ color: 'inherit', textDecoration: 'underline' }}
              >
                {hive.apiary.name}
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Gebruikers', href: '/admin/users' },
          returnUrl && returnUrl.includes('users')
            ? { label: hive.apiary.user.name, href: returnUrl }
            : returnUrl && returnUrl.includes('apiaries')
              ? { label: 'Bijenstand', href: returnUrl }
              : { label: 'Behuizingen', href: '/admin/hives' },
          { label: hive.name },
        ]}
      />

      <section className="home-features" id="observations-section">
        <div className="container">
          <h2
            className="heading-secondary"
            style={{ marginBottom: 'var(--space-8)' }}
          >
            Waarnemingen
          </h2>
          {observations.length === 0 ? (
            // Check if any filters are applied to determine which EmptyState to show
            search || color ? (
              <EmptyState
                title="Geen waarnemingen gevonden"
                description="Er zijn geen waarnemingen die voldoen aan de huidige filters. Probeer je zoekcriteria aan te passen."
                buttonText="Filters wissen"
                buttonHref={`/admin/hives/${hiveId}`}
              />
            ) : (
              <EmptyState
                title="Nog geen waarnemingen"
                description="Deze lijst is nog leeg. Zodra er waarnemingen zijn toegevoegd, verschijnen ze hier."
                buttonText="terug naar de behuizingen"
                buttonHref={returnUrl}
              />
            )
          ) : (
            <ObservationsFilter
              observations={observations}
              showUser={false}
              showHive={false}
              showApiary={false}
              basePath="/admin"
              currentPage={currentPage}
              totalPages={totalPages}
              currentPath={`/admin/hives/${hiveId}`}
              search={search}
              colorFilter={color}
              allColors={allColors}
              placeholder="Zoek op behuizing of notities"
            />
          )}
        </div>
      </section>
    </div>
  );
}
