export default function PlatformPage() {
  return (
    <>
      <section className="page-header" data-page="02">
        <div className="container">
          <h1 className="page-header__title">Het Platform</h1>
          <p className="page-header__subtitle">
            Digitaal imkeren, overzichtelijk en eenvoudig
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="grid grid--cols-two items-center gap-xl">
            <div>
              <h2 className="text-xlarge mb-md">
                Voor imkers die structuur willen
              </h2>
              <p className="text-large mb-sm">
                Houd al je bijenstanden, kasten en observaties bij op één centrale plek. 
                Geen papieren notitieboekjes meer, geen verspreid werk. Alles netjes 
                georganiseerd en altijd bij de hand.
              </p>
              <p className="text-large">
                Of je nu 2 kasten hebt of 20, het platform schaalt mee met je imkerij.
              </p>
            </div>
            <div className="info-box">
              <h3 className="info-box__title">Waarom digitaal bijhouden?</h3>
              <p className="info-box__text">
                • Overzicht over meerdere standen
              </p>
              <p className="info-box__text">
                • Geschiedenis per kast raadplegen
              </p>
              <p className="info-box__text">
                • Patronen herkennen in je observaties
              </p>
              <p className="info-box__text info-box__text--emphasis">
                • Nooit meer vergeten wat je vorige keer zag
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="section__header text-center">
            <h2 className="section__title">Hoe werkt het?</h2>
            <p className="section__subtitle">
              In vier stappen heb je jouw bijenhouden gedigitaliseerd
            </p>
          </div>

          <div className="grid grid--cols-two">
            <div className="card">
              <div className="display-number--md">01</div>
              <h3 className="card__title mb-sm">Maak een account aan</h3>
              <p className="card__text mb-sm">
                Registreer gratis in minder dan een minuut. Geen betaalgegevens 
                nodig, geen verplichtingen. Je e-mailadres en een wachtwoord 
                zijn genoeg.
              </p>
              <p className="card__text text-light">
                → <a href="/auth/register" className="color-accent">Direct registreren</a>
              </p>
            </div>

            <div className="card">
              <div className="display-number--md">02</div>
              <h3 className="card__title mb-sm">Voeg je bijenstanden toe</h3>
              <p className="card__text mb-sm">
                Registreer de locaties van je bijenstanden met naam en GPS-coördinaten. 
                Je locaties blijven volledig privé en zijn alleen voor jou zichtbaar.
              </p>
              <p className="card__text text-light">
                Handig: gebruik de kaart om snel je locatie te bepalen
              </p>
            </div>

            <div className="card">
              <div className="display-number--md">03</div>
              <h3 className="card__title mb-sm">Registreer je kasten</h3>
              <p className="card__text mb-sm">
                Koppel kasten aan je standen. Geef elke kast een unieke naam en 
                houd bij welk type kast het is (Dadant, Langstroth, enz.) en welk 
                type volk erin zit.
              </p>
              <p className="card__text text-light">
                Per stand zie je direct al je kasten in één overzicht
              </p>
            </div>

            <div className="card">
              <div className="display-number--md">04</div>
              <h3 className="card__title mb-sm">Log je waarnemingen</h3>
              <p className="card__text mb-sm">
                Noteer observaties direct bij je kastcontroles. Bijensterkte, 
                stuifmeelkleur, bijzonderheden – alles vastleggen voor later 
                teruglezen.
              </p>
              <p className="card__text text-light">
                Zie je geschiedenis per kast en herken patronen
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="section__header text-center">
            <h2 className="section__title">Veelgestelde vragen</h2>
          </div>

          <div className="grid grid--cols-two gap-lg">
            <div className="card">
              <h3 className="card__title mb-sm">Kost het platform iets?</h3>
              <p className="card__text">
                Nee, het platform is volledig gratis te gebruiken. Er zijn geen 
                verborgen kosten of premium features. Alles staat open voor 
                alle gebruikers.
              </p>
            </div>

            <div className="card">
              <h3 className="card__title mb-sm">Zijn mijn gegevens veilig?</h3>
              <p className="card__text">
                Ja, je gegevens zijn volledig privé. Alleen jij hebt toegang tot 
                je bijenstanden en observaties. We delen geen data met derden 
                en je GPS-locaties zijn afgeschermd.
              </p>
            </div>

            <div className="card">
              <h3 className="card__title mb-sm">Kan ik het ook op mijn telefoon gebruiken?</h3>
              <p className="card__text">
                Het platform is volledig responsive en werkt op alle apparaten. 
                Noteer observaties direct in het veld via je smartphone en bekijk 
                ze later op je computer.
              </p>
            </div>

            <div className="card">
              <h3 className="card__title mb-sm">Wat als ik hulp nodig heb?</h3>
              <p className="card__text">
                Je kunt altijd contact met ons opnemen via de contactpagina. 
                We helpen je graag verder met vragen over het platform of 
                technische problemen.
              </p>
            </div>

            <div className="card">
              <h3 className="card__title mb-sm">Hoeveel kasten kan ik registreren?</h3>
              <p className="card__text">
                Er is geen limiet. Of je nu 2 kasten hebt of 200, het platform 
                schaalt mee. Voeg onbeperkt bijenstanden, kasten en observaties toe.
              </p>
            </div>

            <div className="card">
              <h3 className="card__title mb-sm">Kan ik mijn data exporteren?</h3>
              <p className="card__text">
                Je data blijft altijd van jou. In de toekomst voegen we export-
                functionaliteit toe zodat je een backup kunt maken van al je 
                gegevens.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="text-center">
            <h2 className="section__title mb-md">Klaar om te beginnen?</h2>
            <p className="text-large mb-lg">
              Registreer nu gratis en begin met het digitaliseren van je imkerij
            </p>
            <div className="flex justify-center gap-sm">
              <a href="/auth/register" className="btn btn--primary">
                Gratis account aanmaken
              </a>
              <a href="/contact" className="btn btn--secondary">
                Eerst contact opnemen
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
