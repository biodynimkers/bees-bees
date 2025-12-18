import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';

export const dynamic = 'force-dynamic';

export default async function AccountHivesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      apiaries: {
        include: {
          hives: true,
        },
      },
    },
  });

  if (!user) redirect('/auth/login');

  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const hivesPerPage = 5;
  const totalHives = await prisma.hive.count({
    where: {
      apiary: { userId: session?.user?.id },
    },
  });
  const totalPages = Math.ceil(totalHives / hivesPerPage);
  const hives = await prisma.hive.findMany({
    where: {
      apiary: { userId: session?.user?.id },
    },
    skip: (currentPage - 1) * hivesPerPage,
    take: hivesPerPage,
    include: {
      apiary: true,
    },
  });

  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="page-header__title">Mijn kasten</h1>
          <p className="page-header__subtitle">
            {totalHives} {totalHives === 1 ? 'kast' : 'kasten'}
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container">
          {hives.length > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-8)" }}>
                <h2 style={{ 
                  fontFamily: "var(--font-display)",
                  fontSize: "2rem",
                  fontWeight: "400"
                }}>
                  Mijn kasten
                </h2>
                <Link href="/hives/new">
                  <button className="btn btn--primary">
                    + Nieuwe kast
                  </button>
                </Link>
              </div>

              <div className="grid grid--3">
                {hives.map(hive => (
                  <Link
                    key={hive.id}
                    href={`/hives/${hive.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="card">
                      <p className="card__category">{hive.type}</p>
                      <h3 className="card__title">{hive.name}</h3>
                      <p className="card__text" style={{ marginBottom: "var(--space-3)" }}>
                        {hive.apiary.name}
                      </p>
                      <span style={{ 
                        fontSize: "0.875rem",
                        padding: "var(--space-2) var(--space-3)",
                        background: "rgba(0, 0, 0, 0.05)",
                        borderRadius: "4px",
                        display: "inline-block"
                      }}>
                        {hive.colonyType}
                      </span>
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
                  <Link href={`/hives?page=${currentPage > 1 ? currentPage - 1 : 1}`}>
                    <button className="btn btn--secondary" disabled={currentPage === 1}>
                      Vorige
                    </button>
                  </Link>
                  <span style={{ color: "var(--color-text-light)" }}>
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link href={`/hives?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}>
                    <button className="btn btn--secondary" disabled={currentPage === totalPages}>
                      Volgende
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-16) 0" }}>
              <h2 style={{ 
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                fontWeight: "400",
                marginBottom: "var(--space-4)"
              }}>
                Nog geen kasten
              </h2>
              <p style={{ 
                color: "var(--color-text-light)",
                marginBottom: "var(--space-8)"
              }}>
                Voeg eerst een bijenstand toe om kasten te kunnen aanmaken
              </p>
              <Link href="/apiaries/new">
                <button className="btn btn--primary btn--lg">
                  + Bijenstand toevoegen
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
