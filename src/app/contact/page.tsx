export default function ContactPage() {
  return (
    <>
      <section className="section section--first">
        <div className="container container--narrow">
          <div className="section__header section__header--center">
            <h1 className="section__title">Contact – Vragen of feedback? We horen graag van je</h1>
            <h2 className="section__title">Neem contact op</h2>
            <p className="section__description">
              Heb je vragen over het platform, suggesties voor verbeteringen of
              wil je gewoon hallo zeggen? Vul het formulier in en we nemen zo snel
              mogelijk contact met je op.
            </p>
          </div>

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
              <button type="submit" className="btn btn--primary btn--large">
                Verstuur bericht
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--3">
            <div className="text-center">
              <h3 className="card__title">E-mail</h3>
              <p className="card__description">
                <a href="mailto:info@bees-platform.be">
                  info@bees-platform.be
                </a>
              </p>
            </div>

            <div className="text-center">
              <h3 className="card__title">Reactietijd</h3>
              <p className="card__description">
                Binnen 24 uur op werkdagen
              </p>
            </div>

            <div className="text-center">
              <h3 className="card__title">Support</h3>
              <p className="card__description">
                Maandag t/m vrijdag
                <br />
                9:00 - 17:00
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
