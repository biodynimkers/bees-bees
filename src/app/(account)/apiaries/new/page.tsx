import NewApiaryForm from '@/components/forms/NewApiaryForm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

export default async function AccountNewApiaryPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/auth/login');
  return (
    <section className="section section--standard bg-alt">
      <div className="container container--narrow">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="title">Nieuwe bijenstand toevoegen</h1>
            <p className="subtitle subtitle--centered">
              Registreer een nieuwe locatie voor uw bijenkasten
            </p>
          </div>

          <NewApiaryForm />
        </div>
      </div>
    </section>
  );
}
