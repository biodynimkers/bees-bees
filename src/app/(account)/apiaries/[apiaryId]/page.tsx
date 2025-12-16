import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';

export const dynamic = 'force-dynamic';

export default async function AccountApiaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ apiaryId: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { apiaryId } = await params;
  const apiaryOwner = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { userId: true },
  });

  if (!apiaryOwner) {
    redirect('/not-found');
  }

  if (
    apiaryOwner.userId !== session?.user.id &&
    session?.user.role !== 'ADMIN'
  ) {
    redirect('/unauthorized');
  }

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      userId: true,
    },
  });
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const totalHives = await prisma.hive.count({
    where: { apiaryId: parseInt(apiaryId) },
  });
  const hivesPerPage = 3;
  const totalPages = Math.ceil(totalHives / hivesPerPage);
  const hives = await prisma.hive.findMany({
    where: { apiaryId: parseInt(apiaryId) },
    skip: (currentPage - 1) * hivesPerPage,
    take: hivesPerPage,
    include: {
      observations: true,
    },
  });

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="apiary-detail-header">
          <div>
            <h1 className="title">{apiary?.name}</h1>
            <p className="text-secondary">
              Locatie: {apiary?.latitude.toFixed(6)},{' '}
              {apiary?.longitude.toFixed(6)}
            </p>
          </div>

          <Link
            href={`/apiaries/${apiary?.id}/edit`}
            className="button button--primary"
          >
            + wijzig de bijenstand
          </Link>
        </div>

        {hives?.length ? (
          <>
            <div>
              <h2 className="section__title">Bijenkasten</h2>
              <div className="hives-grid">
                {hives.map(hive => (
                  <div key={hive.id} className="card">
                    <h3 className="card__title">{hive.name}</h3>
                    <p className="text-secondary mb-md">
                      {hive.observations.length} observaties
                    </p>
                    <Link
                      href={`/hives/${hive.id}`}
                      className="button button--outline"
                    >
                      Bekijk details
                    </Link>
                  </div>
                ))}
              </div>
              <Link
                href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
                className="button button--primary"
              >
                + Nieuwe kast toevoegen
              </Link>
            </div>
            <div>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/apiaries/${apiaryId}?page=${
                  currentPage > 1 ? currentPage - 1 : currentPage
                }`}
              >
                Vorige pagina
              </Link>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/apiaries/${apiaryId}?page=${
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
              Voeg uw eerste bijenkast toe aan deze stand
            </p>
            <Link
              href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
              className="button button--primary button--large"
            >
              + Eerste kast toevoegen
            </Link>
          </div>
        )}
      </div>

      {apiary && (
        <DeleteEntityButton
          id={apiary.id}
          type="apiary"
          label="Verwijder bijenstand"
        />
      )}
    </section>
  );
}
