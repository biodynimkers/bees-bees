import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { Hero, Section } from "@/components/layout";
import { ApiaryForm } from "@/components/features/apiary";

export default async function NewApiaryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  return (
    <>
      <Hero
        title="Nieuwe bijenstand"
        subtitle="Registreer een nieuwe locatie voor uw bijenkasten"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenstand"
      />

      <Section variant="default" spacing="large">
        <div className="container container-narrow">
          <ApiaryForm />
        </div>
      </Section>
    </>
  );
}
