import prisma from '@/lib/client';
import { requireAdmin } from '@/lib/auth-helpers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ObservationsFilter from '@/components/shared/ObservationsFilter';

import { pollenColors } from '@/lib/pollenColors';
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
    returnUrl = '/admin/hives',
  } = searchParamsResult;

  const currentPage = Number(page);
  const observationsPerPage = 10;
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
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">{hive.name}</h1>
          <p className="page-header__subtitle">
            Type: {hive.type} | Volk: {hive.colonyType}
          </p>
          <p className="page-header__subtitle">
            Bijenstand:{' '}
            <Link href={`/admin/apiaries/${hive.apiary.id}`}>
              {hive.apiary.name}
            </Link>
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Waarnemingen</h2>
            <Link href={returnUrl ?? '/admin/hives'}>
              <button className="btn btn--secondary">← Terug</button>
            </Link>
          </div>

          <ObservationsFilter
            observations={observations}
            showUser={false}
            showHive={false}
            showApiary={false}
            currentPage={currentPage}
            totalPages={totalPages}
            currentPath={`/admin/hives/${hiveId}`}
            search={search}
            colorFilter={color}
            allColors={allColors}
            placeholder="Zoek op behuizing of notities"
          />
        </div>
      </section>
    </>
  );
}
