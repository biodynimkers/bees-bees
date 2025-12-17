import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { Hero, Section } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { ApiaryList } from '@/components/features/apiary';
import Link from 'next/link';

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
      /*apiaries: {
        include: {
          _count: {
            select: { hives: true },
          },
        },
      },*/
      hives: true,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      apiaries: {
        include: {
          _count: {
            select: { hives: true },
          },
        },
      },
    },
  });
  if (!user) redirect('/auth/login');

  const apiariesData = user.apiaries.map(apiary => ({
    id: apiary.id,
    name: apiary.name,
    latitude: apiary.latitude,
    longitude: apiary.longitude,
    hiveCount: apiary._count.hives,
  }));

  return (
    <>
      <Hero
        title="Mijn bijenstanden"
        subtitle="Beheer al je bijenstanden op één plek"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenstanden"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          {apiariesData.length === 0 ? (
            <div className="section-header">
              <h2>Nog geen bijenstanden</h2>
              <p>Begin met het toevoegen van uw eerste bijenstand</p>
              <div
                className="section-actions"
                style={{ marginTop: 'var(--space-8)' }}
              >
                <Button href="/apiaries/new" variant="primary" size="large">
                  + Nieuwe bijenstand
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-8)',
                }}
              >
                <h2 style={{ margin: 0 }}>Al uw bijenstanden</h2>
                <Button href="/apiaries/new" variant="primary" size="medium">
                  + Nieuwe bijenstand
                </Button>
              </div>
              <ApiaryList apiaries={apiariesData} />
              <>
                <div className="apiaries-list">
                  {apiaries.map(apiary => (
                    <Link
                      key={apiary.id}
                      href={`/apiaries/${apiary.id}`}
                      className="apiary-card apiary-card--link"
                    >
                      <div className="apiary-card__header">
                        <h3 className="card__title">{apiary.name}</h3>
                        <span className="badge">
                          {apiary.hives.length} kasten
                        </span>
                      </div>
                      <p className="card__text">
                        Locatie: {apiary.latitude?.toFixed(5)},{' '}
                        {apiary.longitude?.toFixed(5)}
                      </p>
                    </Link>
                  ))}
                </div>
                <div>
                  <Link
                    style={{ backgroundColor: 'red', marginRight: '10px' }}
                    href={`/apiaries?page=${
                      currentPage > 1 ? currentPage - 1 : currentPage
                    }`}
                  >
                    Vorige pagina
                  </Link>
                  <Link
                    style={{ backgroundColor: 'red', marginRight: '10px' }}
                    href={`/apiaries?page=${
                      currentPage < totalPages ? currentPage + 1 : currentPage
                    }`}
                  >
                    Volgende pagina
                  </Link>
                  <div
                    style={{
                      backgroundColor: 'lightBlue',
                      display: 'inline-block',
                    }}
                  >
                    {`pagina ${currentPage} van ${totalPages} `}
                  </div>
                </div>
              </>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
