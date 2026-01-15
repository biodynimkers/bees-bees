'use client';
import RemoveButton from '@/components/ui/RemoveButton';
import { useRouter } from 'next/navigation';
import { deleteEntity } from '@/app/actions/deleteEntity';
type DeleteEntityButtonProps = {
  id: number | string;
  type: 'apiary' | 'hive' | 'observation';
  label?: string;
};

export default function DeleteEntityButton({
  id,
  type,
  label,
}: DeleteEntityButtonProps) {
  const router = useRouter();
  async function handleDelete() {
    await deleteEntity(Number(id), type);
    if (type === 'apiary') router.push('/apiaries');
    if (type === 'hive') router.push('/hives');
    if (type === 'observation') router.push('/observations');
  }

  return (
    <RemoveButton
      onDelete={handleDelete}
      label={label || `Verwijder ${type}`}
    />
  );
}
