import ApiaryForm from '@/components/forms/ApiaryForm';
import Link from 'next/link';
export default async function EditApiaryPage({
  params,
}: {
  params: Promise<{ apiaryId: string }>;
}) {
  const { apiaryId } = await params;
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="page-header__title">Bijenstand aanpassen</h1>
          <p className="page-header__subtitle">Wijzig naam of locatie</p>
        </div>
      </section>

      <section className="section ">
        <div className="container container--narrow">
          <ApiaryForm initialApiary={apiaryId} />
        </div>
      </section>
    </>
  );
}
