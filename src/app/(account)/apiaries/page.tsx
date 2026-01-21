import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import ApiariesOverviewMap from '@/components/shared/ApiariesOverviewMap';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';

export const dynamic = 'force-dynamic';

export default async function AccountApiariesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const apiariesPerPage = 20;
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
        select: { hives: true },
      },
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
        select: { hives: true },
      },
    },
  });

  if (!apiaries) redirect('/auth/login');

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">{totalApiaries} {totalApiaries === 1 ? 'bijenstand' : 'bijenstanden'}</span>
            <h1 className="platform-hero__title">
              Mijn bijenstanden
            </h1>
            <div style={{ marginTop: '32px' }}>
              <Link href="/apiaries/new" className="btn btn--secondary btn--large">
                + Nieuwe bijenstand
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[
        { label: 'Account', href: '/account' },
        { label: 'Bijenstanden' }
      ]} />

      <section className="home-features">
        <div className="container">
          {apiaries.length > 0 ? (
            <>
              {/* Overzichtskaart */}
              <div style={{ marginBottom: '60px' }}>
                <h2 className="feature-card__title" style={{ textAlign: 'center', marginBottom: '32px' }}>
                  Overzicht locaties
                </h2>
                <ApiariesOverviewMap apiaries={allApiaries} />
              </div>

              {/* Bijenstanden grid */}
              <div className="home-features__grid">
                {apiaries.map(apiary => (
                  <Link
                    key={apiary.id}
                    href={`/apiaries/${apiary.id}`}
                    className="feature-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div style={{ fontSize: '14px', color: 'rgba(14, 97, 93, 0.6)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Bijenstand
                    </div>
                    <h3 className="feature-card__title">
                      {apiary.name}
                    </h3>
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(14, 97, 93, 0.1)', width: '100%' }}>
                      <p className="feature-card__text">
                        {apiary.hives.length} {apiary.hives.length === 1 ? 'behuizing' : 'behuizingen'}
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
                  gap: "16px",
                  marginTop: "60px"
                }}>
                  <Link href={`/apiaries?page=${currentPage > 1 ? currentPage - 1 : 1}`}>
                    <button className="btn btn--secondary" disabled={currentPage === 1}>
                      Vorige
                    </button>
                  </Link>
                  <span style={{ color: "rgba(14, 97, 93, 0.6)" }}>
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link
                    href={`/apiaries?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`}
                  >
                    <button
                      className="btn btn--secondary"
                      disabled={currentPage === totalPages}
                    >
                      Volgende
                    </button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Nog geen bijenstanden"
              description="Voeg je eerste bijenstand toe om te beginnen met het bijhouden van je bijen."
              buttonText="+ Voeg je eerste bijenstand toe"
              buttonHref="/apiaries/new"
            />
          )}
        </div>
      </section>
    </div>
  );
}
