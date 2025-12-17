import ObservationForm from '@/components/forms/ObservationForm';

export default async function EditObservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ observationId: string }>;
  searchParams: Promise<{ hiveId?: string }>;
}) {
  const { observationId } = await params;
  const { hiveId } = await searchParams;

  if (!hiveId) {
    throw new Error('hiveId is required');
  }
  return (
    <div>
      <h1 className="title" style={{ marginTop: '6rem' }}>
        Observatie Bewerken
      </h1>

      <ObservationForm initialObservation={observationId} hiveId={hiveId} />
    </div>
  );
}
