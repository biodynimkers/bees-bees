import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/client";
import { authOptions } from "@/lib/auth-options";
import { Hero, Section } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { MapPin, Box, Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
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
                orderBy: { createdAt: "desc" },
                take: 5,
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/unauthorized");
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
      <Hero
        title={`Hallo ${user.name}`}
        subtitle={
          isNewUser
            ? "Welkom bij BEES - Uw digitale platform voor bijenbeheer"
            : "Beheer uw bijenstanden, kasten en observaties"
        }
        image="/assets/hero-new.jpg"
        imageAlt="BEES Platform Account"
      />

      {isNewUser ? (
        // Voor nieuwe gebruikers: uitleg en stappenplan
        <>
          <Section variant="default" spacing="large">
            <div className="account-welcome">
              <h2 className="text-display text-3xl mb-6 account-welcome__title">
                Begin met uw digitale bijenlogboek
              </h2>
              <p className="text-base mb-8 account-welcome__text">
                BEES helpt u om alle informatie over uw bijenstanden, kasten en
                waarnemingen overzichtelijk bij te houden. In drie eenvoudige
                stappen start u met digitaal bijenhouden.
              </p>
            </div>
          </Section>

          <Section variant="alt" spacing="large">
            <div className="grid grid--3">
              <div className="onboarding-step">
                <div className="onboarding-step__icon">
                  <MapPin size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-display text-xl mb-4 onboarding-step__title">
                  Voeg een bijenstand toe
                </h3>
                <p className="onboarding-step__description">
                  Begin met het registreren van de locatie waar uw bijenkasten
                  staan. Geef deze een herkenbare naam zoals "Tuin" of
                  "Boerderij Janssens".
                </p>
              </div>

              <div className="onboarding-step">
                <div className="onboarding-step__icon">
                  <Box size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-display text-xl mb-4 onboarding-step__title">
                  Registreer uw kasten
                </h3>
                <p className="onboarding-step__description">
                  Voeg de bijenkasten toe die op uw bijenstand staan. Noteer het
                  type kast en de sterkte van het volk.
                </p>
              </div>

              <div className="onboarding-step">
                <div className="onboarding-step__icon">
                  <Eye size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-display text-xl mb-4 onboarding-step__title">
                  Start met observaties
                </h3>
                <p className="onboarding-step__description">
                  Registreer uw waarnemingen per kast. Houd de gezondheid,
                  activiteit en belangrijke momenten overzichtelijk bij.
                </p>
              </div>
            </div>

            <div className="onboarding-actions">
              <Button href="/apiaries/new" variant="primary" size="large">
                Start nu - Voeg eerste bijenstand toe
              </Button>
            </div>
          </Section>
        </>
      ) : (
        // Voor bestaande gebruikers: statistieken en acties
        <>
          <Section variant="default" spacing="large">
            <div className="account-section-header">
              <h2 className="text-display text-3xl mb-4 account-section-header__title">
                Uw overzicht
              </h2>
            </div>

            <div className="grid grid--3">
              <Link href="/apiaries" className="stat-card">
                <div className="card card--elevated">
                  <div className="card__content stat-card__content">
                    <h3 className="text-display stat-card__number">
                      {totalApiaries}
                    </h3>
                    <p className="stat-card__label">Bijenstanden</p>
                    <Button variant="secondary" size="small">
                      Bekijk alle
                    </Button>
                  </div>
                </div>
              </Link>

              <Link href="/hives" className="stat-card">
                <div className="card card--elevated">
                  <div className="card__content stat-card__content">
                    <h3 className="text-display stat-card__number">
                      {totalHives}
                    </h3>
                    <p className="stat-card__label">Kasten</p>
                    <Button variant="secondary" size="small">
                      Bekijk alle
                    </Button>
                  </div>
                </div>
              </Link>

              <Link href="/observations" className="stat-card">
                <div className="card card--elevated">
                  <div className="card__content stat-card__content">
                    <h3 className="text-display stat-card__number">
                      {totalObservations}
                    </h3>
                    <p className="stat-card__label">Observaties</p>
                    <Button variant="secondary" size="small">
                      Bekijk alle
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          </Section>

          <Section variant="alt" spacing="large">
            <div className="account-section-header">
              <h2 className="text-display text-3xl mb-4 account-section-header__title">
                Snelle acties
              </h2>
            </div>

            <div className="grid grid--3">
              <Link href="/apiaries/new" className="action-card-link">
                <Card>
                  <Card.Header>
                    <Card.Title>+ Bijenstand</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Card.Description>
                      Voeg een nieuwe locatie toe voor uw bijenkasten
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Link>
              <Link href="/apiaries" className="action-card-link">
                <Card>
                  <Card.Header>
                    <Card.Title>Bijenstanden beheren</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Card.Description>
                      Bekijk en wijzig uw bestaande bijenstanden en voeg kasten
                      toe
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Link>
              <Link href="/observations/new" className="action-card-link">
                <Card>
                  <Card.Header>
                    <Card.Title>+ Observatie</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <Card.Description>
                      Maak een nieuwe waarneming bij één van uw bijenkasten
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Link>
            </div>
          </Section>
        </>
      )}
    </>
  );
}
