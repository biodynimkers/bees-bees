import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <div className="card stats-card">
    <h3 className="stats-card__value">{value}</h3>
    <p className="stats-card__label">{label}</p>
  </div>
);

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  const [totalUsers, activeUsers, adminCount, totalApiaries, totalHives, totalObservations, avgBeeCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { apiaries: { some: {} } } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.apiary.count(),
    prisma.hive.count(),
    prisma.observation.count(),
    prisma.observation.aggregate({ _avg: { beeCount: true } }),
  ]);

  const avgHivesPerApiary = totalApiaries > 0 ? (totalHives / totalApiaries).toFixed(1) : '0';
  const avgObsPerHive = totalHives > 0 ? (totalObservations / totalHives).toFixed(1) : '0';
  const avgBeeStrength = avgBeeCount._avg.beeCount?.toFixed(1) || '0';

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Platform statistieken</h1>
          <p className="page-header__subtitle">Overzicht van alle data in het systeem</p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">Gebruikers</h2>
            <Link href="/admin">
              <button className="btn btn--secondary">← Terug naar dashboard</button>
            </Link>
          </div>
          <div className="grid grid--3">
            <StatCard value={totalUsers} label="Totaal gebruikers" />
            <StatCard value={activeUsers} label="Actieve gebruikers" />
            <StatCard value={adminCount} label="Admins" />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">Data overzicht</h2>
          </div>
          <div className="grid grid--3">
            <StatCard value={totalApiaries} label="Bijenstanden" />
            <StatCard value={totalHives} label="Kasten" />
            <StatCard value={totalObservations} label="Observaties" />
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">Gemiddelden</h2>
          </div>
          <div className="grid grid--3">
            <StatCard value={avgHivesPerApiary} label="Kasten per bijenstand" />
            <StatCard value={avgObsPerHive} label="Observaties per kast" />
            <StatCard value={avgBeeStrength} label="Gem. bijensterkte (1-10)" />
          </div>
        </div>
      </section>
    </>
  );
}
