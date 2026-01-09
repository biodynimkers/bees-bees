import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import Section from '@/components/shared/Section';
import SectionHeader from '@/components/shared/SectionHeader';
import SectionContent from '@/components/shared/SectionContent';
import { MapPin, Box, Eye } from 'lucide-react';

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
      <Section first>
        <div className="container">
          <h1 className="page-header__title">
            Hallo {user.name}{' '}
            <span>
              {' '}
              {session.user.role === 'SUPERADMIN'
                ? ' (superadmin)'
                : session.user.role === 'ADMIN'
                ? ' (admin)'
                : ''}{' '}
            </span>
          </h1>
          <p className="page-header__subtitle">
            {isNewUser
              ? 'Welkom bij BEES - Uw digitale platform voor bijenbeheer'
              : 'Beheer uw bijenstanden, kasten en observaties'}
          </p>
        </div>
      </Section>

      {isNewUser ? (
        // Voor nieuwe gebruikers: uitleg en stappenplan
        <>
          <Section variant="alternate">
            <div className="container">
              <SectionContent grid="three">
                <div className="card">
                  <div className="card__icon">
                    <MapPin size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-tertiary">Voeg een bijenstand toe</h3>
                  <p className="card__text">
                    Begin met het registreren van de locatie waar uw bijenkasten
                    staan. Geef deze een herkenbare naam zoals "Tuin" of
                    "Boerderij Janssens".
                  </p>
                </div>

                <div className="card">
                  <div className="card__icon">
                    <Box size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-tertiary">Registreer uw kasten</h3>
                  <p className="card__text">
                    Voeg de bijenkasten toe die op uw bijenstand staan. Noteer
                    het type kast en de sterkte van het volk.
                  </p>
                </div>

                <div className="card">
                  <div className="card__icon">
                    <Eye size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-tertiary">Start met observaties</h3>
                  <p className="card__text">
                    Registreer uw waarnemingen per kast. Houd de gezondheid,
                    activiteit en belangrijke momenten overzichtelijk bij.
                  </p>
                </div>
              </SectionContent>

              <div className="text-center margin-top-large">
                <Link href="/apiaries/new" className="btn btn--primary btn--large">
                  Start nu - Voeg eerste bijenstand toe
                </Link>
              </div>
            </div>
          </Section>
        </>
      ) : (
        // Voor bestaande gebruikers: statistieken en acties
        <>
          <Section variant="alternate">
            <div className="container">
              <SectionHeader>
                <h2 className="heading-secondary">Uw overzicht</h2>
              </SectionHeader>

              <SectionContent grid="three">
                <Link href="/apiaries" className="card card--stat">
                  <span className="number-large">{totalApiaries}</span>
                  <p className="card__label">Bijenstanden</p>
                  <span className="btn btn--secondary btn--small">Bekijk alle</span>
                </Link>

                <Link href="/hives" className="card card--stat">
                  <span className="number-large">{totalHives}</span>
                  <p className="card__label">Kasten</p>
                  <span className="btn btn--secondary btn--small">Bekijk alle</span>
                </Link>

                <Link href="/observations" className="card card--stat">
                  <span className="number-large">{totalObservations}</span>
                  <p className="card__label">Observaties</p>
                  <span className="btn btn--secondary btn--small">Bekijk alle</span>
                </Link>
              </SectionContent>
            </div>
          </Section>

          <Section>
            <div className="container">
              <SectionHeader>
                <h2 className="heading-secondary">Snelle acties</h2>
              </SectionHeader>

              <SectionContent grid="three">
                <Link href="/apiaries/new" className="card card--action">
                  <span className="card__category">Toevoegen</span>
                  <h3 className="heading-tertiary">Bijenstand</h3>
                  <p className="card__text">Nieuwe locatie registreren</p>
                </Link>

                <Link href="/hives/new" className="card card--action">
                  <span className="card__category">Toevoegen</span>
                  <h3 className="heading-tertiary">Kast</h3>
                  <p className="card__text">Bijenkast koppelen aan stand</p>
                </Link>

                <Link href="/observations/new" className="card card--action">
                  <span className="card__category">Toevoegen</span>
                  <h3 className="heading-tertiary">Observatie</h3>
                  <p className="card__text">Waarneming bij kast noteren</p>
                </Link>
              </SectionContent>
            </div>
          </Section>
        </>
      )}
    </>
  );
}
