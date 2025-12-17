import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/client';
import { Hero, Section } from '@/components/layout';
import { HiveForm } from '@/components/features/hive';

export default async function NewHivePage({
  searchParams,
}: {
  searchParams: Promise<{ apiaryId?: string; apiaryName?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { apiaryId, apiaryName } = await searchParams;

  // Haal alle bijenstandplaatsen op voor de dropdown
  const apiaries = await prisma.apiary.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });

  // Als er geen bijenstandplaatsen zijn EN geen apiaryId, redirect naar apiaries page
  if (!apiaryId && apiaries.length === 0) {
    redirect('/apiaries');
  }

  // Valideer dat de apiaryId van de gebruiker is (security check)
  if (apiaryId && !apiaries.some(apiary => apiary.id === parseInt(apiaryId))) {
    redirect('/apiaries');
  }

  return (
    <>
      <Hero
        title="Nieuwe kast"
        subtitle="Registreer een nieuwe bijenkast"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenkast"
      />

      <Section variant="default" spacing="large">
        <div className="container container-narrow">
          <HiveForm
            apiaries={apiaries}
            apiaryId={apiaryId}
            apiaryName={apiaryName}
          />
        </div>
      </Section>
    </>
  );
}
