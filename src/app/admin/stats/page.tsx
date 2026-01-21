import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import prisma from '@/lib/client';
import StatsCharts from '@/components/admin/StatsCharts';
import ExportButton from '@/components/admin/ExportButton';

export const dynamic = 'force-dynamic';

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions);

  if (
    !session?.user?.id ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPERADMIN')
  ) {
    redirect('/unauthorized');
  }

  // Haal alle waarnemingen op
  const observations = await prisma.observation.findMany({
    select: {
      pollenColor: true,
      pollenAmount: true,
      weatherCondition: true,
    },
  });

  // Haal alle hives op
  const hives = await prisma.hive.findMany({
    select: {
      type: true,
      colonyType: true,
    },
  });

  // Bereken statistieken
  // Start met alle 12 kleuren op 0
  const pollenColorStats: Record<string, number> = {
    '#d8b769': 0,
    '#e56e59': 0,
    '#fdfe97': 0,
    '#ffff32': 0,
    '#cfbf62': 0,
    '#a72744': 0,
    '#d6c49c': 0,
    '#37255d': 0,
    '#bb832b': 0,
    '#e7dfbd': 0,
    '#3e65ee': 0,
    '#6b7280': 0,
  };
  
  // Tel waarnemingen per kleur
  observations.forEach((obs) => {
    if (pollenColorStats[obs.pollenColor] !== undefined) {
      pollenColorStats[obs.pollenColor]++;
    }
  });

  const pollenAmountStats = observations.reduce((acc, obs) => {
    acc[obs.pollenAmount] = (acc[obs.pollenAmount] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const weatherStats = observations.reduce((acc, obs) => {
    acc[obs.weatherCondition] = (acc[obs.weatherCondition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const hiveTypeStats = hives.reduce((acc, hive) => {
    acc[hive.type] = (acc[hive.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colonyTypeStats = hives.reduce((acc, hive) => {
    acc[hive.colonyType] = (acc[hive.colonyType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalObservations = observations.length;
  const totalHives = hives.length;

  return (
    <>
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">
              {totalHives} korven · {totalObservations} waarnemingen
            </span>
            <h1 className="platform-hero__title">Statistieken</h1>
            <div className="mt-8">
              <ExportButton />
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: 'Statistieken' }]} />

      <section className="section">
        <div className="container">
          <StatsCharts
            pollenColorStats={pollenColorStats}
            pollenAmountStats={pollenAmountStats}
            weatherStats={weatherStats}
            hiveTypeStats={hiveTypeStats}
            colonyTypeStats={colonyTypeStats}
          />
        </div>
      </section>
    </>
  );
}
