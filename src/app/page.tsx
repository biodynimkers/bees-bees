import Button from "@/components/magazine/Button";
import Stats from "@/components/magazine/Stats";
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
            <Button href="/auth/register" variant="primary" size="lg">
              Start nu
            </Button>
            <Button href="/platform" variant="secondary" size="lg">
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

      <section className="section ">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Belangrijkste functies</h2>
            <p className="section__description">
              Alles wat een moderne imker nodig heeft, zonder overbodige toeters
              en bellen.
            </p>
          </div>

          <div className="grid grid-three-columns">
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Bijenstanden beheren</h3>
              </div>
              <div className="card__content">
                <p className="card__description">
                  Voeg onbeperkt bijenstanden toe met GPS-coördinaten. Alleen
                  jij ziet waar je standen zich bevinden.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Kasten registreren</h3>
              </div>
              <div className="card__content">
                <p className="card__description">
                  Houd per kast bij welk type het is, sinds wanneer het er staat
                  en wat de huidige status is.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Observaties loggen</h3>
              </div>
              <div className="card__content">
                <p className="card__description">
                  Registreer waarnemingen met datum, notities, foto's en acties.
                  Altijd en overal toegankelijk.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Drachtkalender</h3>
              </div>
              <div className="card__content">
                <p className="card__description">
                  Zie welke planten binnen 2-7 km van je standen bloeien. Handig
                  voor drachtplanning.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Privacybescherming</h3>
              </div>
              <div className="card__content">
                <p className="card__description">
                  Jouw locaties blijven privé. Andere imkers zien alleen
                  observaties, nooit je exacte standplaatsen.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Multi-device sync</h3>
              </div>
              <div className="card__content">
                <p className="card__description">
                  Werk op je telefoon, tablet of computer. Al je gegevens worden
                  gesynchroniseerd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__header section__header--center">
            <h2 className="section__title">Klaar om te beginnen?</h2>
            <p className="section__description">
              Sluit je aan bij imkers die hun bijenhouden al digitaal beheren.
              Gratis en zonder verplichtingen.
            </p>
          </div>
          <div className="section__actions">
            <Button href="/auth/register" variant="primary" size="lg">
              Gratis account aanmaken
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
