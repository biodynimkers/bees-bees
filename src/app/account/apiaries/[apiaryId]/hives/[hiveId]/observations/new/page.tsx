import { redirect } from "next/navigation";
import prisma from "@/lib/client";
import NewObservationForm from "@/components/forms/NewObservationForm";

export default async function AccountApiaryHiveNewObservationPage({
  params,
}: {
  params: Promise<{ apiaryId: string; hiveId: string }>;
}) {
  const { apiaryId, hiveId } = await params;

  const hive = await prisma.hive.findUnique({
    where: { id: parseInt(hiveId) },
    select: { type: true, colonyType: true },
  });

  if (!hive) redirect("/account/apiaries");

  return (
    <NewObservationForm
      apiaryId={apiaryId}
      hiveId={hiveId}
      hiveName={`${hive.type} - ${hive.colonyType}`}
    />
  );
}
