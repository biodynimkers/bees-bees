import ApiaryForm from '@/components/forms/ApiaryForm';
import Link from 'next/link';
import prisma from '@/lib/client';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default async function EditApiaryPage({
  params,
}: {
  params: Promise<{ apiaryId: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');

  const { apiaryId } = await params;
  
  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
  });

  if (!apiary) {
    redirect('/apiaries');
  }

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <h1 className="platform-hero__title">Bijenstand bewerken</h1>
            <p className="platform-hero__subtitle">Bewerk naam of locatie</p>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Bijenstanden', href: '/apiaries' },
          { label: apiary.name, href: `/apiaries/${apiaryId}` },
          { label: 'Bewerken' },
        ]}
      />

      <section className="home-features">
        <div className="container container--narrow">
          <ApiaryForm initialApiary={apiaryId} />
        </div>
      </section>
    </div>
  );
}
