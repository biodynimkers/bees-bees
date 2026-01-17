import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';
import { notFound } from 'next/navigation';
import ObservationsFilter from '@/components/shared/ObservationsFilter';
import { pollenColors } from '@/lib/pollenColors';

export const dynamic = 'force-dynamic';
type SearchParams = {
  page?: string;
  search?: string;
  color?: string;
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
    <>
      <section className="page-header" data-page="—">
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
                {hive.name} ({totalObservations}{' '}
                {totalObservations === 1 ? 'waarneming' : 'waarnemingen'})
              </h1>
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
                <button className="btn btn--secondary">Bewerk</button>
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
              <div
                style={{
                  width: '100%',
                  height: '200px',
                  backgroundColor: 'var(--color-soft-gray)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-light)',
                  fontSize: '0.875rem',
                  border: '1px dashed rgba(0, 0, 0, 0.15)',
                }}
              >
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
        </div>
      </section>
    </>
  );
}
