import Link from 'next/link';

export default function AdminPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Beheerder Dashboard</h1>
          <p className="page-header__subtitle">
            Welkom in het beheerders panel
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          <div className="grid grid--3">
            <Link href="/admin/users">
              <div className="card">
                <h3 className="card__title">Gebruikers</h3>
                <p className="card__text">
                  Beheer alle gebruikers en hun rechten
                </p>
              </div>
            </Link>

            <Link href="/admin/apiaries">
              <div className="card">
                <h3 className="card__title">Bijenstanden</h3>
                <p className="card__text">
                  Overzicht van alle bijenstanden
                </p>
              </div>
            </Link>

            <Link href="/admin/hives">
              <div className="card">
                <h3 className="card__title">Kasten</h3>
                <p className="card__text">
                  Overzicht van alle bijenkasten
                </p>
              </div>
            </Link>

            <Link href="/admin/observations">
              <div className="card">
                <h3 className="card__title">Observaties</h3>
                <p className="card__text">
                  Alle geregistreerde observaties
                </p>
              </div>
            </Link>

            <Link href="/admin/stats">
              <div className="card">
                <h3 className="card__title">Statistieken</h3>
                <p className="card__text">
                  Platform statistieken en analyses
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
