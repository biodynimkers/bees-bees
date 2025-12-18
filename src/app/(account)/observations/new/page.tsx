import { redirect } from 'next/navigation';
import prisma from '@/lib/client';
import ObservationForm from '@/components/forms/ObservationForm';

export default async function AccountObservationNewPage({
  searchParams,
}: {
  searchParams: Promise<{ hiveId?: string; hiveName?: string }>;
}) {
  const { hiveId, hiveName } = await searchParams;

  // If hiveId is provided, validate it exists
  if (hiveId) {
    const hiveExists = await prisma.hive.count({
      where: { id: parseInt(hiveId) },
    });
    if (hiveExists === 0) redirect('/hives');
  }

  // Pass hiveId and hiveName (can be undefined) to the form
  return <ObservationForm hiveId={hiveId} hiveName={hiveName} />;
}