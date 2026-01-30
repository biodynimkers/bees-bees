import ObservationForm from '@/components/forms/ObservationForm';
import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default async function EditObservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ observationId: string }>;
  searchParams?: Promise<{ returnUrl?: string }>;
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
  const searchParamsResult = await searchParams;
  const returnUrl = searchParamsResult?.returnUrl ?? '';

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <h1 className="platform-hero__title">Waarneming bewerken</h1>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          returnUrl
            ? { label: 'Behuizing', href: returnUrl }
            : { label: 'Waarnemingen', href: '/observations' },
          { label: 'Bewerken' },
        ]}
      />

      <section className="home-features">
        <div className="container container--narrow">
          <ObservationForm
            initialObservation={observationId}
            hiveId={observation.hiveId.toString()}
          />
        </div>
      </section>
    </div>
  );
}
