import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import NewObservationForm from '@/components/forms/NewObservationForm';

export default async function AccountApiaryHiveNewObservationPage({
  searchParams,
}: {
  searchParams: { hiveId?: string };
}) {
  const hiveId = searchParams.hiveId;

  if (!hiveId) {
    throw new Error('hiveId is required');
  }

  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    select: { type: true, colonyType: true },
  });

  if (!hive) redirect(`/apiaries`);

  return (
    <NewObservationForm
      hiveId={hiveId}
      hiveName={`${hive.type} - ${hive.colonyType}`}
    />
  );
}
