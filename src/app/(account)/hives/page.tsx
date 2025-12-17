import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import { authOptions } from "@/lib/auth-options";
import { Hero, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { HiveList } from "@/components/features/hive";

export const dynamic = "force-dynamic";

export default async function AccountHivesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      apiaries: {
        include: {
          hives: {
            include: {
              _count: {
                select: { observations: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const hivesData = user.apiaries.flatMap((apiary) =>
    apiary.hives.map((hive) => ({
      id: hive.id,
      type: hive.type,
      colonyType: hive.colonyType,
      apiaryName: apiary.name,
      observationCount: hive._count.observations,
    }))
  );

  return (
    <>
      <Hero
        title="Mijn kasten"
        subtitle="Beheer al je bijenkasten op één plek"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenkasten"
      />

      <Section variant="default" spacing="large">
        <div className="container">
          {hivesData.length === 0 ? (
            <div className="section-header">
              <h2>Nog geen kasten</h2>
              <p>Begin met het toevoegen van uw eerste bijenkast</p>
              <div
                className="section-actions"
                style={{ marginTop: "var(--space-8)" }}
              >
                <Button href="/hives/new" variant="primary" size="large">
                  + Nieuwe kast
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
                <h2 style={{ margin: 0 }}>Al uw kasten</h2>
                <Button href="/hives/new" variant="primary" size="medium">
                  + Nieuwe kast
                </Button>
              </div>
              <HiveList hives={hivesData} />
            </>
          )}
        </div>
      </Section>
    </>
  );
}
