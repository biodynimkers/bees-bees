import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function AdminStatsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  // Platform statistics
  const totalUsers = await prisma.user.count();
  const totalApiaries = await prisma.apiary.count();
  const totalHives = await prisma.hive.count();
  const totalObservations = await prisma.observation.count();

  const activeUsers = await prisma.user.count({
    where: {
      apiaries: {
        some: {},
      },
    },
  });

  // Average bee count
  const avgBeeCount = await prisma.observation.aggregate({
    _avg: {
      beeCount: true,
    },
  });

  const adminCount = await prisma.user.count({
    where: { role: 'ADMIN' }
  });

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Platform statistieken</h1>
          <p className="page-header__subtitle">
            Overzicht van alle data in het systeem
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">Gebruikers</h2>
          </div>

          <div className="grid grid--3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {totalUsers}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Totaal gebruikers</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {activeUsers}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Actieve gebruikers</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {adminCount}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Admins</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">Data overzicht</h2>
          </div>

          <div className="grid grid--3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {totalApiaries}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Bijenstanden</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {totalHives}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Kasten</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {totalObservations}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Observaties</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="section-header">
            <h2 className="section-header__title">Gemiddelden</h2>
          </div>

          <div className="grid grid--3">
            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {totalApiaries > 0 ? (totalHives / totalApiaries).toFixed(1) : '0'}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Kasten per bijenstand</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {totalHives > 0 ? (totalObservations / totalHives).toFixed(1) : '0'}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Observaties per kast</p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '3rem',
                  fontWeight: '300',
                  marginBottom: 'var(--space-3)',
                }}
              >
                {avgBeeCount._avg.beeCount?.toFixed(1) || '0'}
              </h3>
              <p style={{ color: 'var(--color-text-light)' }}>Gem. bijensterkte (1-10)</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
