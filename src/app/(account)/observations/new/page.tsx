import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/client';
import ObservationForm from '@/components/forms/ObservationForm';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default async function AccountObservationNewPage({
  searchParams,
}: {
  searchParams: Promise<{ hiveId?: string; hiveName?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { hiveId, hiveName } = await searchParams;

  // If hiveId is provided, validate it exists
  if (hiveId) {
    const hiveExists = await prisma.hive.count({
      where: { id: parseInt(hiveId) },
    });
    if (hiveExists === 0) redirect('/hives');
  }

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <h1 className="platform-hero__title">
              Nieuwe waarneming toevoegen
            </h1>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Waarnemingen', href: '/observations' },
          { label: 'Nieuwe waarneming' },
        ]}
      />

      <section className="home-features">
        <div className="container container--narrow">
          <ObservationForm hiveId={hiveId} hiveName={hiveName} />
        </div>
      </section>
    </div>
  );
}
