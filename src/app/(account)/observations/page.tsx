import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/client";
import { authOptions } from "@/lib/auth-options";
import { Hero, Section } from "@/components/layout";

export const dynamic = "force-dynamic";

export default async function AccountObservationsPage() {
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

  return (
    <>
      <Hero
        title="Mijn observaties"
        subtitle="Alle kastcontroles en waarnemingen overzichtelijk"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenwaarnemingen"
      />

      <Section variant="alt" spacing="large">
        <div className="container">
          <div className="page-header">
            <h1 className="title">Mijn observaties</h1>
          </div>

          {allObservations.length > 0 ? (
            <div className="observations-list">
              {allObservations.map((observation) => (
                <Link
                  key={observation.id}
                  href={`/account/${userId}/apiaries/${observation.apiaryId}/hives/${observation.hiveId}/observations/${observation.id}`}
                  className="observation-card observation-card--link"
                >
                  <div className="observation-card__header">
                    <h3 className="card__title">
                      {new Date(observation.createdAt).toLocaleDateString(
                        "nl-BE"
                      )}
                    </h3>
                    <span className="badge">{observation.beeCount} bijen</span>
                  </div>
                  <p className="card__text text-secondary">
                    {observation.hiveName} - {observation.apiaryName}
                  </p>
                  {observation.pollenColor && (
                    <p className="card__text">
                      Stuifmeelkleur: {observation.pollenColor}
                    </p>
                  )}
                </Link>
              ))}
            </div>
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
                Bekijk mijn standen
              </Link>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
