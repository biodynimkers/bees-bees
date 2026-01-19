'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function PlatformPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Kost het platform iets?',
      answer: 'Nee, het platform is volledig gratis te gebruiken. Er zijn geen verborgen kosten of premium features. Alles staat open voor alle gebruikers.'
    },
    {
      question: 'Zijn mijn gegevens veilig?',
      answer: 'Ja, je gegevens zijn volledig privé. Alleen jij hebt toegang tot je bijenstanden en observaties. We delen geen data met derden en je GPS-locaties zijn afgeschermd.'
    },
    {
      question: 'Werkt het platform op mobiele telefoon?',
      answer: 'Het platform is volledig responsive en werkt op alle apparaten. Noteer observaties direct in het veld via je smartphone en bekijk ze later op je computer.'
    },
    {
      question: 'Wat als ik hulp nodig heb?',
      answer: 'Je kunt altijd contact met ons opnemen via de contactpagina. We helpen je graag verder met vragen over het platform of technische problemen.'
    },
    {
      question: 'Hoeveel behuizingen kan ik registreren?',
      answer: 'Er is geen limiet. Of je nu 2 behuizingen hebt of 200, het platform schaalt mee. Voeg onbeperkt bijenstanden, behuizingen en observaties toe.'
    },
    {
      question: 'Kan ik mijn data exporteren?',
      answer: 'Je data blijft altijd van jou. In de toekomst voegen we export-functionaliteit toe zodat je een backup kunt maken van al je gegevens.'
    }
  ];

  return (
    <>
      <section className="section section-first">
        <div className="container">
          <div className="grid grid-two-columns items-center gap-extra-large">
            <div>
              <h1 className="heading-primary">
                Digitaal Platform voor Bijenhouden - Overzichtelijk Imkeren
              </h1>
              <p className="text-large margin-bottom-small">
                Houd al je bijenstanden, behuizingen en observaties bij op één centrale plek. 
                Geen papieren notitieboekjes meer, geen verspreid werk. Alles netjes 
                georganiseerd en altijd bij de hand.
              </p>
              <p className="text-large">
                Of je nu 2 behuizingen hebt of 20, het platform schaalt mee met je imkerij.
              </p>
            </div>
            <div className="info-box">
              <h2 className="heading-secondary">Waarom digitaal bijhouden?</h2>
              <p className="info-box__text">
                • Overzicht over meerdere standen
              </p>
              <p className="info-box__text">
                • Geschiedenis per behuizing raadplegen
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

      <section className="section section-alternate">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="heading-secondary">Hoe werkt het platform?</h2>
            <p className="section-subtitle">
              In vier stappen heb je jouw bijenhouden gedigitaliseerd
            </p>
          </div>

          <div className="grid grid-two-columns">
            <div className="card">
              <span className="number-large">01</span>
              <h3 className="heading-tertiary">Account aanmaken</h3>
              <p className="card__text margin-bottom-small">
                Registreer gratis in minder dan een minuut. Geen betaalgegevens 
                nodig, geen verplichtingen. Je e-mailadres en een wachtwoord 
                zijn genoeg.
              </p>
              <p className="card__text text-light">
                → <a href="/auth/register" className="color-accent">Direct registreren</a>
              </p>
            </div>

            <div className="card">
              <span className="number-large">02</span>
              <h3 className="heading-tertiary">Bijenstanden toevoegen</h3>
              <p className="card__text margin-bottom-small">
                Registreer de locaties van je bijenstanden met naam en GPS-coördinaten. 
                Je locaties blijven volledig privé en zijn alleen voor jou zichtbaar.
              </p>
              <p className="card__text text-light">
                Handig: gebruik de kaart om snel je locatie te bepalen
              </p>
            </div>
            <div className="card">
              <span className="number-large">03</span>
              <h3 className="heading-tertiary">Bijhuizingen registreren</h3>
              <p className="card__text margin-bottom-small">
                Koppel bijhuizingen aan je standen. Geef elke bijhuizing een unieke naam en 
                houd bij welk type bijhuizing het is (Dadant, Langstroth, enz.) en welk 
                variëteit erin zit.
              </p>
              <p className="card__text text-light">
                Per stand zie je direct al je behuizingen in één overzicht
              </p>
            </div>

            <div className="card">
              <span className="number-large">04</span>
              <h3 className="heading-tertiary">Waarnemingen loggen</h3>
              <p className="card__text margin-bottom-small">
                Noteer observaties direct bij je behuizingcontroles. Bijensterkte, 
                stuifmeelkleur, bijzonderheden – alles vastleggen voor later 
                teruglezen.
              </p>
              <p className="card__text text-light">
                Zie je geschiedenis per behuizing en herken patronen
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="heading-secondary">Veelgestelde vragen over het platform</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  onClick={() => toggleFaq(index)}
                  className="faq-question"
                  aria-expanded={openFaq === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`faq-icon ${openFaq === index ? 'is-open' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
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
