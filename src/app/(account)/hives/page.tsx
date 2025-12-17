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
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="page-header">
          <h1 className="title">Mijn kasten</h1>
        </div>
        {hives.length > 0 ? (
          <>
            <div className="hives-list">
              {hives.map(hive => (
                <Link
                  key={hive.id}
                  href={`/hives/${hive.id}`}
                  className="hive-card hive-card--link"
                >
                  <div className="hive-card__header">
                    <h3 className="card__title">Kast: {hive.name}</h3>
                    <h2 className="card__title">Type: {hive.type}</h2>
                    <span className="badge badge--secondary">
                      {hive.colonyType}
                    </span>
                  </div>
                  <p className="card__text text-secondary">
                    Bijenstand: {hive.apiary.name}
                  </p>
                </Link>
              ))}
            </div>
            <div>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/hives?page=${
                  currentPage > 1 ? currentPage - 1 : currentPage
                }`}
              >
                Vorige pagina
              </Link>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/hives?page=${
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
        ) : (
          <div className="empty-state">
            <h2 className="section__title">Nog geen kasten</h2>
            <p className="text-secondary mb-lg">
              Voeg eerst een bijenstand toe om kasten te kunnen aanmaken
            </p>
            <Link
              href="/apiaries/new"
              className="button button--primary button--large"
            >
              + Bijenstand toevoegen
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
