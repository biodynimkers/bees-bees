import ApiaryForm from '@/components/forms/ApiaryForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

export default async function AccountNewApiaryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="page-header__title">Nieuwe bijenstand</h1>
        </div>
      </section>

      <section className="section section--default">
        <div className="container container--narrow">
          <ApiaryForm />
        </div>
      </section>
    </>
  );
}
