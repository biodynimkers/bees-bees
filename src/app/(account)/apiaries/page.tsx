import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

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
    },
  });

  if (!apiaries) redirect('/auth/login');

  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Mijn bijenstanden</h1>
          <p className="page-header__subtitle">
            {totalApiaries} {totalApiaries === 1 ? 'locatie' : 'locaties'}
          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container">
          {apiaries.length > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
                <h2 className="heading-secondary" style={{ 
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: "400"
                }}>
                  Mijn bijenstanden
                </h2>
                <Link href="/apiaries/new">
                  <button className="btn btn--secondary">
                    + Nieuwe bijenstand
                  </button>
                </Link>
              </div>

              <div className="grid grid-two-columns">
                {apiaries.map(apiary => (
                  <Link
                    key={apiary.id}
                    href={`/apiaries/${apiary.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-4)" }}>
                        <h3 className="heading-tertiary" style={{ color: "white", background: "var(--color-primary)", padding: "var(--space-2) var(--space-3)", borderRadius: "4px" }}>{apiary.name}</h3>
                        <span style={{ 
                          fontSize: "0.875rem",
                          padding: "var(--space-2) var(--space-3)",
                          background: "var(--color-primary)",
                          color: "white",
                          borderRadius: "4px"
                        }}>
                          {apiary.hives.length} {apiary.hives.length === 1 ? 'kast' : 'kasten'}
                        </span>
                      </div>
                      <p className="card__text">
                        {apiary.latitude?.toFixed(5)}, {apiary.longitude?.toFixed(5)}
                      </p>
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
