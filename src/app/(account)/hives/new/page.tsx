import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/client";
import { Hero, Section } from "@/components/layout";
import { HiveForm } from "@/components/features/hive";

export default async function NewHivePage({
  searchParams,
}: {
  searchParams: Promise<{ apiaryId?: string; apiaryName?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const { apiaryId, apiaryName } = await searchParams;

  if (!apiaryId) {
    redirect("/apiaries");
  }

  const apiaryExists = await prisma.apiary.count({
    where: { id: parseInt(apiaryId) },
  });

  if (apiaryExists === 0) redirect("/apiaries");

  return (
    <>
      <Hero
        title="Nieuwe kast"
        subtitle={
          apiaryName
            ? `Voor bijenstand: ${apiaryName}`
            : "Registreer een nieuwe bijenkast"
        }
        image="/assets/hero-new.jpg"
        imageAlt="Bijenkast"
      />

      <Section variant="default" spacing="large">
        <div className="container container-narrow">
          <HiveForm apiaryId={apiaryId} apiaryName={apiaryName} />
        </div>
      </Section>
    </>
  );
}
