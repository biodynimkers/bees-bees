import ObservationForm from '@/components/forms/ObservationForm';
import prisma from '@/lib/client';
import { redirect } from 'next/navigation';

export default async function EditObservationPage({
  params,
}: {
  params: Promise<{ observationId: string }>;
}) {
  const { observationId } = await params;

  const observation = await prisma.observation.findUnique({
    where: { id: parseInt(observationId) },
    include: { hive: true },
  });

  if (!observation) {
    redirect('/observations');
  }

  return (
    <div>
      <h1 className="title" style={{ marginTop: '6rem' }}>
        Observatie Bewerken
      </h1>

      <ObservationForm 
        initialObservation={observationId} 
        hiveId={observation.hiveId.toString()} 
      />
    </div>
  );
}