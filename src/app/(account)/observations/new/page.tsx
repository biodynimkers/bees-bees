import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/client";
import { Hero, Section } from "@/components/layout";
import { ObservationForm } from "@/components/features/observation";
import Link from 'next/link';

export const dynamic = "force-dynamic";

export default async function AccountApiaryHiveObservationPage({
  searchParams,
}: {
  searchParams: Promise<{ hiveId?: string }>;
}) {
  const { hiveId } = await searchParams;

  if (!hiveId) {
    throw new Error('hiveId is required');
  }

export default async function NewObservationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  // Haal alle hives op van de gebruiker
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      apiaries: {
        include: {
          hives: {
            select: {
              id: true,
              name: true,
              type: true,
              colonyType: true,
            },
          },
        },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const allHives = user.apiaries.flatMap((apiary) =>
    apiary.hives.map((hive) => ({
      id: hive.id,
      name: hive.name || `${hive.type} - ${hive.colonyType}`,
      displayName: `${hive.name || hive.type} (${apiary.name})`,
    }))
  );

  // Als er geen hives zijn, redirect naar hives page
  if (allHives.length === 0) {
    redirect("/hives");
  }

  return (
    <>
      <Hero
        title="Nieuwe observatie"
        subtitle="Registreer een nieuwe kastcontrole"
        image="/assets/hero-new.jpg"
        imageAlt="Nieuwe observatie"
      />

      <Section variant="default" spacing="large">
        <div className="container container-narrow">
          <ObservationForm hives={allHives} />
           <ObservationForm
        hiveId={hiveId}
        hiveName={`${hive.type} - ${hive.colonyType}`}
      />
        </div>
      </Section>
    </>
  );
}
