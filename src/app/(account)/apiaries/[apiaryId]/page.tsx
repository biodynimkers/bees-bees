import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/client";
import { authOptions } from "@/lib/auth-options";
import { Hero, Section } from "@/components/layout";
import { Button, Card } from "@/components/ui";
import { Box, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AccountApiaryPage({
  params,
}: {
  params: Promise<{ apiaryId: string }>;
}) {
  const session = await getServerSession(authOptions);
  console.log("params received in AccountApiaryPage:", params);
  const { apiaryId } = await params;

  const apiaryOwner = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { userId: true },
  });

  if (!apiaryOwner) {
    redirect("/not-found");
  }

  if (
    apiaryOwner.userId !== session?.user.id &&
    session?.user.role !== "ADMIN"
  ) {
    redirect("/unauthorized");
  }

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: {
      id: true,
      name: true,
      latitude: true,
      longitude: true,
      userId: true,
      hives: {
        include: {
          observations: {
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      },
    },
  });

  return (
    <>
      <Hero
        title={apiary?.name || "Bijenstand"}
        subtitle={`Locatie: ${apiary?.latitude.toFixed(
          6
        )}, ${apiary?.longitude.toFixed(6)}`}
        image="/assets/hero-new.jpg"
        imageAlt="Bijenstand details"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          {apiary?.hives?.length ? (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--space-8)",
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

              <div className="grid grid-3">
                {apiary?.hives.map((hive) => (
                  <Link key={hive.id} href={`/hives/${hive.id}`}>
                    <Card>
                      <Card.Header>
                        <div className="card-icon">
                          <Box size={20} strokeWidth={1.5} />
                        </div>
                        <Card.Title>
                          {hive.type} - {hive.colonyType}
                        </Card.Title>
                      </Card.Header>
                      <Card.Content>
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
                style={{ marginTop: "var(--space-8)" }}
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
      </Section>
    </>
  );
}
