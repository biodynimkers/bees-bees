import React, { Suspense } from 'react';
import Link from 'next/link';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

// Server Component that receives searchParams as props
interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

function TokenErrorState() {
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Ongeldige reset link</h1>
          <p className="page-header__subtitle">
            Deze reset link is ongeldig of verlopen
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div className="card">
            <div className="card__content text-center">
              <div className="status-icon status-icon--error">✕</div>
              <h2 className="heading-secondary margin-bottom-small">
                Reset link ongeldig
              </h2>
              <p className="card__description margin-bottom-large">
                Deze wachtwoord reset link is ongeldig, verlopen of al gebruikt.
                Probeer opnieuw een reset aan te vragen.
              </p>
              <div className="flex justify-center gap-sm flex-wrap">
                <Link href="/forgot-password" className="btn btn--primary">
                  Nieuwe reset aanvragen
                </Link>
                <Link href="/auth/login" className="btn btn--secondary">
                  Terug naar inloggen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function LoadingState() {
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Laden...</h1>
          <p className="page-header__subtitle">Een ogenblik geduld</p>
        </div>
      </section>
      <section className="section">
        <div className="container container--narrow">
          <div className="card">
            <div className="card__content text-center">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  // Show error if no token
  if (!token) {
    return <TokenErrorState />;
  }
  // Suspense rond resetPasswordForm is nodig omdat useRouter() (client hook) faalt tijdens server-side prerendering omdat die alleen werkt in de browser. Door <Suspense> te gebruiken, kan Next.js de client component asynchroon laden binnen een server component. Tijdens het laden toont hij de LoadingState.
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Nieuw wachtwoord</h1>
          <p className="page-header__subtitle">Voer uw nieuwe wachtwoord in</p>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <Suspense fallback={<LoadingState />}>
            <ResetPasswordForm token={token} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
