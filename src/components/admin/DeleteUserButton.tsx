'use client';

import { useState } from 'react';
import deleteUser from '@/app/actions/deleteUser';
import { redirect, useRouter } from 'next/navigation';

type DeleteUserButtonProps = {
  userId: string;
  userName: string;
  currentRole: 'USER' | 'ADMIN' | 'SUPERADMIN';
};

export default function DeleteUserButton({
  userId,
  userName,
  currentRole,
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
  // Don't show button for SUPERADMIN users
  if (currentRole === 'SUPERADMIN') {
    return null;
  }

  return (
    <>
      {message && <span className="text-success">{message}</span>}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="btn btn--secondary"
        >
          Verwijder {userName}
        </button>
      ) : (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="heading-tertiary">
              Bevestig verwijdering
            </h3>
            <p className="modal__text">
              Weet je zeker dat je gebruiker {userName} wilt verwijderen?
            </p>
            <div className="modal__actions">
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn--secondary"
              >
                Annuleren
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="btn btn--danger"
              >
                {loading ? 'Bezig...' : 'Ja, verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
