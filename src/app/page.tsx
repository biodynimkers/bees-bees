import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/client";
import StatsSection from "@/components/home/StatsSection";

export default async function Home() {
  // Haal statistieken op uit de database
  const totalObservations = await prisma.observation.count();
  const totalUsers = await prisma.user.count();
  const totalApiaries = await prisma.apiary.count();
  const totalHives = await prisma.hive.count();
  return (
    <>
      {/* A. Hero Section */}
      <section className="hero">
        <div className="hero__image">
          <Image
            src="/assets/hero.jpg"
            alt="Bijenwaarnemingen"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="hero__content-wrapper">
          <div className="hero__content">
            <h1 className="title title--hero">
              Digitale Waarnemingen
              <span className="title__highlight title__highlight--primary">
                voor Imkers
              </span>
            </h1>
            <p className="subtitle subtitle--hero">
              Registreer je bijenstanden, kasten en observaties op één
              overzichtelijk platform.
            </p>
            <div className="button-group">
              <Link
                href="/auth/register"
                className="button button--primary button--large"
              >
                Registreer als imker
              </Link>
              <Link
                href="/about"
                className="button button--outline button--large"
              >
                Over dit project
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* B. Wat je kan doen - 4 functies */}
      <section className="section section--standard bg-white">
        <div className="container">
          <h2 className="section__title text-center mb-xl">Wat kan je doen?</h2>

          <div className="grid grid--2">
            <article className="feature-card">
              <h3 className="feature-card__title">Bijenstanden opslaan</h3>
              <ul className="feature-card__list">
                <li>Locatie koppelen (GPS / kaart)</li>
                <li>Kasttypes en volktypes ingeven</li>
                <li>Overzicht van al je standen</li>
              </ul>
            </article>

            <article className="feature-card">
              <h3 className="feature-card__title">Observaties registreren</h3>
              <ul className="feature-card__list">
                <li>Aantal bijen per 30 seconden</li>
                <li>Kleur van stuifmeel</li>
                <li>Opmerkingen toevoegen</li>
                <li>Automatische tijd + datum (aanpasbaar)</li>
              </ul>
            </article>

            <article className="feature-card">
              <h3 className="feature-card__title">Drachtkalender beheren</h3>
              <ul className="feature-card__list">
                <li>Planten zoeken via waarnemingen.be</li>
                <li>Planten koppelen binnen 2km/7km</li>
                <li>Eigen flora-overzicht</li>
              </ul>
            </article>

            <article className="feature-card">
              <h3 className="feature-card__title">Statistieken & inzichten</h3>
              <ul className="feature-card__list">
                <li>Eigen gemiddelden bekijken</li>
                <li>Regionaal overzicht</li>
                <li>Trends doorheen het jaar</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* C. Waarom dit bestaat */}
      <section className="section section--standard bg-alt">
        <div className="container container--narrow text-center">
          <h2 className="section__title mb-lg">Waarom deze app?</h2>
          <div className="benefits">
            <div className="benefit">
              <p className="benefit__text">
                Je houdt je eigen kastgegevens bij op één plek
              </p>
            </div>
            <div className="benefit">
              <p className="benefit__text">
                Je kan je waarnemingen vergelijken doorheen het jaar
              </p>
            </div>
            <div className="benefit">
              <p className="benefit__text">
                Je ziet via de kaart welke planten binnen 2 km en 7 km invloed
                hebben op jouw bijenvolken
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* D. Hoe werkt het */}
      <section className="section section--standard bg-white">
        <div className="container">
          <h2 className="section__title text-center mb-xl">Zo werkt het</h2>
          <div className="workflow">
            <div className="workflow__step">
              <span className="workflow__number">1</span>
              <h3 className="workflow__title">Registreer</h3>
              <p className="workflow__text">Maak een account aan als imker</p>
            </div>
            <div className="workflow__step">
              <span className="workflow__number">2</span>
              <h3 className="workflow__title">Voeg een bijenstand toe</h3>
              <p className="workflow__text">Koppel de locatie via kaart</p>
            </div>
            <div className="workflow__step">
              <span className="workflow__number">3</span>
              <h3 className="workflow__title">Voeg kasten toe</h3>
              <p className="workflow__text">Registreer kasttype en volktype</p>
            </div>
            <div className="workflow__step">
              <span className="workflow__number">4</span>
              <h3 className="workflow__title">Start observatie</h3>
              <p className="workflow__text">Tel bijen met 30 seconden timer</p>
            </div>
            <div className="workflow__step">
              <span className="workflow__number">5</span>
              <h3 className="workflow__title">Bekijk statistieken</h3>
              <p className="workflow__text">Zie je gemiddelden en trends</p>
            </div>
          </div>
        </div>
      </section>

      {/* E. Cijfers */}
      <StatsSection
        totalObservations={totalObservations}
        totalUsers={totalUsers}
        totalHives={totalHives}
      />

      {/* F. Link naar geschiedenis */}
      <section className="section section--standard bg-white">
        <div className="container container--narrow text-center">
          <h2 className="section__title mb-md">Over de Biodyn Imkers</h2>
          <p className="text-secondary mb-lg">
            Sinds 1980 bouwen aan kennis en observaties. Duurzame imkerij met
            respect voor de bij en de natuur.
          </p>
          <Link href="/about" className="button button--outline">
            Lees ons verhaal
          </Link>
        </div>
      </section>
    </>
  );
}
