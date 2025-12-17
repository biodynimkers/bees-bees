import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import DeleteEntityButton from '@/components/shared/DeleteEntityButton';

export const dynamic = 'force-dynamic';

export default async function AccountApiaryHivePage({
  params,
  searchParams,
}: {
  params: Promise<{ hiveId: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const { hiveId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    include: {
      apiary: true,
    },
  });

  if (!hive) redirect('/account');
  const apiaryId = hive.apiary.id;
  const searchParamsResult = await searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const totalObservations = await prisma.observation.count({
    where: { hiveId: parseInt(hiveId) },
  });
  const observationsPerPage = 3;
  const totalPages = Math.ceil(totalObservations / observationsPerPage);
  const observations = await prisma.observation.findMany({
    where: { hiveId: parseInt(hiveId) },
    skip: (currentPage - 1) * observationsPerPage,
    take: observationsPerPage,
  });

  return (
    <section className="section section--standard bg-alt">
      <div className="container">
        <div className="hive-header">
          <div>
            <Link href={`/apiaries/${apiaryId}`} className="breadcrumb">
              ← {hive.apiary.name}
            </Link>
            <h1 className="title">
              {hive.name}:{hive.type} - {hive.colonyType}
            </h1>
            <p className="text-secondary">{hive.apiary.longitude}</p>
            <p className="text-secondary">{hive.apiary.latitude}</p>
          </div>
          <ul>
            <li>
              <Link
                href={`/observations/new?hiveId=${hive.id}`}
                className="button button--primary"
              >
                + Nieuwe observatie
              </Link>
            </li>
            <li>
              <Link href={`/hives/${hive.id}/edit`}>Wijzig de kast</Link>
            </li>
          </ul>
        </div>

        <div className="hive-content">
          <div className="map-container">
            <div className="map-placeholder">
              <p className="text-secondary">
                Google Maps met 2km en 7km cirkel rond {hive.apiary.longitude}
                {hive.apiary.latitude}
              </p>
            </div>
            <p className="map-hint">
              <strong>Drachtgebied:</strong> De cirkels tonen het bereik waarin
              bijen voedsel zoeken (2-7km)
            </p>
          </div>

          <div className="observations-section">
            <h2 className="section__title section__title--left">
              Recente observaties
            </h2>
            {observations.length > 0 ? (
              <>
                <div className="observations-list">
                  {observations.map(obs => (
                    <div key={obs.id} className="observation-card">
                      <div className="observation-card__header">
                        <span className="observation-card__date">
                          {new Date(obs.createdAt).toLocaleDateString('nl-BE')}{' '}
                          {new Date(obs.createdAt).toLocaleTimeString('nl-BE', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>{' '}
                        <br />
                        <span className="badge">{obs.beeCount} bijen</span>
                      </div>
                      <p className="text-secondary">
                        Stuifmeelkleur: {obs.pollenColor}
                      </p>
                      {obs.notes && (
                        <p className="observation-card__notes">{obs.notes}</p>
                      )}
                      <Link
                        href={`../observations/${obs.id}/edit?hiveId=${hive.id}`}
                        className="observation-card__edit-link"
                      >
                        Wijzig observatie
                      </Link>
                    </div>
                  ))}
                </div>
                <div>
                  <Link
                    style={{ backgroundColor: 'red', marginRight: '10px' }}
                    href={`/hives/${hiveId}?page=${
                      currentPage > 1 ? currentPage - 1 : currentPage
                    }`}
                  >
                    Vorige pagina
                  </Link>
                  <Link
                    style={{ backgroundColor: 'red', marginRight: '10px' }}
                    href={`/hives/${hiveId}?page=${
                      currentPage < totalPages ? currentPage + 1 : currentPage
                    }`}
                  >
                    Volgende pagina
                  </Link>
                  <Link
                    style={{ backgroundColor: 'lightBlue' }}
                    href={`/hives/${hiveId}?page=${currentPage}`}
                  >
                    {`pagina ${currentPage} van ${totalPages} `}
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-secondary">Nog geen observaties</p>
            )}
          </div>
        </div>
      </div>
      {hive && (
        <DeleteEntityButton id={hive.id} type="hive" label="Verwijder kast" />
      )}
    </section>
  );
}
