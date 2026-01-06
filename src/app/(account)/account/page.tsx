import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import Hero from '@/components/magazine/Hero';
import Section from '@/components/magazine/Section';
import Button from '@/components/magazine/Button';
import Card from '@/components/magazine/Card';
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
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="page-header__title">Hallo {user.name}</h1>
          <p className="page-header__subtitle">
            {isNewUser
              ? "Welkom bij BEES - Uw digitale platform voor bijenbeheer"
              : "Beheer uw bijenstanden, kasten en observaties"}
          </p>
        </div>
      </section>

      {isNewUser ? (
        // Voor nieuwe gebruikers: uitleg en stappenplan
        <>
          <section className="section section--default">
            <div className="container container--narrow">
              <div className="section__header" style={{ textAlign: "center" }}>
                <h2 className="section__title">
                  Begin met uw digitale bijenlogboek
                </h2>
                <p className="section__subtitle">
                  BEES helpt u om alle informatie over uw bijenstanden, kasten en
                  waarnemingen overzichtelijk bij te houden. In drie eenvoudige
                  stappen start u met digitaal bijenhouden.
                </p>
              </div>
            </div>
          </section>

          <section className="section section--alt">
            <div className="container">
              <div className="grid grid--3">
                <div className="card">
                  <div className="card__icon">
                    <MapPin size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="card__title">Voeg een bijenstand toe</h3>
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
                  <h3 className="card__title">Registreer uw kasten</h3>
                  <p className="card__text">
                    Voeg de bijenkasten toe die op uw bijenstand staan. Noteer het
                    type kast en de sterkte van het volk.
                  </p>
                </div>

                <div className="card">
                  <div className="card__icon">
                    <Eye size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="card__title">Start met observaties</h3>
                  <p className="card__text">
                    Registreer uw waarnemingen per kast. Houd de gezondheid,
                    activiteit en belangrijke momenten overzichtelijk bij.
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "var(--space-12)" }}>
                <Link href="/apiaries/new">
                  <button className="btn btn--primary btn--lg">
                    Start nu - Voeg eerste bijenstand toe
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        // Voor bestaande gebruikers: statistieken en acties
        <>
          <section className="section section--default">
            <div className="container">
              <div className="grid grid--2" style={{ alignItems: "center", gap: "var(--space-16)" }}>
                <div>
                  <div style={{ marginBottom: "var(--space-6)" }}>
                    <img 
                      src="/icons/bee-drawing.png" 
                      alt="Bee" 
                      style={{ 
                        width: "80px", 
                        height: "auto",
                        opacity: 0.9
                      }} 
                    />
                  </div>
                  <h2 style={{ 
                    fontFamily: "var(--font-display)", 
                    fontSize: "2.5rem",
                    fontWeight: "400",
                    marginBottom: "var(--space-4)"
                  }}>
                    Hoe werkt het?
                  </h2>
                  <p style={{ 
                    fontSize: "1.125rem", 
                    lineHeight: "1.8",
                    color: "var(--color-text-light)",
                    marginBottom: "var(--space-8)"
                  }}>
                    Ontdek hoe u het platform gebruikt om uw bijenstanden, kasten en 
                    observaties efficiënt bij te houden. Van eerste setup tot dagelijks gebruik.
                  </p>
                  <Link href="/platform">
                    <button className="btn btn--primary btn--lg">
                      Bekijk handleiding
                    </button>
                  </Link>
                </div>

                <div className="card" style={{ background: "rgba(0, 0, 0, 0.02)" }}>
                  <h3 className="card__title" style={{ marginBottom: "var(--space-4)" }}>
                    Snel aan de slag
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                    <div style={{ display: "flex", gap: "var(--space-3)" }}>
                      <span style={{ 
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: "300",
                        color: "var(--color-text-light)",
                        minWidth: "32px"
                      }}>
                        01
                      </span>
                      <p style={{ lineHeight: "1.6" }}>
                        Voeg uw eerste bijenstand toe met locatie en naam
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-3)" }}>
                      <span style={{ 
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: "300",
                        color: "var(--color-text-light)",
                        minWidth: "32px"
                      }}>
                        02
                      </span>
                      <p style={{ lineHeight: "1.6" }}>
                        Registreer uw bijenkasten per stand
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-3)" }}>
                      <span style={{ 
                        fontFamily: "var(--font-display)",
                        fontSize: "1.5rem",
                        fontWeight: "300",
                        color: "var(--color-text-light)",
                        minWidth: "32px"
                      }}>
                        03
                      </span>
                      <p style={{ lineHeight: "1.6" }}>
                        Begin met het bijhouden van observaties
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section section--alt">
            <div className="container">
              <div className="section__header" style={{ textAlign: "center" }}>
                <h2 className="section__title">Uw overzicht</h2>
              </div>

              <div className="grid grid--3">
                <Link href="/apiaries" style={{ textDecoration: "none" }}>
                  <div className="card" style={{ textAlign: "center" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "3rem",
                        fontWeight: "300",
                        color: "var(--color-text)",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      {totalApiaries}
                    </h3>
                    <p
                      style={{
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-6)',
                      }}
                    >
                      Bijenstanden
                    </p>
                    <button className="btn btn--secondary btn--sm">
                      Bekijk alle
                    </button>
                  </div>
                </Link>

                <Link href="/hives" style={{ textDecoration: "none" }}>
                  <div className="card" style={{ textAlign: "center" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "3rem",
                        fontWeight: "300",
                        color: "var(--color-text)",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      {totalHives}
                    </h3>
                    <p
                      style={{
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-6)',
                      }}
                    >
                      Kasten
                    </p>
                    <button className="btn btn--secondary btn--sm">
                      Bekijk alle
                    </button>
                  </div>
                </Link>

                <Link href="/observations" style={{ textDecoration: "none" }}>
                  <div className="card" style={{ textAlign: "center" }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "3rem",
                        fontWeight: "300",
                        color: "var(--color-text)",
                        marginBottom: "var(--space-3)",
                      }}
                    >
                      {totalObservations}
                    </h3>
                    <p
                      style={{
                        color: 'var(--color-text-light)',
                        marginBottom: 'var(--space-6)',
                      }}
                    >
                      Observaties
                    </p>
                    <button className="btn btn--secondary btn--sm">
                      Bekijk alle
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <section className="section section--alt">
            <div className="container">
              <div className="section__header" style={{ textAlign: "center" }}>
                <h2 className="section__title">Snelle acties</h2>
              </div>

              <div className="grid grid--3">
                <Link href="/apiaries/new" style={{ textDecoration: "none" }}>
                  <div className="card">
                    <p className="card__category">TOEVOEGEN</p>
                    <h3 className="card__title">Bijenstand en locatie</h3>
                    <p className="card__text">
                      Voeg een nieuwe bijenstand toe met locatie
                    </p>
                  </div>
                </Link>
                <Link href="/hives/new" style={{ textDecoration: "none" }}>
                  <div className="card">
                    <p className="card__category">TOEVOEGEN</p>
                    <h3 className="card__title">Kast</h3>
                    <p className="card__text">
                      Registreer een nieuwe bijenkast op uw stand
                    </p>
                  </div>
                </Link>
                <Link href="/observations/new" style={{ textDecoration: "none" }}>
                  <div className="card">
                    <p className="card__category">TOEVOEGEN</p>
                    <h3 className="card__title">Observatie</h3>
                    <p className="card__text">
                      Maak een nieuwe waarneming bij uw kast
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
