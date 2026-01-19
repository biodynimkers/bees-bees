import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import HiveForm from '@/components/forms/HiveForm';

export default async function AccountApiaryNewHivePage({
  searchParams,
}: {
  searchParams: Promise<{ apiaryId?: string; apiaryName?: string }>;
}) {
  const { apiaryId, apiaryName } = await searchParams;

  // If apiaryId is provided, validate it exists
  if (apiaryId) {
    const apiaryExists = await prisma.apiary.count({
      where: { id: parseInt(apiaryId) },
    });
    if (apiaryExists === 0) redirect('/apiaries');
  }

  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Nieuwe behuizing</h1>
          <p className="page-header__subtitle">

          </p>
        </div>
      </section>

      <section className="section ">
        <div className="container container--narrow">
          <HiveForm apiaryId={apiaryId} apiaryName={apiaryName} />
        </div>
      </section>
    </>
  );
}
