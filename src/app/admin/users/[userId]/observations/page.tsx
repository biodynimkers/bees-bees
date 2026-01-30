import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-helpers';
import ObservationsTable from '@/components/shared/ObservationsTable';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import { pollenColors } from '@/lib/pollenColors';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';
import ScrollToSection from '@/components/shared/ScrollToSection';

type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
};

export default async function AdminUserObservationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams?: Promise<SearchParams>;
}) {
  await requireAdmin();
  const { userId } = await params;
  const searchParamsResult = await searchParams;

  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const search = searchParamsResult?.search ?? '';
  const colorFilter = searchParamsResult?.color ?? '';
  const observationsPerPage = 20;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true },
  });

  if (!user) {
    redirect('/admin/users');
  }

  // Build dynamic where clause based on search parameters
  const baseWhere = {
    hive: {
      apiary: {
        userId: userId,
      },
    },
  };

  const whereClause: any = { ...baseWhere }; //uitbreiden met zoekfilter en kleurfilter

  // search filter toevoegen
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
          name: {
            contains: search,
            mode: 'insensitive',
          },
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

  // kleurfilter toevoegen, later vervangen door een apart model voor kleuren (model ObservationColor)!
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
        select: {
          id: true,
          type: true,
          name: true,
          apiary: {
            include: {
              user: true, // If you need user data
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="platform-page">
      <ScrollToSection />
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {totalObservations}
            </span>
            <h1 className="platform-hero__title">
              Waarnemingen van {user.name}
            </h1>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Admin', href: '/admin' },
          { label: 'Gebruikers', href: '/admin/users' },
          { label: user.name, href: `/admin/users/${userId}` },
          { label: 'Waarnemingen' },
        ]}
      />

      <section className="home-features" id="observations-section">
        <div className="container">
          {observations.length === 0 ? (
            search || colorFilter ? (
              <EmptyState
                title="Geen waarnemingen gevonden"
                description="Er zijn geen waarnemingen die voldoen aan de huidige filters. Probeer je zoekcriteria aan te passen."
                buttonText="Filters wissen"
                buttonHref={`/admin/users/${userId}/observations`}
              />
            ) : (
              <EmptyState
                title="Nog geen waarnemingen"
                description="Deze lijst is nog leeg. Zodra er waarnemingen zijn toegevoegd, verschijnen ze hier."
              />
            )
          ) : (
            <ObservationsFilter
              observations={observations}
              showHive={true}
              showApiary={true}
              showUser={false}
              basePath={'/admin'}
              currentPage={currentPage}
              totalPages={totalPages}
              currentPath={`/admin/users/${userId}/observations`}
              search={search}
              colorFilter={colorFilter}
              allColors={allColors}
              placeholder="Zoek op bijenstand, behuizing of notities"
            />
          )}
        </div>
      </section>
    </div>
  );
}
