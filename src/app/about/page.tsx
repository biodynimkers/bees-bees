import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section section--standard bg-alt">
        <div className="container container--narrow text-center">
          <h1 className="title">Over Ons Platform</h1>
          <p className="subtitle subtitle--centered">
            Digitale innovatie voor de moderne imker, gebouwd op decennia aan
            ervaring
          </p>
        </div>
      </section>

      {/* Missie met foto */}
      <section className="section section--standard bg-white">
        <div className="container">
          <div className="content-with-image">
            <div className="image-placeholder image-placeholder--vertical">
              [Foto: Close-up van bijenraat met honing]
            </div>
            <div className="content-with-image__text">
              <h2 className="section__title section__title--left">
                Onze Missie
              </h2>
              <p className="text-large">
                Sinds 1980 streeft Biodyn Imkers naar een harmonieuze
                samenwerking met de bij. Onze missie is om deze rijke traditie
                te combineren met moderne technologie.
              </p>
              <p className="text-large">
                Dit platform is ontstaan uit een simpele observatie: imkers
                verzamelen schat aan kennis, maar deze verdwijnt vaak in
                notitieboekjes of blijft beperkt tot individuele ervaringen.
              </p>
              <p className="text-large">
                Door digitalisering maken we deze waardevolle observaties
                toegankelijk, deelbaar en bruikbaar voor de hele
                imkersgemeenschap.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waarom deze webapp */}
      <section className="section section--standard bg-alt">
        <div className="container">
          <h2 className="section__title">Voor de moderne imker</h2>
          <div className="grid grid--2">
            <article className="card">
              <h3 className="card__title">Van papier naar digitaal</h3>
              <p className="card__text">
                Geen verloren notities meer. Al uw observaties veilig opgeslagen
                in de cloud, altijd en overal toegankelijk via smartphone,
                tablet of computer.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Uw privacy gewaarborgd</h3>
              <p className="card__text">
                Deel kennis zonder risico. Andere imkers zien uw observaties en
                trends, maar exacte GPS-locaties van uw standen blijven 100%
                privé en beveiligd.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Datagedreven beslissingen</h3>
              <p className="card__text">
                Analyseer trends over meerdere seizoenen. Ontdek welke
                interventies werken en optimaliseer uw imkerpraktijk op basis
                van feiten, niet vermoedens.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Beveiligd persoonlijk account</h3>
              <p className="card__text">
                Volledige controle over uw gegevens. Bepaal zelf wat u deelt met
                de gemeenschap en houd gevoelige informatie privé in uw
                beveiligde account.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Kennisdeling op uw voorwaarden</h3>
              <p className="card__text">
                Leer van andere imkers in uw regio. Vergelijk drachtperiodes en
                deel ervaringen, zonder dat anderen weten waar uw standen
                precies staan.
              </p>
            </article>
            <article className="card">
              <h3 className="card__title">Tijdsbesparing</h3>
              <p className="card__text">
                Snelle invoer met slimme formulieren en timers. Automatische
                rapporten en statistieken. Meer tijd voor uw bijen, minder tijd
                aan administratie.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Platform features met foto */}
      <section className="section section--standard bg-white">
        <div className="container">
          <h2 className="section__title">Wat kunt u doen?</h2>
          <div className="feature-section-grid mb-3xl">
            <div>
              <h3 className="card__title">Bijenstanden beheren</h3>
              <p className="card__text">
                Registreer al uw bijenstanden met GPS-locatie. Koppel
                automatisch de relevante drachtplanten binnen een straal van 2-7
                km. Volg de ontwikkeling per stand doorheen het seizoen.
              </p>
              <ul className="feature-list">
                <li>GPS-locatie met kaartweergave</li>
                <li>Automatische drachtkalender</li>
                <li>Overzicht per seizoen</li>
              </ul>
            </div>
            <div className="image-placeholder">
              [Foto: Smartphone met kaart van bijenstanden]
            </div>
          </div>

          <div className="feature-section-grid">
            <div className="image-placeholder feature-section__image-left">
              [Foto: Imker noteert met tablet bij bijenkast]
            </div>
            <div className="feature-section__text-right">
              <h3 className="card__title">Observaties registreren</h3>
              <p className="card__text">
                Snelle invoer met intelligente formulieren. Tel bijen met de
                ingebouwde 30-seconden timer. Noteer stuifmeelkleuren,
                populatiegrootte en bijzonderheden.
              </p>
              <ul className="feature-list">
                <li>30-seconden timer voor bijentelling</li>
                <li>Stuifmeelkleuren vastleggen</li>
                <li>Foto's toevoegen aan observaties</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
