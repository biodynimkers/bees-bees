import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/client';
import { authOptions } from '@/lib/auth-options';
import { Hero, Section } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { Box, MapPin } from 'lucide-react';
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
    <>
      <Hero
        title={apiary?.name || 'Bijenstand'}
        subtitle={`Locatie: ${apiary?.latitude.toFixed(
          6
        )}, ${apiary?.longitude.toFixed(6)}`}
        image="/assets/hero-new.jpg"
        imageAlt="Bijenstand details"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          <div
            className="grid grid-2"
            style={{ gap: 'var(--space-8)', alignItems: 'start' }}
          >
            {/* Linker kolom: Locatie informatie en kaart */}
            {/* <div>
              <Card>
                <Card.Header>
                  <div className="card-icon">
                    <MapPin size={20} strokeWidth={1.5} />
                  </div>
                  <Card.Title>Locatie</Card.Title>
                </Card.Header>
                <Card.Content>
                  <Card.Description>
                    <strong>Coördinaten:</strong>
                    <br />
                    Breedtegraad: {apiary?.latitude.toFixed(6)}
                    <br />
                    Lengtegraad: {apiary?.longitude.toFixed(6)}
                  </Card.Description>
                  <div
                    style={{
                      marginTop: "var(--space-4)",
                      width: "100%",
                      height: "300px",
                      backgroundColor: "var(--color-bg-secondary)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <p style={{ color: "var(--color-text-secondary)" }}>
                      Kaart wordt hier getoond
                      <br />
                      <small>
                        Google Maps met 2km en 7km cirkel rond{" "}
                        {apiary?.latitude.toFixed(2)},{" "}
                        {apiary?.longitude.toFixed(2)}
                      </small>
                    </p>
                  </div>
                  <Card.Description style={{ marginTop: "var(--space-4)" }}>
                    <strong>Drachtgebied:</strong> De cirkels tonen het bereik
                    waarin bijen voedsel zoeken (2-7km)
                  </Card.Description>
                </Card.Content>
              </Card>
            </div> */}

            {/* Rechter kolom: Kasten */}
            <div>
              {hives?.length ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 'var(--space-4)',
                    }}
                  >
                    <h2 style={{ margin: 0 }}>Kasten op deze stand</h2>
                    <Button
                      href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
                      variant="primary"
                      size="medium"
                    >
                      + Nieuwe kast
                    </Button>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-4)',
                    }}
                  >
                    {hives.map(hive => (
                      <Link key={hive.id} href={`/hives/${hive.id}`}>
                        <Card>
                          <Card.Header>
                            <div className="card-icon">
                              <Box size={20} strokeWidth={1.5} />
                            </div>
                            <Card.Title>
                              {hive.name || `${hive.type} - ${hive.colonyType}`}
                            </Card.Title>
                          </Card.Header>
                          <Card.Content>
                            <Card.Description>
                              {hive.type} • {hive.colonyType}
                            </Card.Description>
                            <Card.Description>
                              ({hive.observations.length}) Observaties
                            </Card.Description>
                          </Card.Content>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <div className="section-header">
                  <h2>Nog geen kasten</h2>
                  <p>Voeg uw eerste bijenkast toe aan deze stand</p>
                  <div
                    className="section-actions"
                    style={{ marginTop: 'var(--space-8)' }}
                  >
                    <Button
                      href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
                      variant="primary"
                      size="large"
                    >
                      + Eerste kast toevoegen
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {apiary && (
          <DeleteEntityButton
            id={apiary.id}
            type="apiary"
            label="Verwijder bijenstand"
          />
        )}
      </Section>
    </>

    // <section className="section section--standard bg-alt">
    //   <div className="container">
    //     <div className="apiary-detail-header">
    //       <div>
    //         <h1 className="title">{apiary?.name}</h1>
    //         <p className="text-secondary">
    //           Locatie: {apiary?.latitude.toFixed(6)},{' '}
    //           {apiary?.longitude.toFixed(6)}
    //         </p>
    //       </div>

    //       <Link
    //         href={`/apiaries/${apiary?.id}/edit`}
    //         className="button button--primary"
    //       >
    //         + wijzig de bijenstand
    //       </Link>
    //     </div>

    //     {hives?.length ? (
    //       <>
    //         <div>
    //           <h2 className="section__title">Bijenkasten</h2>
    //           <div className="hives-grid">
    //             {hives.map(hive => (
    //               <div key={hive.id} className="card">
    //                 <h3 className="card__title">{hive.name}</h3>
    //                 <p className="text-secondary mb-md">
    //                   {hive.observations.length} observaties
    //                 </p>
    //                 <Link
    //                   href={`/hives/${hive.id}`}
    //                   className="button button--outline"
    //                 >
    //                   Bekijk details
    //                 </Link>
    //               </div>
    //             ))}
    //           </div>
    //           <Link
    //             href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
    //             className="button button--primary"
    //           >
    //             + Nieuwe kast toevoegen
    //           </Link>
    //         </div>
    //         <div>
    //           <Link
    //             style={{ backgroundColor: 'red', marginRight: '10px' }}
    //             href={`/apiaries/${apiaryId}?page=${
    //               currentPage > 1 ? currentPage - 1 : currentPage
    //             }`}
    //           >
    //             Vorige pagina
    //           </Link>
    //           <Link
    //             style={{ backgroundColor: 'red', marginRight: '10px' }}
    //             href={`/apiaries/${apiaryId}?page=${
    //               currentPage < totalPages ? currentPage + 1 : currentPage
    //             }`}
    //           >
    //             Volgende pagina
    //           </Link>
    //           <div
    //             style={{
    //               backgroundColor: 'lightBlue',
    //               display: 'inline-block',
    //             }}
    //           >
    //             {`pagina ${currentPage} van ${totalPages} `}
    //           </div>
    //         </div>
    //       </>
    //     ) : (
    //       <div className="empty-state">
    //         <h2 className="section__title">Nog geen kasten</h2>
    //         <p className="text-secondary mb-lg">
    //           Voeg uw eerste bijenkast toe aan deze stand
    //         </p>
    //         <Link
    //           href={`/hives/new?apiaryId=${apiary?.id}&apiaryName=${apiary?.name}`}
    //           className="button button--primary button--large"
    //         >
    //           + Eerste kast toevoegen
    //         </Link>
    //       </div>
    //     )}
    //   </div>

    //   )}
    // </section>
  );
}
