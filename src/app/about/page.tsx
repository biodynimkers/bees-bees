import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <section className="page-header" data-page="04">
        <div className="container">
          <h1 className="page-header__title">Over Ons Platform</h1>
          <p className="page-header__subtitle">
            Digitale innovatie voor de moderne imker, gebouwd op decennia aan
            ervaring
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="section__header">
            <h2 className="section__title">Onze Missie</h2>
          </div>
          <div className="article__body">
            <p>
              Sinds 1980 streeft Biodyn Imkers naar een harmonieuze
              samenwerking met de bij. Onze missie is om deze rijke traditie
              te combineren met moderne technologie.
            </p>
            <p>
              Dit platform is ontstaan uit een simpele observatie: imkers
              verzamelen schat aan kennis, maar deze verdwijnt vaak in
              notitieboekjes of blijft beperkt tot individuele ervaringen.
            </p>
            <p>
              Door digitalisering maken we deze waardevolle observaties
              toegankelijk, deelbaar en bruikbaar voor de hele
              imkersgemeenschap.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__header section__header--center">
            <h2 className="section__title">Voor de moderne imker</h2>
          </div>
          <div className="grid grid-two-columns">
            <article className="card">
              <h3 className="card__title">Van papier naar digitaal</h3>
              <p className="card__description">
                Geen verloren notities meer. Al uw observaties veilig opgeslagen
                in de cloud, altijd en overal toegankelijk via smartphone,
                tablet of computer.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Uw privacy gewaarborgd</h3>
              <p className="card__description">
                Deel kennis zonder risico. Andere imkers zien uw observaties en
                trends, maar exacte GPS-locaties van uw standen blijven 100%
                privé en beveiligd.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Datagedreven beslissingen</h3>
              <p className="card__description">
                Analyseer trends over meerdere seizoenen. Ontdek welke
                interventies werken en optimaliseer uw imkerpraktijk op basis
                van feiten, niet vermoedens.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Beveiligd persoonlijk account</h3>
              <p className="card__description">
                Volledige controle over uw gegevens. Bepaal zelf wat u deelt met
                de gemeenschap en houd gevoelige informatie privé in uw
                beveiligde account.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Kennisdeling op uw voorwaarden</h3>
              <p className="card__description">
                Leer van andere imkers in uw regio. Vergelijk drachtperiodes en
                deel ervaringen, zonder dat anderen weten waar uw standen
                precies staan.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Tijdsbesparing</h3>
              <p className="card__description">
                Snelle invoer met slimme formulieren en timers. Automatische
                rapporten en statistieken. Meer tijd voor uw bijen, minder tijd
                aan administratie.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Platform features met foto */}
      <section className="section ">
        <div className="container">
          <div className="section__header section__header--center">
            <h2 className="section__title">Wat kunt u doen?</h2>
          </div>
          <div className="grid grid-two-columns">
            <div className="card">
              <h3 className="card__title">Bijenstanden beheren</h3>
              <p className="card__description">
                Registreer al uw bijenstanden met GPS-locatie. Koppel
                automatisch de relevante drachtplanten binnen een straal van 2-7
                km. Volg de ontwikkeling per stand doorheen het seizoen.
              </p>
            </div>
            <div className="card">
              <h3 className="card__title">Observaties registreren</h3>
              <p className="card__description">
                Snelle invoer met intelligente formulieren. Tel bijen met de
                ingebouwde 30-seconden timer. Noteer stuifmeelkleuren,
                populatiegrootte en bijzonderheden.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container container--narrow">
          <div className="section__header section__header--center">
            <h2 className="section__title">Klaar om te starten?</h2>
            <p className="section__description">
              Sluit u aan bij imkers die hun bijenregistratie vereenvoudigen met
              ons platform.
            </p>
          </div>
          <div className="section__actions">
            <Link href="/auth/register" className="btn btn--primary btn--large">
              Gratis account aanmaken
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
