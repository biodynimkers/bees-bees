import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__image">
          <Image
            src="/assets/hero.jpg"
            alt="Bee on flower"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
        <div className="hero__content-wrapper">
          <div className="hero__content">
            <h1 className="title title--hero">
              Beheer je bijenkasten
              <span className="title__highlight title__highlight--primary">
                met vertrouwen
              </span>
            </h1>
            <p className="subtitle subtitle--hero">
              Ontdek de kracht van slimme bijenteelt. Monitor je kasten, volg je
              kolonie en help de natuur bloeien met onze moderne tools.
            </p>
            <div className="button-group">
              <Link
                href="/auth/register"
                className="button button--primary button--large"
              >
                Start Nu
              </Link>
              <Link
                href="/about"
                className="button button--outline button--large"
              >
                Meer Info
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--standard bg-white">
        <div className="container">
          <div className="grid grid--auto">
            <Link
              href="/account/apiaries"
              className="card card--minimal card--link"
            >
              <div className="card__body">
                <h3 className="card__title">Bijenkast Beheer</h3>
                <p className="card__description">
                  Beheer al je bijenkasten op één centrale plek. Houd
                  observaties bij en volg de gezondheid van je kolonie.
                </p>
              </div>
            </Link>

            <Link
              href="/account/apiaries"
              className="card card--minimal card--link"
            >
              <div className="card__body">
                <h3 className="card__title">Slimme Monitoring</h3>
                <p className="card__description">
                  Volg de ontwikkeling van je bijenkolonies in real-time. Krijg
                  inzichten in productie en gezondheid.
                </p>
              </div>
            </Link>

            <Link
              href="/account/apiaries/plants"
              className="card card--minimal card--link"
            >
              <div className="card__body">
                <h3 className="card__title">Plant Database</h3>
                <p className="card__description">
                  Ontdek welke planten het beste zijn voor je bijen.
                  Optimaliseer de omgeving voor maximale honingproductie.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
