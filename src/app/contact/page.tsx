import { Hero, Section } from "@/components/layout";
import { Button } from "@/components/ui";

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Contact"
        subtitle="Vragen of feedback? We horen graag van je"
        image="/assets/hero-new.jpg"
        imageAlt="Contact met BEES Platform"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          <div className="section-header">
            <h2>Neem contact op</h2>
            <p>
              Heb je vragen over het platform, suggesties voor verbeteringen of
              wil je gewoon hallo zeggen? Vul het formulier in en we nemen zo
              snel mogelijk contact met je op.
            </p>
          </div>

          <div className="form-narrow">
            <form className="form">
              <div className="form__group">
                <label htmlFor="name" className="form__label">
                  Naam
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form__input"
                  required
                />
              </div>

              <div className="form__group">
                <label htmlFor="email" className="form__label">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form__input"
                  required
                />
              </div>

              <div className="form__group">
                <label htmlFor="subject" className="form__label">
                  Onderwerp
                </label>
                <select id="subject" name="subject" className="form__select">
                  <option value="algemeen">Algemene vraag</option>
                  <option value="technisch">Technische ondersteuning</option>
                  <option value="suggestie">Suggestie</option>
                  <option value="samenwerking">Samenwerking</option>
                </select>
              </div>

              <div className="form__group">
                <label htmlFor="message" className="form__label">
                  Bericht
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form__textarea"
                  required
                ></textarea>
                <p className="form__help">
                  Vertel ons waar we je mee kunnen helpen
                </p>
              </div>

              <div className="form__actions form__actions--center">
                <Button type="submit" variant="primary" size="large">
                  Verstuur bericht
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Section>

      <Section variant="alt" spacing="large">
        <div className="container">
          <div className="grid grid-3">
            <div className="text-center">
              <h3 className="text-display text-xl mb-3 contact-info__title">
                E-mail
              </h3>
              <p className="text-base contact-info__text">
                <a
                  href="mailto:info@bees-platform.be"
                  className="contact-info__link"
                >
                  info@bees-platform.be
                </a>
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-display text-xl mb-3 contact-info__title">
                Reactietijd
              </h3>
              <p className="text-base contact-info__text">
                Binnen 24 uur op werkdagen
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-display text-xl mb-3 contact-info__title">
                Support
              </h3>
              <p className="text-base contact-info__text">
                Maandag t/m vrijdag
                <br />
                9:00 - 17:00
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
