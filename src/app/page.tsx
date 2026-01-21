import Button from "@/components/magazine/Button";
import Stats from "@/components/magazine/Stats";
import HeroImage from "@/components/home/HeroImage";
import ScrollAnimations from "@/components/home/ScrollAnimations";
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
      <ScrollAnimations />
      
      {/* Hero - Full width image at top */}
      <section className="home-hero">
        <div className="home-hero__image">
          <HeroImage imageUrl={heroData.url} altText={heroData.alt} />
        </div>
      </section>

      {/* Content Section - H1, intro text, stats */}
      <section className="home-content">
        <div className="container">
          <div className="home-content__main">
            <h1 className="home-content__title">Biodynamische Imkers Vlaanderen</h1>
            <p className="home-content__intro">
              
Een platform waar jij als imker al je bijenstanden, behuizingen en waarnemingen op één plek registreert en beheert.
De locaties van je bijenstanden blijven standaard afgeschermd en zijn enkel zichtbaar voor jou.
          
            </p>
            <div className="home-content__cta">
              <Button href="/platform" variant="secondary" size="lg">
                Ontdek platform
              </Button>
            </div>
          </div>
          <div className="home-content__stats">
            <div className="home-content__stat">
              <span className="home-content__stat-value">+{totalHives}</span>
              <span className="home-content__stat-label">Bijenstanden</span>
            </div>
            <div className="home-content__stat">
              <span className="home-content__stat-value">+{totalObservations}</span>
              <span className="home-content__stat-label">Waarnemingen</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Refined luxury layout */}
      <section className="home-features">
        <div className="container">
          <div className="home-features__grid">
            <div className="feature-card">
              <h3 className="feature-card__title">Bijenstanden beheren</h3>
              <p className="feature-card__text">
                Registreer met GPS-coördinaten. 
                Jouw locaties blijven 100% privé.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-card__title">Waarnemingen loggen</h3>
              <p className="feature-card__text">
                Observeer, reken en noteer alles wat je ziet bij je behuizing.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-card__title">Drachtkalender</h3>
              <p className="feature-card__text">
                Zie welke planten binnen 200m-7 km van je standen bloeien.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-card__title">Behuizingen volgen</h3>
              <p className="feature-card__text">
                Houd per behuizing bij welk type het is en wat de status is.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-card__title">Multi-device sync</h3>
              <p className="feature-card__text">
                Automatisch gesynchroniseerd op al je apparaten.
              </p>
            </div>

            <div className="feature-card">
              <h3 className="feature-card__title">Data-analyse</h3>
              <p className="feature-card__text">
                Krijg inzicht in je imkerpraktijken met overzichtelijke statistieken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform CTA */}
      <section className="home-platform">
        <div className="container">
          <div className="home-platform__content">
            <h2 className="home-platform__title">Klaar om te starten?</h2>
              <p className="home-platform__text">Begin vandaag nog met het beheren van je bijenstanden en behuizingen.</p>
            <div className="home-platform__actions">
             
              <Button href="/auth/register" variant="primary" size="lg">
               Maak een gratis account aan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
