import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import { authOptions } from "@/lib/auth-options";
import { Hero, Section } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ApiaryList } from "@/components/features/apiary";

export const dynamic = "force-dynamic";

export default async function ApiariesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
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

  if (!user) redirect("/auth/login");

  const apiariesData = user.apiaries.map((apiary) => ({
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
                style={{ marginTop: "var(--space-8)" }}
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "var(--space-8)",
                }}
              >
                <h2 style={{ margin: 0 }}>Al uw bijenstanden</h2>
                <Button href="/apiaries/new" variant="primary" size="medium">
                  + Nieuwe bijenstand
                </Button>
              </div>
              <ApiaryList apiaries={apiariesData} />
            </>
          )}
        </div>
      </Section>
    </>
  );
}
