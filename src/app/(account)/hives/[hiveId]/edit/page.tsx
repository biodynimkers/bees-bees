import HiveForm from '@/components/forms/HiveForm';
export default async function EditHivePage({
  params,
}: {
  params: Promise<{ hiveId: string }>;
}) {
  const { hiveId } = await params;
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Behuizing aanpassen</h1>
          <p className="page-header__subtitle">Bewerk type of volk</p>
        </div>
      </section>

      <section className="section ">
        <div className="container container--narrow">
          <HiveForm initialHive={hiveId} />
        </div>
      </section>
    </>
  );
}
