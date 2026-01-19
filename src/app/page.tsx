import Button from "@/components/magazine/Button";
import Stats from "@/components/magazine/Stats";
import HeroImage from "@/components/home/HeroImage";
import prisma from "@/lib/client";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

async function getHeroImageData() {
  try {
    const publicPath = join(process.cwd(), 'public', 'assets');
    
    // Check of custom image bestaat
    try {
      await readFile(join(publicPath, 'hero-custom.jpg'));
      
      // Check of alt text bestaat
      let altText = 'Bijen in de natuur';
      try {
        const altData = await readFile(join(publicPath, 'hero-alt.json'), 'utf-8');
        const parsed = JSON.parse(altData);
        if (parsed.alt) {
          altText = parsed.alt;
        }
      } catch {}
      
      return {
        url: '/assets/hero-custom.jpg',
        alt: altText
      };
    } catch {
      return {
        url: '/assets/hero-new.jpg',
        alt: 'Bijen in de natuur'
      };
    }
  } catch {
    return {
      url: '/assets/hero-new.jpg',
      alt: 'Bijen in de natuur'
    };
  }
}

export default async function Home() {
  const totalObservations = await prisma.observation.count();
  const totalUsers = await prisma.user.count();
  const totalHives = await prisma.hive.count();
  const heroData = await getHeroImageData();

  return (
    <>
      <section className="hero hero-home">
        <HeroImage imageUrl={heroData.url} altText={heroData.alt} />
        <div className="hero__content">
          <h1 className="heading-primary">Digitaal Bijenhouden - Platform voor Imkers</h1>
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

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="heading-secondary">Belangrijkste functies voor imkers</h2>
            <p className="section-description">
              Alles wat een moderne imker nodig heeft, zonder overbodige toeters
              en bellen.
            </p>
          </div>

          <div className="grid grid-three-columns">
            <div className="card">
              <div className="card__header">
                <h3 className="heading-tertiary">Bijenstanden beheren</h3>
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
                <h3 className="heading-tertiary">Behuizingen registreren</h3>
              </div>
              <div className="card__content">
                <p className="card__description">
                  Houd per behuizing bij welk type het is, sinds wanneer het er staat
                  en wat de huidige status is.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card__header">
                <h3 className="heading-tertiary">Observaties loggen</h3>
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
                <h3 className="heading-tertiary">Drachtkalender</h3>
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
                <h3 className="heading-tertiary">Privacybescherming</h3>
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
                <h3 className="heading-tertiary">Multi-device synchronisatie</h3>
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

     <section className="section section-alternate">
        <div className="container">
          <div className="text-center">
            <h2 className="heading-secondary">Gratis account aanmaken</h2>
            <p className="text-large margin-bottom-large">
              Registreer nu gratis en begin met het digitaliseren van je imkerij
            </p>
            <div className="flex justify-center gap-small">
              <a href="/auth/register" className="btn btn--secondary">
                Gratis account aanmaken
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
