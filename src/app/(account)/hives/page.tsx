import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';

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
  const hivesPerPage = 20;
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
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">{totalHives} {totalHives === 1 ? 'behuizing' : 'behuizingen'}</span>
            <h1 className="platform-hero__title">Mijn behuizingen</h1>
            <div className="btn-group">
              <Link href="/hives/new" className="btn btn--secondary btn--large">
                + Nieuwe behuizing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[
        { label: 'Account', href: '/account' },
        { label: 'Behuizingen' }
      ]} />

      <section className="home-features">
        <div className="container">
          {hives.length > 0 ? (
            <>
              <div className="home-features__grid">
                {hives.map(hive => (
                  <Link
                    key={hive.id}
                    href={`/hives/${hive.id}`}
                    className="feature-card"
                  >
                    <span className="feature-card__label">Behuizing</span>
                    <h3 className="feature-card__title">{hive.name}</h3>
                    <div className="feature-card__meta">
                      <div className="meta-item">
                        <span className="meta-label">Bijenstand</span>
                        <span className="meta-value">{hive.apiary.name}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Type behuizing</span>
                        <span className="meta-value">{hive.type}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-label">Variëteit</span>
                        <span className="meta-value">{hive.colonyType}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <Link href={`/hives?page=${currentPage > 1 ? currentPage - 1 : 1}`} className="btn btn--secondary">
                    Vorige
                  </Link>
                  <span className="pagination-info">
                    Pagina {currentPage} van {totalPages}
                  </span>
                  <Link href={`/hives?page=${currentPage < totalPages ? currentPage + 1 : totalPages}`} className="btn btn--secondary">
                    Volgende
                  </Link>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Nog geen behuizingen"
              description="Voeg eerst een bijenstand toe om behuizingen te kunnen aanmaken en beheren."
              buttonText="+ Voeg je eerste bijenstand toe"
              buttonHref="/apiaries/new"
            />
          )}
        </div>
      </section>
    </div>
  );
}
