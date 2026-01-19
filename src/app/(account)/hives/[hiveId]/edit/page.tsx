import HiveForm from '@/components/forms/HiveForm';
import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default async function EditHivePage({
  params,
}: {
  params: Promise<{ hiveId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { hiveId } = await params;
  
  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
  });

  if (!hive) {
    redirect('/hives');
  }

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <h1 className="platform-hero__title">Behuizing bewerken</h1>
            <p className="platform-hero__subtitle">Bewerk type of volk</p>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Behuizingen', href: '/hives' },
          { label: hive.name, href: `/hives/${hiveId}` },
          { label: 'Bewerken' },
        ]}
      />

      <section className="home-features">
        <div className="container container--narrow">
          <HiveForm initialHive={hiveId} />
        </div>
      </section>
    </div>
  );
}
