import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import NewHiveForm from '@/components/forms/NewHiveForm';

export default async function AccountApiaryNewHivePage({
  params,
}: {
  params: Promise<{ userId: string; apiaryId: string }>;
}) {
  const { userId, apiaryId } = await params;

  const apiary = await prisma.apiary.findUnique({
    where: { id: parseInt(apiaryId) },
    select: { name: true },
  });

  if (!apiary) redirect('/account/apiaries');

  return (
    <NewHiveForm userId={userId} apiaryId={apiaryId} apiaryName={apiary.name} />
  );
}
