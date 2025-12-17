import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Hero, Section } from '@/components/layout';
import { ObservationForm } from '@/components/features/observation';
import prisma from '@/lib/client';

export default async function EditObservationPage({
  params,
}: {
  params: Promise<{ observationId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { observationId } = await params;

  // Haal de observatie op en valideer ownership
  const observation = await prisma.observation.findUnique({
    where: { id: parseInt(observationId) },
    include: {
      hive: {
        select: {
          id: true,
          type: true,
          colonyType: true,
          apiary: {
            select: { userId: true }
          }
        }
      }
    }
  });

  if (!observation || observation.hive.apiary.userId !== session.user.id) {
    redirect('/observations');
  }

  return (
    <>
      <Hero
        title="Observatie bewerken"
        subtitle="Wijzig uw kastcontrole gegevens"
        image="/assets/hero-new.jpg"
        imageAlt="Observatie bewerken"
      />

      <Section variant="default" spacing="large">
        <div className="container container-narrow">
          <ObservationForm
            hiveId={observation.hive.id.toString()}
            hiveName={`${observation.hive.type} - ${observation.hive.colonyType}`}
            initialObservation={observationId}
          />
        </div>
      </Section>
    </>
  );
}
    <div>
      <h1 className="title" style={{ marginTop: '6rem' }}>
        Observatie Bewerken
      </h1>

      <ObservationForm initialObservation={observationId} hiveId={hiveId} />
    </div>
  );
}
