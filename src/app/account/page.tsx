import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/client";

export default async function AccountPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Haal gebruiker op met alle bijenstanden, kasten en observaties
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      apiaries: {
        include: {
          hives: {
            include: {
              observations: {
                orderBy: { createdAt: "desc" },
                take: 5, // Laatste 5 observaties per kast
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  const totalApiaries = user.apiaries.length;
  const totalHives = user.apiaries.reduce(
    (sum, apiary) => sum + apiary.hives.length,
    0
  );
  const totalObservations = user.apiaries.reduce(
    (sum, apiary) =>
      sum +
      apiary.hives.reduce(
        (hiveSum, hive) => hiveSum + hive.observations.length,
        0
      ),
    0
  );

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        {/* Header met welkom */}
        <div className="account-header">
          <h1 className="title">Welkom, {user.name}</h1>
          <p className="text-secondary">
            Beheer uw bijenstanden, kasten en observaties op één plek
          </p>
        </div>

        {/* Statistieken */}
        <div className="stats-grid">
          <Link href="/account/apiaries" className="stat-card stat-card--link">
            <h3 className="stat-card__number">{totalApiaries}</h3>
            <p className="stat-card__label">Bijenstanden</p>
          </Link>
          <Link href="/account/hives" className="stat-card stat-card--link">
            <h3 className="stat-card__number">{totalHives}</h3>
            <p className="stat-card__label">Kasten</p>
          </Link>
          <Link
            href="/account/observations"
            className="stat-card stat-card--link"
          >
            <h3 className="stat-card__number">{totalObservations}</h3>
            <p className="stat-card__label">Observaties</p>
          </Link>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          <h2 className="section__title">Snelle acties</h2>
          <div className="grid grid--2">
            <Link href="/account/apiaries/new" className="action-card">
              <h3 className="card__title">+ Nieuwe bijenstand</h3>
              <p className="card__text">
                Registreer een nieuwe locatie voor uw bijenkasten
              </p>
            </Link>
            <Link href="/account/hives/new" className="action-card">
              <h3 className="card__title">+ Nieuwe kast</h3>
              <p className="card__text">
                Voeg een kast toe aan een bestaande stand
              </p>
            </Link>
            <Link href="/account/observations/new" className="action-card">
              <h3 className="card__title">+ Nieuwe observatie</h3>
              <p className="card__text">
                Registreer een waarneming van bijenactiviteit
              </p>
            </Link>
            <Link href="/account/apiaries" className="action-card">
              <h3 className="card__title">Beheer bijenstanden</h3>
              <p className="card__text">
                Bekijk en wijzig uw bestaande bijenstanden
              </p>
            </Link>
          </div>
        </div>

        {/* Bijenstanden overzicht */}
        {user.apiaries.length > 0 ? (
          <div className="apiaries-overview">
            <h2 className="section__title">Uw bijenstanden</h2>
            <div className="apiaries-list">
              {user.apiaries.map((apiary) => (
                <div key={apiary.id} className="apiary-card">
                  <div className="apiary-card__header">
                    <h3 className="card__title">{apiary.name}</h3>
                    <span className="badge">{apiary.hives.length} kasten</span>
                  </div>
                  <p className="card__text">{apiary.location}</p>
                  <div className="apiary-card__actions">
                    <Link
                      href={`/account/apiaries/${apiary.id}`}
                      className="button button--outline"
                    >
                      Bekijk details
                    </Link>
                    <Link
                      href={`/account/apiaries/${apiary.id}/hives/new`}
                      className="button button--primary"
                    >
                      + Nieuwe kast
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h2 className="section__title">Nog geen bijenstanden</h2>
            <p className="text-secondary mb-lg">
              Begin met het toevoegen van uw eerste bijenstand om uw kasten en
              observaties bij te houden.
            </p>
            <Link
              href="/account/apiaries/new"
              className="button button--primary button--large"
            >
              + Eerste bijenstand toevoegen
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
