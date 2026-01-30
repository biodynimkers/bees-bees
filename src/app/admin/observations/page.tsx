import { prisma } from '@/lib/client';
import { redirect } from 'next/navigation';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { pollenColors } from '@/lib/pollenColors';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';
import ScrollToSection from '@/components/shared/ScrollToSection';

export const dynamic = 'force-dynamic';

type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
};

export default async function AdminObservationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const search = searchParamsResult?.search ?? '';
  const colorFilter = searchParamsResult?.color ?? '';
  const observationsPerPage = 20;

  // ADMIN: geen userId-filter
  const baseWhere = {};

  const whereClause: any = { ...baseWhere };

  // Add search filter
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

  // Add color filter
  if (colorFilter) {
    whereClause.pollenColor = {
      contains: colorFilter,
    };
  }

  const totalObservations = await prisma.observation.count({
    where: whereClause,
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);

  // Get all unique colors for filter options
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
    <div className="platform-page">
      <ScrollToSection />
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              Totaal: {totalObservations}
              {search && ` (gefilterd op "${search}") `}
              {colorFilter && '(gefilterd op kleur)'}
            </span>
            <h1 className="platform-hero__title">Alle waarnemingen</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[{ label: 'Admin', href: '/admin' }, { label: 'Waarnemingen' }]}
      />

      <section className="home-features" id="observations-section">
        <div className="container">
          {observations.length === 0 ? (
            // Check if any filters are applied to determine which EmptyState to show
            search || colorFilter ? (
              <EmptyState
                title="Geen waarnemingen gevonden"
                description="Er zijn geen waarnemingen die voldoen aan de huidige filters. Probeer je zoekcriteria aan te passen."
                buttonText="Filters wissen"
                buttonHref="/admin/observations"
              />
            ) : (
              <EmptyState
                title="Nog geen waarnemingen"
                description="Er zijn nog geen waarnemingen geregistreerd voor deze kast. Voeg een nieuwe waarneming toe of ga terug naar het overzicht van je behuizingen."
                buttonText="Ga naar overzicht"
                buttonHref="/admin"
              />
            )
          ) : (
            <ObservationsFilter
              observations={observations}
              showHive={true}
              showApiary={true}
              showUser={true}
              basePath="/admin"
              currentPage={currentPage}
              totalPages={totalPages}
              currentPath={'/admin/observations'}
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
