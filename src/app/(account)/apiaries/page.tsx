import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import ApiariesOverviewMap from '@/components/shared/ApiariesOverviewMap';

export const dynamic = 'force-dynamic';

export default async function AccountApiariesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const apiariesPerPage = 5;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const totalApiaries = await prisma.apiary.count({
    where: { userId: session?.user?.id },
  });
  const totalPages = Math.ceil(totalApiaries / apiariesPerPage);

  const apiaries = await prisma.apiary.findMany({
    where: { userId: session?.user?.id },
    skip: (currentPage - 1) * apiariesPerPage,
    take: apiariesPerPage,
    include: {
      hives: true,
      _count: {
        select: { hives: true }
      }
    },
  });

  // Haal alle apiaries op voor de kaart (zonder pagination)
  const allApiaries = await prisma.apiary.findMany({
    where: { userId: session?.user?.id },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      _count: {
        select: { hives: true }
      }
    }
  });

  if (!apiaries) redirect('/auth/login');

  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <div className="nav__container" style={{ padding: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
              <div>
                <h1 className="heading-primary">Mijn bijenstanden ({totalApiaries})</h1>
              </div>
              <div className="page-header__actions">
                <Link href="/apiaries/new">
                  <button className="btn btn--secondary">
                    + Nieuwe bijenstand
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          {apiaries.length > 0 ? (
            <>
              {/* Overzichtskaart */}
              <div style={{ marginBottom: 'var(--space-12)' }}>
                <h2 className="heading-secondary" style={{ marginBottom: 'var(--space-6)' }}>
                  Overzicht locaties
                </h2>
                <ApiariesOverviewMap apiaries={allApiaries} />
              </div>

              {/* Bijenstanden grid */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h2 className="heading-secondary" style={{ marginBottom: 'var(--space-6)' }}>
                  Alle bijenstanden
                </h2>
              </div>
              
              <div className="grid grid-two-columns">
                {apiaries.map(apiary => (
                  <Link
                    key={apiary.id}
                    href={`/apiaries/${apiary.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card">
                      <p className="card__category">
                        Bijenstand
                      </p>
                      <h3 className="heading-tertiary">
                        {apiary.name}
                      </h3>
                      <div className="card__divider">
                        <p className="card__label">Behuizingen</p>
                        <p className="card__value">{apiary.hives.length} {apiary.hives.length === 1 ? 'behuizing' : 'behuizingen'}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center",
                  gap: "var(--space-4)",
                  marginTop: "var(--space-12)"
                }}>
                  <Link href={`/apiaries?page=${currentPage > 1 ? currentPage - 1 : 1}`}>
                    <button className="btn btn--secondary" disabled={currentPage === 1}>
                      Vorige
                    </button>
                  </Link>
                  <span style={{ color: "var(--color-text-light)" }}>
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link href={`/apiaries?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}>
                    <button className="btn btn--secondary" disabled={currentPage === totalPages}>
                      Volgende
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-16) 0" }}>
              <h2 className="heading-secondary" style={{ 
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: "400",
                marginBottom: "var(--space-4)"
              }}>
                Nog geen bijenstanden
              </h2>
              <p style={{ 
                color: "var(--color-text-light)",
                marginBottom: "var(--space-8)"
              }}>
                Begin met het toevoegen van uw eerste bijenstand
              </p>
              <Link href="/apiaries/new">
                <button className="btn btn--secondary btn--lg">
                  + Eerste bijenstand toevoegen
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  
  );
}
