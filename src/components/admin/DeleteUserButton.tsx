'use client';

import { useState } from 'react';
import deleteUser from '@/app/actions/deleteUser';
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
      {message && <span className="text-success ml-4">{message}</span>}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="btn btn--danger ml-4"
        >
          Verwijder {userName}
        </button>
      ) : (
        <>
          <span>Weet je het zeker?</span>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="btn btn--danger ml-4"
          >
            {loading ? 'Bezig...' : 'Ja, verwijderen'}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="btn btn--secondary ml-4"
          >
            Annuleren
          </button>
        </>
      )}
    </>
  );
}
