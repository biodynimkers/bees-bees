import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/client";
import { authOptions } from "@/lib/auth-options";
import { Hero, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountObservationsPage(searchParams: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      apiaries: {
        include: {
          hives: {
            include: {
              observations: {
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const allObservations = user.apiaries.flatMap((apiary) =>
    apiary.hives.flatMap((hive) =>
      hive.observations.map((observation) => ({
        ...observation,
        hiveName: hive.type,
        hiveId: hive.id,
        apiaryName: apiary.name,
        apiaryId: apiary.id,
      }))
    )
  );
  // const allObservations = user.apiaries.flatMap(apiary =>
  //   apiary.hives.flatMap(hive =>
  //     hive.observations.map(observation => ({
  //       ...observation,
  //       hiveName: hive.type,
  //       hiveId: hive.id,
  //       apiaryName: apiary.name,
  //       apiaryId: apiary.id,
  //     }))
  //   )
  // );

  const searchParamsResult = await searchParams.searchParams;
  const currentPage = parseInt(searchParamsResult?.page ?? '1', 10);
  const observationsPerPage = 5;
  const totalObservations = await prisma.observation.count({
    where: {
      hive: {
        apiary: {
          userId: userId,
        },
      },
    },
  });
  const totalPages = Math.ceil(totalObservations / observationsPerPage);
  const observations = await prisma.observation.findMany({
    where: {
      hive: {
        apiary: {
          userId: userId,
        },
      },
    },

    include: {
      hive: {
        select: {
          type: true,
          name: true,
          apiary: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return (
    <>
      <Hero
        title="Mijn observaties"
        subtitle="Alle kastcontroles en waarnemingen overzichtelijk"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenwaarnemingen"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          {allObservations.length === 0 ? (
            <div className="section-header">
              <h2>Nog geen observaties</h2>
              <p>Begin met het toevoegen van observaties aan uw kasten</p>
              <div
                className="section-actions"
                style={{ marginTop: "var(--space-8)" }}
              >
                <Button href="/observations/new" variant="primary" size="large">
                  + Nieuwe observatie
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--space-8)",
                }}
              >
                <h2 style={{ margin: 0 }}>Al uw observaties</h2>
                <Button
                  href="/observations/new"
                  variant="primary"
                  size="medium"
                >
                  + Nieuwe observatie
                </Button>
              </div>
              <div className="grid grid-3">
                {allObservations.map((observation) => (
                  <Link
                    key={observation.id}
                    href={`/account/${userId}/apiaries/${observation.apiaryId}/hives/${observation.hiveId}/observations/${observation.id}`}
                  >
                    <Card>
                      <Card.Header>
                        <div className="card-icon">
                          <Eye size={20} strokeWidth={1.5} />
                        </div>
                        <Card.Title>
                          {new Date(observation.createdAt).toLocaleDateString(
                            "nl-BE",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </Card.Title>
                      </Card.Header>
                      <Card.Content>
                        <Card.Description>
                          {observation.hiveName} - {observation.apiaryName}
                        </Card.Description>
                        <Card.Description>
                          {observation.beeCount} bijen
                          {observation.pollenColor &&
                            ` • Stuifmeel: ${observation.pollenColor}`}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </Section>
    </>
    /*
        {observations.length > 0 ? (
          <>
            <div className="observations-list">
              {observations.map(observation => (
                <Link
                  key={observation.id}
                  href={`/observations/${observation.id}`}
                  className="observation-card observation-card--link"
                >
                  <div className="observation-card__header">
                    <h3 className="card__title">
                      {new Date(observation.createdAt).toLocaleDateString(
                        'nl-BE'
                      )}{' '}
                      {new Date(observation.createdAt).toLocaleTimeString(
                        'nl-BE',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </h3>
                    <h2>{observation.hive.name}</h2>
                    <span className="badge">{observation.beeCount} bijen</span>
                  </div>
                  <p className="card__text text-secondary">
                    {observation.hive.type} - {observation.hive.apiary.name}
                  </p>
                  {observation.pollenColor && (
                    <p className="card__text">
                      Stuifmeelkleur: {observation.pollenColor}
                    </p>
                  )}
                </Link>
              ))}
            </div>
            <div>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/observations?page=${
                  currentPage > 1 ? currentPage - 1 : currentPage
                }`}
              >
                Vorige pagina
              </Link>
              <Link
                style={{ backgroundColor: 'red', marginRight: '10px' }}
                href={`/observations?page=${
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
            <h2 className="section__title">Nog geen observaties</h2>
            <p className="text-secondary mb-lg">
              Begin met het toevoegen van observaties aan uw kasten
            </p>
            <Link
              href="/account/apiaries"
              className="button button--primary button--large"
            >
              Naar bijenstanden
            </Link>
          </div>
        )}
      </div>
    </section>
    */
  );
}
