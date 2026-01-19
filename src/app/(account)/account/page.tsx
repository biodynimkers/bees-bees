import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { MapPin, Box, Eye } from 'lucide-react';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  // Haal gebruiker op met userId uit params
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      apiaries: {
        include: {
          hives: {
            include: {
              observations: {
                orderBy: { createdAt: 'desc' },
                take: 5,
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect('/unauthorized');
  }

  const totalApiaries = user.apiaries.length;
  const totalHives = user.apiaries.reduce(
    (sum, apiary) => sum + apiary.hives.length,
    0
  );
  const totalObservations = user.apiaries.reduce(
    (sum, apiary) =>
      sum +
      apiary.hives.reduce(
        (hiveSum, hive) => hiveSum + hive.observations.length,
        0
      ),
    0
  );

  const isNewUser =
    totalApiaries === 0 && totalHives === 0 && totalObservations === 0;

  return (
    <>
      <div className="platform-page">
        <section className="platform-hero">
          <div className="container">
            <div className="platform-hero__content">
              <span className="platform-hero__label">Overzicht</span>
              <h1 className="platform-hero__title">
                Hallo {user.name}
              </h1>
              <p className="platform-hero__intro">
                {isNewUser
                  ? 'Welkom bij BEES - Uw digitale platform voor bijenbeheer'
                  : 'Beheer uw bijenstanden, behuizingen en waarnemingen'}
              </p>
            </div>
          </div>
        </section>

        <Breadcrumbs items={[
          { label: 'Account' }
        ]} />

        {isNewUser ? (
          <>
            <section className="home-features">
              <div className="container">
                <div className="home-features__grid">
                  <div className="feature-card">
                    <MapPin size={36} strokeWidth={1.5} color="rgb(14, 97, 93)" style={{ marginBottom: '24px' }} />
                    <h3 className="feature-card__title">Voeg een bijenstand toe</h3>
                    <p className="feature-card__text">
                      Begin met het registreren van de locatie waar uw behuizingen
                      staan. Geef deze een herkenbare naam zoals "Tuin" of
                      "Boerderij Janssens".
                    </p>
                  </div>

                  <div className="feature-card">
                    <Box size={36} strokeWidth={1.5} color="rgb(14, 97, 93)" style={{ marginBottom: '24px' }} />
                    <h3 className="feature-card__title">Registreer uw behuizingen</h3>
                    <p className="feature-card__text">
                      Voeg de behuizingen toe die op uw bijenstand staan. Noteer
                      het type behuizing en de sterkte van het volk.
                    </p>
                  </div>

                  <div className="feature-card">
                    <Eye size={36} strokeWidth={1.5} color="rgb(14, 97, 93)" style={{ marginBottom: '24px' }} />
                    <h3 className="feature-card__title">Start met waarnemingen</h3>
                    <p className="feature-card__text">
                      Registreer uw waarnemingen per behuizing. Houd de gezondheid,
                      activiteit en belangrijke momenten overzichtelijk bij.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="home-platform">
              <div className="container">
                <div className="home-platform__content">
                  <Link href="/apiaries/new" className="btn btn--secondary btn--large">
                    Start nu - Voeg eerste bijenstand toe
                  </Link>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="home-features">
              <div className="container">
                <div className="home-features__grid">
                  <Link href="/apiaries" className="feature-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '48px', fontWeight: '600', color: 'rgb(14, 97, 93)', marginBottom: '12px' }}>
                      {totalApiaries}
                    </div>
                    <p className="feature-card__title" style={{ marginBottom: '16px' }}>
                      {totalApiaries === 1 ? 'Bijenstand' : 'Bijenstanden'}
                    </p>
                    <span className="btn btn--secondary btn--small">Bekijk alle</span>
                  </Link>

                  <Link href="/hives" className="feature-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '48px', fontWeight: '600', color: 'rgb(14, 97, 93)', marginBottom: '12px' }}>
                      {totalHives}
                    </div>
                    <p className="feature-card__title" style={{ marginBottom: '16px' }}>
                      {totalHives === 1 ? 'Behuizing' : 'Behuizingen'}
                    </p>
                    <span className="btn btn--secondary btn--small">Bekijk alle</span>
                  </Link>

                  <Link href="/observations" className="feature-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '48px', fontWeight: '600', color: 'rgb(14, 97, 93)', marginBottom: '12px' }}>
                      {totalObservations}
                    </div>
                    <p className="feature-card__title" style={{ marginBottom: '16px' }}>
                      {totalObservations === 1 ? 'Waarneming' : 'Waarnemingen'}
                    </p>
                    <span className="btn btn--secondary btn--small">Bekijk alle</span>
                  </Link>
                </div>
              </div>
            </section>

            <section className="home-features" style={{ paddingTop: '40px' }}>
              <div className="container">
                <div className="home-features__grid">
                  <Link href="/apiaries/new" className="feature-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(14, 97, 93, 0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toevoegen</div>
                    <h3 className="feature-card__title">Bijenstand</h3>
                  </Link>

                  <Link href="/hives/new" className="feature-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(14, 97, 93, 0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toevoegen</div>
                    <h3 className="feature-card__title">Behuizing</h3>
                  </Link>

                  <Link href="/observations/new" className="feature-card" style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '14px', color: 'rgba(14, 97, 93, 0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Toevoegen</div>
                    <h3 className="feature-card__title">Waarneming</h3>
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
