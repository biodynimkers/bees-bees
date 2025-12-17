import Link from 'next/link';
import HiveForm from '@/components/forms/HiveForm';
export default async function EditHivePage({
  params,
}: {
  params: Promise<{ hiveId: string }>;
}) {
  const { hiveId } = await params;
  return (
    <div>
      <Link href="/hives">Terug naar kasten</Link>
      <HiveForm initialHive={hiveId} />
    </div>
  );
}
