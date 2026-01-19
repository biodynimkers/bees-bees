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
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <h1 className="platform-hero__title">
              Nieuwe behuizing
            </h1>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="container container--narrow">
          <HiveForm apiaryId={apiaryId} apiaryName={apiaryName} />
        </div>
      </section>
    </div>
  );
}
