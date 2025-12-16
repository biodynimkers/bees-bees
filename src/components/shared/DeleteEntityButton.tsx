'use client';
import RemoveButton from '@/components/shared/RemoveButton';
import { useRouter } from 'next/navigation';
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
    let endpoint = '';
    let redirectUrl = '/';
    if (type === 'apiary') {
      endpoint = `/api/apiaries/${id}`;
      redirectUrl = '/apiaries';
    }
    if (type === 'hive') {
      endpoint = `/api/hives/${id}`;
      redirectUrl = '/hives';
    }
    if (type === 'observation') {
      endpoint = `/api/observations/${id}`;
      redirectUrl = '/observations';
    }
    await fetch(endpoint, { method: 'DELETE' });
    router.push(redirectUrl);
  }

  return (
    <RemoveButton
      onDelete={handleDelete}
      label={label || `Verwijder ${type}`}
    />
  );
}
