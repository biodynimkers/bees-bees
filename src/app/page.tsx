import { Hero, Section } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { Stats } from "@/components/features";
import prisma from "@/lib/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const totalObservations = await prisma.observation.count();
  const totalUsers = await prisma.user.count();
  const totalHives = await prisma.hive.count();

  return (
    <>
      <section className="hero hero-home">
        <div className="hero__image-wrapper">
          <img
            src="/assets/hero-new.jpg"
            alt="Bijen in de natuur"
            className="hero__image"
          />
        </div>
        <div className="hero__content">
          <h1 className="hero__title">Bijen Observatie Platform</h1>
          <p className="hero__subtitle">
            Uw digitale assistent voor bijenhouden. Modern, overzichtelijk,
            effectief.
          </p>
          <div className="hero__actions">
            <Button href="/auth/register" variant="primary" size="large">
              Start nu
            </Button>
            <Button href="/platform" variant="secondary" size="large">
              Lees meer
            </Button>
          </div>
        </div>
      </section>

      <Stats
        totalObservations={totalObservations}
        totalUsers={totalUsers}
        totalHives={totalHives}
      />

      <Section variant="default" spacing="large">
        <div className="container">
          <div className="section-header">
            <h2>Belangrijkste functies</h2>
            <p>
              Alles wat een moderne imker nodig heeft, zonder overbodige toeters
              en bellen.
            </p>
          </div>

          <div className="grid grid-3">
            <Card>
              <Card.Header>
                <Card.Title>Bijenstanden beheren</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Voeg onbeperkt bijenstanden toe met GPS-coördinaten. Alleen
                  jij ziet waar je standen zich bevinden.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Kasten registreren</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Houd per kast bij welk type het is, sinds wanneer het er staat
                  en wat de huidige status is.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Observaties loggen</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Registreer waarnemingen met datum, notities, foto's en acties.
                  Altijd en overal toegankelijk.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Drachtkalender</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Zie welke planten binnen 2-7 km van je standen bloeien. Handig
                  voor drachtplanning.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Privacybescherming</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Jouw locaties blijven privé. Andere imkers zien alleen
                  observaties, nooit je exacte standplaatsen.
                </Card.Description>
              </Card.Content>
            </Card>
            <Card>
              <Card.Header>
                <Card.Title>Multi-device sync</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  Werk op je telefoon, tablet of computer. Al je gegevens worden
                  gesynchroniseerd.
                </Card.Description>
              </Card.Content>
            </Card>
          </div>
        </div>
      </Section>

      <Section variant="alt" spacing="large">
        <div className="container">
          <div className="section-header">
            <h2>Klaar om te beginnen?</h2>
            <p>
              Sluit je aan bij imkers die hun bijenhouden al digitaal beheren.
              Gratis en zonder verplichtingen.
            </p>
          </div>
          <div className="section-actions">
            <Button href="/auth/register" variant="primary" size="large">
              Gratis account aanmaken
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
