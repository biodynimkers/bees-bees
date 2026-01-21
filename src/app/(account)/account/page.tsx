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
                  ? 'Welkom bij uw digitale platform voor bijenbeheer'
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
                    <MapPin className="feature-card__icon" size={36} strokeWidth={1.5} />
                    <h3 className="feature-card__title">Voeg een bijenstand toe</h3>
                    <p className="feature-card__text">
                      Begin met het registreren van de locatie waar je behuizingen staan. Geef deze een herkenbare naam zoals "Tuin" of "Boerderij Janssens".
                    </p>
                  </div>

                  <div className="feature-card">
                    <Box className="feature-card__icon" size={36} strokeWidth={1.5} />
                    <h3 className="feature-card__title">Registreer je behuizingen</h3>
                    <p className="feature-card__text">
                      Voeg de behuizingen toe die op je bijenstand staan. Noteer het type behuizing en de sterkte van het volk.
                    </p>
                  </div>

                  <div className="feature-card">
                    <Eye className="feature-card__icon" size={36} strokeWidth={1.5} />
                    <h3 className="feature-card__title">Start met waarnemingen</h3>
                    <p className="feature-card__text">
                      Registreer je waarnemingen per behuizing. Houd de gezondheid, activiteit en belangrijke momenten overzichtelijk bij.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="home-platform">
              <div className="home-platform__content in-view">
                <h2 className="home-platform__title">Begin met je eerste bijenstand</h2>
                <p className="home-platform__text">
                  Voeg je eerste bijenstand toe om behuizingen en waarnemingen bij te houden.
                </p>
                <div className="home-platform__actions">
                  <Link href="/apiaries/new" className="btn btn--secondary btn--large">
                    + Voeg je eerste bijenstand toe
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <section className="home-features">
              <div className="container">
                <div className="home-features__grid">
                  <Link href="/apiaries" className="feature-card">
                    <div className="meta-value">
                      {totalApiaries}
                    </div>
                    <p className="feature-card__title stat-card__title">
                      {totalApiaries === 1 ? 'Bijenstand' : 'Bijenstanden'}
                    </p>
            
                  </Link>

                  <Link href="/hives" className="feature-card">
                    <div className="meta-value">
                      {totalHives}
                    </div>
                    <p className="feature-card__title stat-card__title">
                      {totalHives === 1 ? 'Behuizing' : 'Behuizingen'}
                    </p>
            
                  </Link>

                  <Link href="/observations" className="feature-card">
                    <div className="meta-value">
                      {totalObservations}
                    </div>
                    <p className="feature-card__title stat-card__title">
                      {totalObservations === 1 ? 'Waarneming' : 'Waarnemingen'}
                    </p>
                   
                  </Link>
                </div>
              </div>
            </section>

            <section className="home-features section-spacing">
              <div className="container">
                <h2 className="platform-section__title">Snelle acties</h2>
                <div className="home-features__grid">
                  <Link href="/apiaries/new" className="feature-card">
                    <div className="add-card__label">Toevoegen</div>
                    <h3 className="feature-card__title">Bijenstand</h3>
                  </Link>

                  <Link href="/hives/new" className="feature-card">
                    <div className="add-card__label">Toevoegen</div>
                    <h3 className="feature-card__title">Behuizing</h3>
                  </Link>

                  <Link href="/observations/new" className="feature-card">
                    <div className="add-card__label">Toevoegen</div>
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
