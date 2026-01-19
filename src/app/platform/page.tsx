'use client';

import { useState, useEffect} from 'react';
import { ChevronDown } from 'lucide-react';
import ScrollAnimations from '@/components/home/ScrollAnimations';

export default function PlatformPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'Kost het platform iets?',
      answer: 'Nee, het platform is volledig gratis te gebruiken. Er zijn geen verborgen kosten of premium features.'
    },
    {
      question: 'Zijn mijn gegevens veilig?',
      answer: 'Ja, je gegevens zijn volledig privé. Alleen jij hebt toegang tot je bijenstanden en observaties.'
    },
    {
      question: 'Werkt het platform op mobiel?',
      answer: 'Het platform is volledig responsive en werkt op alle apparaten. Noteer direct in het veld.'
    },
    {
      question: 'Wat als ik hulp nodig heb?',
      answer: 'Contact opnemen via de contactpagina. We helpen je graag verder.'
    },
    {
      question: 'Hoeveel behuizingen kan ik registreren?',
      answer: 'Er is geen limiet. Of je nu 2 behuizingen hebt of 200, het platform schaalt mee.'
    },
    {
      question: 'Kan ik mijn data exporteren?',
      answer: 'Je data blijft altijd van jou. Export-functionaliteit volgt binnenkort.'
    }
  ];

  return (
    <>
      <ScrollAnimations />
      
      <div className="platform-page">
        <section className="platform-hero">
          <div className="container">
            <div className="platform-hero__content animate-on-scroll">
              <span className="platform-hero__label">Platform</span>
              <h1 className="platform-hero__title">
                Digitaal bijenhouden
              </h1>
              <p className="platform-hero__intro">
                Alles netjes georganiseerd en altijd bij de hand
              </p>
            </div>
          </div>
        </section>

        <section className="home-features">
          <div className="container">
            <div className="home-features__grid platform-features__grid">
              <div className="feature-card animate-on-scroll">
                <div className="platform-feature__number">01</div>
                <h3 className="feature-card__title">Account</h3>
                <p className="feature-card__text">
                  Registreer gratis in minder dan een minuut
                </p>
              </div>

              <div className="feature-card animate-on-scroll">
                <div className="platform-feature__number">02</div>
                <h3 className="feature-card__title">Bijenstanden</h3>
                <p className="feature-card__text">
                  Registreer locaties met GPS-coördinaten
                </p>
              </div>

              <div className="feature-card animate-on-scroll">
                <div className="platform-feature__number">03</div>
                <h3 className="feature-card__title">Behuizingen</h3>
                <p className="feature-card__text">
                  Koppel behuizingen aan je standen
                </p>
              </div>

              <div className="feature-card animate-on-scroll">
                <div className="platform-feature__number">04</div>
                <h3 className="feature-card__title">Waarnemingen</h3>
                <p className="feature-card__text">
                  Noteer observaties direct in het veld
                </p>
              </div>

              <div className="feature-card feature-card--highlight animate-on-scroll">
                <h3 className="feature-card__title">Voordelen</h3>
                <div className="platform-benefits">
                  <span>Overzicht meerdere standen</span>
                  <span>Geschiedenis per behuizing</span>
                  <span>Patronen herkennen</span>
                  <span>Altijd toegankelijk</span>
                </div>
              </div>

              <div className="feature-card feature-card--highlight animate-on-scroll">
                <h3 className="feature-card__title">Gratis platform</h3>
                <p className="feature-card__text">
                  Geen kosten, geen verborgen features, altijd gratis
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="platform-faq">
          <div className="container">
            <div className="platform-faq__header">
              <h2 className="platform-faq__title animate-on-scroll">Vragen</h2>
            </div>
            
            <div className="platform-faq__list">
              {faqs.map((faq, index) => (
                <div key={index} className="platform-faq__item animate-on-scroll">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="platform-faq__question"
                    aria-expanded={openFaq === index}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      size={16} 
                      className={`platform-faq__icon ${openFaq === index ? 'is-open' : ''}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="platform-faq__answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-platform">
          <div className="container">
            <div className="home-platform__content animate-on-scroll">
              <h2 className="home-platform__title">Klaar om te starten?</h2>
             
              <div className="home-platform__actions">
                <a href="/auth/register" className="btn btn--primary">
                  Maak een gratis account aan 
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}