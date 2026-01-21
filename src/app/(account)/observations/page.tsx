import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import { pollenColors } from '@/lib/pollenColors';
import EmptyState from '@/components/shared/EmptyState';

export const dynamic = 'force-dynamic';

type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
};
export default async function AccountObservationsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      apiaries: {
        include: {
          hives: {
            include: {
              observations: {
                orderBy: {
                  createdAt: 'desc',
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) redirect('/auth/login');

  const searchParamsResult = await searchParams;

  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const search = searchParamsResult?.search ?? '';
  const colorFilter = searchParamsResult?.color ?? '';
  const observationsPerPage = 20;

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
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">{totalObservations} {totalObservations === 1 ? 'waarneming' : 'waarnemingen'}</span>
            <h1 className="platform-hero__title">Mijn waarnemingen</h1>
            <div className="btn-group">
              <Link href="/observations/new" className="btn btn--secondary btn--large">
                + Nieuwe waarneming
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[
        { label: 'Account', href: '/account' },
        { label: 'Waarnemingen' }
      ]} />

      <section className="home-features">
        <div className="container">
          {observations.length > 0 ? (
            <ObservationsFilter
              observations={observations}
              showHive={true}
              showApiary={true}
              showUser={false}
              currentPage={currentPage}
              totalPages={totalPages}
              currentPath={`/observations`}
              search={search}
              colorFilter={colorFilter}
              allColors={allColors}
              placeholder="Zoek op bijenstand, behuizing of notities"
            />
          ) : (
            <EmptyState
              title="Nog geen waarnemingen"
              description="Voeg eerst een bijenstand en behuizing toe om waarnemingen te kunnen registreren."
              buttonText="+ Voeg je eerste bijenstand toe"
              buttonHref="/apiaries/new"
            />
          )}
        </div>
      </section>
    </div>
  );
}
