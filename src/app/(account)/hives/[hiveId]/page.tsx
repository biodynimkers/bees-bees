import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { Hero, Section } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { Box, Eye, MapPin } from 'lucide-react';

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
      observations: {
        orderBy: { createdAt: 'desc' },
      },
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
    <>
      <Hero
        title={hive.name || `${hive.type} - ${hive.colonyType}`}
        subtitle={`Bijenstand: ${hive.apiary.name}`}
        image="/assets/hero-new.jpg"
        imageAlt="Bijenkast details"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <Link
              href={`/apiaries/${hive.apiary.id}`}
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              ← Terug naar {hive.apiary.name}
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

          <div
            className="grid grid-2"
            style={{ gap: 'var(--space-8)', alignItems: 'start' }}
          >
            {/* Linker kolom: Kast informatie */}
            <div>
              <Card>
                <Card.Header>
                  <div className="card-icon">
                    <Box size={20} strokeWidth={1.5} />
                  </div>
                  <Card.Title>Kast details</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Card.Description>
                    <strong>Naam:</strong> {hive.name || 'Geen naam'}
                  </Card.Description>
                  <Card.Description>
                    <strong>Type kast:</strong> {hive.type}
                  </Card.Description>
                  <Card.Description>
                    <strong>Type volk:</strong> {hive.colonyType}
                  </Card.Description>
                  <Card.Description>
                    <strong>Bijenstand:</strong> {hive.apiary.name}
                  </Card.Description>
                  <Card.Description>
                    <strong>Totaal observaties:</strong>{' '}
                    {hive.observations.length}
                  </Card.Description>
                </Card.Content>
              </Card>
            </div>

            {/* Rechter kolom: Observaties */}
            <div>
              {hive.observations.length > 0 ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <h2 style={{ margin: 0 }}>Recente observaties</h2>
                    <Button
                      href={`/observations/new?hiveId=${hive.id}`}
                      variant="primary"
                      size="medium"
                    >
                      + Nieuwe observatie
                    </Button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-4)',
                    }}
                  >
                    {hive.observations.map(obs => (
                      <Card key={obs.id}>
                        <Card.Header>
                          <div className="card-icon">
                            <Eye size={20} strokeWidth={1.5} />
                          </div>
                          <Card.Title>
                            {new Date(obs.createdAt).toLocaleDateString(
                              'nl-BE',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}{' '}
                            om{' '}
                            {new Date(obs.createdAt).toLocaleTimeString(
                              'nl-BE',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </Card.Title>
                        </Card.Header>
                        <Card.Content>
                          <Card.Description>
                            <strong>Aantal bijen:</strong> {obs.beeCount}
                          </Card.Description>
                          <Card.Description>
                            <strong>Stuifmeelkleur:</strong> {obs.pollenColor}
                          </Card.Description>
                          {obs.notes && (
                            <Card.Description>
                              <strong>Notities:</strong> {obs.notes}
                            </Card.Description>
                          )}
                        </Card.Content>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <div className="section-header">
                  <h2>Nog geen observaties</h2>
                  <p>Voeg uw eerste observatie toe aan deze kast</p>
                  <div
                    className="section-actions"
                    style={{ marginTop: 'var(--space-8)' }}
                  >
                    <Button
                      href={`/observations/new?hiveId=${hive.id}`}
                      variant="primary"
                      size="large"
                    >
                      + Eerste observatie toevoegen
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-8)' }}>
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

          {hive && (
            <DeleteEntityButton
              id={hive.id}
              type="hive"
              label="Verwijder kast"
            />
          )}
        </div>
      </Section>
    </>
    //       <div className="observations-section">
    //         <h2 className="section__title section__title--left">
    //           Recente observaties
    //         </h2>
    //         {observations.length > 0 ? (
    //           <>
    //             <div className="observations-list">
    //               {observations.map(obs => (
    //                 <div key={obs.id} className="observation-card">
    //                   <div className="observation-card__header">
    //                     <span className="observation-card__date">
    //                       <Link href={`../observations/${obs.id}`}>
    //                         {new Date(obs.createdAt).toLocaleDateString(
    //                           'nl-BE'
    //                         )}{' '}
    //                         {new Date(obs.createdAt).toLocaleTimeString(
    //                           'nl-BE',
    //                           {
    //                             hour: '2-digit',
    //                             minute: '2-digit',
    //                           }
    //                         )}
    //                       </Link>
    //                     </span>{' '}
    //                     <br />
    //                     <span className="badge">{obs.beeCount} bijen</span>
    //                   </div>
    //                   <p className="text-secondary">
    //                     Stuifmeelkleur: {obs.pollenColor}
    //                   </p>
    //                   {obs.notes && (
    //                     <p className="observation-card__notes">{obs.notes}</p>
    //                   )}
    //                   <Link
    //                     href={`../observations/${obs.id}/edit?hiveId=${hive.id}`}
    //                     className="observation-card__edit-link"
    //                   >
    //                     Wijzig observatie
    //                   </Link>
    //                 </div>
    //               ))}
    //             </div>
    //             <div>
    //               <Link
    //                 style={{ backgroundColor: 'red', marginRight: '10px' }}
    //                 href={`/hives/${hiveId}?page=${
    //                   currentPage > 1 ? currentPage - 1 : currentPage
    //                 }`}
    //               >
    //                 Vorige pagina
    //               </Link>
    //               <Link
    //                 style={{ backgroundColor: 'red', marginRight: '10px' }}
    //                 href={`/hives/${hiveId}?page=${
    //                   currentPage < totalPages ? currentPage + 1 : currentPage
    //                 }`}
    //               >
    //                 Volgende pagina
    //               </Link>
    //               <Link
    //                 style={{ backgroundColor: 'lightBlue' }}
    //                 href={`/hives/${hiveId}?page=${currentPage}`}
    //               >
    //                 {`pagina ${currentPage} van ${totalPages} `}
    //               </Link>
    //             </div>
    //           </>
    //         ) : (
    //           <p className="text-secondary">Nog geen observaties</p>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   {hive && (
    //     <DeleteEntityButton id={hive.id} type="hive" label="Verwijder kast" />
    //   )}
    // </section>
  );
}
