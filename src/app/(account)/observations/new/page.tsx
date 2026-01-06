import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/client';
import ObservationForm from '@/components/forms/ObservationForm';

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
    <>
      <section className="page-header">
        <div className="container">
          <h1 className="page-header__title">Nieuwe observatie</h1>
          <p className="page-header__subtitle">
            Registreer een nieuwe observatie bij een kast.
          </p>
        </div>
      </section>

      <section className="section section--default">
        <div className="container container--narrow">
          <ObservationForm hiveId={hiveId} hiveName={hiveName} />
        </div>
      </section>
    </>
  );
}
