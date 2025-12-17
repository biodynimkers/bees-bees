import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Hero, Section } from '@/components/layout';
import { ApiaryForm } from '@/components/features/apiary';
import prisma from '@/lib/client';

export default async function EditApiaryPage({
  params,
}: {
  params: Promise<{ apiaryId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { apiaryId } = await params;

  // Valideer dat de apiary van de gebruiker is
  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { id: true, userId: true },
  });

  if (!apiary || apiary.userId !== session.user.id) {
    redirect('/apiaries');
  }

  return (
    <>
      <Hero
        title="Bijenstand bewerken"
        subtitle="Wijzig de naam en locatie van uw bijenstand"
        image="/assets/hero-new.jpg"
        imageAlt="Bijenstand bewerken"
      />

      <Section variant="default" spacing="large">
        <div className="container container-narrow">
          <ApiaryForm initialApiary={apiaryId} />
        </div>
      </Section>
    </>
  );
}
