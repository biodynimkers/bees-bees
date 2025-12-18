import ObservationForm from '@/components/forms/ObservationForm';
import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export default async function EditObservationPage({
  params,
}: {
  params: Promise<{ observationId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { observationId } = await params;

  const observation = await prisma.observation.findUnique({
    where: { id: parseInt(observationId) },
    include: { hive: true },
  });

  if (!observation) {
    redirect('/observations');
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Observatie bewerken</h1>
        </div>
      </section>

      <section className="section section--default">
        <div className="container container--narrow">
          <ObservationForm 
            initialObservation={observationId} 
            hiveId={observation.hiveId.toString()} 
          />
        </div>
      </section>
    </>
  );
}