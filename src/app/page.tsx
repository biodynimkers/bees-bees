import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/client";
import StatsSection from "@/components/home/StatsSection";

export default async function Home() {
  // Haal statistieken op uit de database
  const totalObservations = await prisma.observation.count();
  const totalUsers = await prisma.user.count();
  const totalApiaries = await prisma.apiary.count(); // later gebruiken indien nodig
  const totalHives = await prisma.hive.count();
  return (
    <>
      {/* Hero Section */}
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
              Uw digitale imker
              <span className="title__highlight title__highlight--primary">
                assistent
              </span>
            </h1>
            <p className="subtitle subtitle--hero">
              Houd al uw bijenstanden, kasten en observaties bij op één
              platform. Simpel, overzichtelijk, effectief.
            </p>
            <div className="button-group">
              <Link
                href="/auth/register"
                className="button button--primary button--large"
              >
                Start gratis
              </Link>
              <Link
                href="/about"
                className="button button--outline button--large"
              >
                Meer info
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats direct onder hero */}
      <StatsSection
        totalObservations={totalObservations}
        totalUsers={totalUsers}
        totalHives={totalHives}
      />

      {/* Waarom kiezen imkers voor ons platform */}
      <section className="section section--standard bg-white">
        <div className="container">
          <h2 className="section__title text-center mb-xl">
            Waarom kiezen imkers voor ons platform?
          </h2>

          <div className="grid grid--2">
            <article className="card">
              <h3 className="card__title">Alles op één plek</h3>
              <p className="card__text">
                Geen papieren boekjes meer. Beheer al uw bijenstanden, kasten en
                observaties digitaal en toegankelijk vanaf elk apparaat.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">100% privé en veilig</h3>
              <p className="card__text">
                Uw gegevens zijn volledig beschermd. Locaties van uw standen
                blijven privé - andere imkers kunnen alleen observaties zien,
                nooit uw exacte locaties.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Inzicht in trends</h3>
              <p className="card__text">
                Vergelijk waarnemingen door de seizoenen heen. Ontdek patronen
                en optimaliseer uw werkwijze op basis van data.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Slimme drachtkalender</h3>
              <p className="card__text">
                Zie in één oogopslag welke planten binnen 2-7 km van uw standen
                bloeien en invloed hebben op uw bijenvolken.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Efficiënte observaties</h3>
              <p className="card__text">
                Tel bijen met de ingebouwde timer, noteer stuifmeelkleuren en
                opmerkingen. Datum en tijd worden automatisch vastgelegd.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Beveiligd account</h3>
              <p className="card__text">
                Al uw data veilig opgeslagen in uw persoonlijke account.
                Volledige controle over wat u deelt met de imkersgemeenschap.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="section section--standard bg-alt">
        <div className="container">
          <div className="content-with-image">
            <div className="content-with-image__text">
              <h2 className="section__title section__title--left">
                Deel kennis, bescherm uw privacy
              </h2>
              <p className="text-large">
                Sluit u aan bij een groeiende community van professionele en
                hobbyimkers. Deel observaties en leer van elkaars ervaringen,
                terwijl uw exacte standlocaties volledig privé blijven.
              </p>
              <p className="text-large">
                Andere imkers kunnen uw observaties en trends bekijken, maar
                krijgen nooit toegang tot de GPS-coördinaten van uw
                bijenstanden. Zo blijft uw investering beschermd.
              </p>
              <p className="text-large">
                U bepaalt zelf wat u deelt via uw beveiligde account. Van
                volledig privé tot actief delen met de gemeenschap - de keuze is
                aan u.
              </p>
            </div>
            <div className="content-with-image__image">
              <Image
                src="/assets/hive-1.jpg"
                alt="Imkers in overleg bij bijenstanden"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Biodynamisch Imkeren */}
      <section className="section section--standard bg-white">
        <div className="container">
          <div className="philosophy-section">
            <div className="philosophy-section__content">
              <h2 className="section__title">Imkeren naar aard en wezen</h2>
              <p className="text-large philosophy-section__intro">
                We delen het respect voor de honingbij en de imme als een levend
                organisme en grijpen zo minimum mogelijk in op haar natuurlijke
                levenswijze.
              </p>
              <p className="text-large">
                Een holistische bijenteelt, die gericht is op het bevorderen van
                de gezondheid en het welzijn van de bijen en de biodiversiteit
                staat centraal. Onze verwondering over het bijenvolk als imme
                leidt tot imkeren naar de "aard en wezen" van de honingbij.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wetenschappelijk onderzoek */}
      <section className="section section--standard bg-alt">
        <div className="container">
          <h2 className="section__title">Data voor onderzoek en bescherming</h2>

          <div className="grid grid--2">
            <article className="card">
              <h3 className="card__title">Wetenschappelijke bijdrage</h3>
              <p className="card__text">
                Elke observatie draagt bij aan onderzoek. Door systematisch data
                te verzamelen over drachtplanten, bijenactiviteit en
                volkgezondheid, helpt u wetenschappers de complexe wereld van
                bestuivers beter te begrijpen.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Klimaatverandering monitoren</h3>
              <p className="card__text">
                Verschuivingen in bloeiperiodes en bijenactiviteit zijn cruciale
                indicatoren. Uw observaties helpen de impact van
                klimaatverandering op bestuivers te volgen en tijdig maatregelen
                te nemen.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Biodiversiteit in kaart</h3>
              <p className="card__text">
                Hoe meer we weten, hoe beter we kunnen beschermen. Uw bijdrage
                helpt bij het identificeren van biodiversiteitshotspots en
                bedreigde gebieden, essentieel voor gerichte
                beschermingsmaatregelen.
              </p>
            </article>

            <article className="card">
              <h3 className="card__title">Toekomst veiligstellen</h3>
              <p className="card__text">
                Bijen bestuiven 75% van onze voedselgewassen. Systematische data
                verzameling bouwt kennis die cruciaal is voor voedselveiligheid
                en het behoud van ons ecosysteem voor toekomstige generaties.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section--standard bg-white">
        <div className="container container--narrow text-center">
          <h2 className="section__title mb-md">Klaar om te starten?</h2>
          <p className="text-secondary mb-lg">
            Sluit u aan bij imkers die hun bijenregistratie vereenvoudigen met
            ons platform.
          </p>
          <Link
            href="/auth/register"
            className="button button--primary button--large"
          >
            Gratis account aanmaken
          </Link>
        </div>
      </section>
    </>
  );
}
