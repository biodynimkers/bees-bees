import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import NewObservationForm from '@/components/forms/NewObservationForm';

export default async function AccountApiaryHiveNewObservationPage({
  params,
}: {
  params: Promise<{ userId: string; apiaryId: string; hiveId: string }>;
}) {
  const { userId, apiaryId, hiveId } = await params;

  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    select: { type: true, colonyType: true },
  });

  if (!hive) redirect(`/account/${userId}apiaries`);

  return (
    <NewObservationForm
      userId={userId}
      apiaryId={apiaryId}
      hiveId={hiveId}
      hiveName={`${hive.type} - ${hive.colonyType}`}
    />
  );
}
