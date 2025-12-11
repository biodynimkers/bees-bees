import ApiaryForm from '@/components/forms/ApiaryForm';
import Link from 'next/link';
export default async function EditApiaryPage({
  params,
}: {
  params: Promise<{ apiaryId: string }>;
}) {
  const { apiaryId } = await params;
  return (
    <div style={{ marginTop: '6rem' }}>
      <h1>Naam of locatie aanpassen</h1>
      <ApiaryForm initialApiary={apiaryId} />
      <Link href="/apiaries">Terug naar bijenstanden</Link>
    </div>
  );
}
