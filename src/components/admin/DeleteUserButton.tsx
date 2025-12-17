'use client';

import { useState } from 'react';
import deleteUser from '../../app/actions/deleteUser';
import { redirect, useRouter } from 'next/navigation';

type DeleteUserButtonProps = {
  userId: string;
  userName: string;
};

export default function DeleteUserButton({
  userId,
  userName,
}: DeleteUserButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await deleteUser(userId);
      if (result.success) {
        setMessage(`Gebruiker ${userName} is verwijderd.`);
        setTimeout(() => {
          router.push('/admin/users');
        }, 3000);
      } else {
        setMessage(result.error || 'Er ging iets mis.');
      }
    } catch {
      setMessage('Er ging iets mis bij het verwijderen.');
    }
    setLoading(false);
    setShowConfirm(false);
  }

  return (
    <>
      {message && (
        <span style={{ color: 'green', marginLeft: '1rem' }}>{message}</span>
      )}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          style={{ background: 'red', color: 'white', marginLeft: '1rem' }}
        >
          Verwijder
        </button>
      ) : (
        <>
          <span>Weet je het zeker?</span>
          <button onClick={handleDelete} disabled={loading}>
            {loading ? 'Bezig...' : 'Ja, verwijderen'}
          </button>
          <button onClick={() => setShowConfirm(false)}>Annuleren</button>
        </>
      )}
    </>
  );
}
