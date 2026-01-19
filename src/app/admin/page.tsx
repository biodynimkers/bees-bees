import Link from 'next/link';

export default function AdminPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="heading-primary">Beheerder Dashboard</h1>
          <p className="page-header__subtitle">
            Welkom in het beheerders panel
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          <div className="grid grid-three-columns">
            <Link href="/admin/users">
              <div className="card">
                <h3 className="heading-tertiary">Gebruikers</h3>
                <p className="card__text">
                  Beheer alle gebruikers en hun rechten
                </p>
              </div>
            </Link>

            <Link href="/admin/apiaries">
              <div className="card">
                <h3 className="heading-tertiary">Bijenstanden</h3>
                <p className="card__text">
                  Overzicht van alle bijenstanden
                </p>
              </div>
            </Link>

            <Link href="/admin/hives">
              <div className="card">
                <h3 className="heading-tertiary">Behuizingen</h3>
                <p className="card__text">
                  Overzicht van alle bijenbehuizingen
                </p>
              </div>
            </Link>

            <Link href="/admin/observations">
              <div className="card">
                <h3 className="heading-tertiary">Observaties</h3>
                <p className="card__text">
                  Alle geregistreerde observaties
                </p>
              </div>
            </Link>

            <Link href="/admin/stats">
              <div className="card">
                <h3 className="heading-tertiary">Statistieken</h3>
                <p className="card__text">
                  Platform statistieken en analyses
                </p>
              </div>
            </Link>

            <Link href="/admin/extras">
              <div className="card">
                <h3 className="heading-tertiary">Extra's</h3>
                <p className="card__text">
                  Beheer hero afbeelding en content
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
