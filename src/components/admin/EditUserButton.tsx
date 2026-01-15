'use client';

import { useState } from 'react';
import toggleUserRole from '@/app/actions/toggleUserRole';
import { useRouter } from 'next/navigation';
import { set } from 'zod';

type EditUserButtonProps = {
  userId: string;
  currentRole: 'USER' | 'ADMIN' | 'SUPERADMIN';
};

export default function EditUserButton({
  userId,
  currentRole,
}: EditUserButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    try {
      const result = await toggleUserRole(userId, currentRole);
      if (result.success) {
        setMessage(`Rol gewijzigd naar ${result.newRole}`);
        setTimeout(() => {
          router.refresh();
          setMessage('');
        }, 3000);
      } else {
        setMessage(result.error || 'Er ging iets mis.');
      }
    } catch {
      setMessage('Er ging iets mis bij het wijzigen van de rol.');
    }
    setLoading(false);
  }

  // Don't show button for SUPERADMIN users
  if (currentRole === 'SUPERADMIN') {
    return null;
  }

  return (
    <>
      {message && <span className="text-success">{message}</span>}
      <button
        onClick={handleToggle}
        disabled={loading}
        className="btn btn--secondary"
      >
        {loading
          ? 'Bezig...'
          : currentRole === 'USER'
          ? 'Maak admin'
          : 'Maak gewone user'}
      </button>
    </>
  );
}
