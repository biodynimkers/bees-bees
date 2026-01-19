import ApiaryForm from '@/components/forms/ApiaryForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

export default async function AccountNewApiaryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');
  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <h1 className="platform-hero__title">
              Nieuwe bijenstand
            </h1>
          </div>
        </div>
      </section>

      <Breadcrumbs
        items={[
          { label: 'Account', href: '/account' },
          { label: 'Bijenstanden', href: '/apiaries' },
          { label: 'Nieuwe bijenstand' },
        ]}
      />

      <section className="home-features">
        <div className="container container--narrow">
          <ApiaryForm />
        </div>
      </section>
    </div>
  );
}
