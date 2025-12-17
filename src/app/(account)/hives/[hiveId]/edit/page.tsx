import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Hero, Section } from '@/components/layout';
import { HiveForm } from '@/components/features/hive';
import prisma from '@/lib/client';

export default async function EditHivePage({
  params,
}: {
  params: Promise<{ hiveId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { hiveId } = await params;

  // Valideer dat de hive van de gebruiker is
  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    select: {
      id: true,
      apiary: {
        select: { userId: true },
      },
    },
  });

  if (!hive || hive.apiary.userId !== session.user.id) {
    redirect('/hives');
  }

  // Haal alle apiaries op voor dropdown
  const apiaries = await prisma.apiary.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <Hero
        title="Kast bewerken"
        subtitle="Wijzig de gegevens van uw bijenkast"
        image="/assets/hero-new.jpg"
        imageAlt="Kast bewerken"
      />

      <Section variant="default" spacing="large">
        <div className="container container-narrow">
          <HiveForm apiaries={apiaries} initialHive={hiveId} />
        </div>
      </Section>
    </>
  );
}
