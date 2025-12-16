'use client';
import { useState } from 'react';

type RemoveButtonProps = {
  onDelete: () => Promise<void>;
  label?: string;
  confirmText?: string;
  loadingText?: string;
};

export default function RemoveButton({
  onDelete,
  label = 'Verwijderen',
  confirmText = 'Weet je zeker dat je wilt verwijderen?',
  loadingText = 'Bezig met verwijderen...',
}: RemoveButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await onDelete();
    setLoading(false);
    setShowConfirm(false);
  }

  return (
    <>
      <button
        style={{ background: 'red' }}
        onClick={() => setShowConfirm(true)}
      >
        {label}
      </button>
      {showConfirm && (
        <div>
          {confirmText}
          <button onClick={handleDelete} disabled={loading}>
            {loading ? loadingText : 'Ja, verwijderen'}
          </button>
          <button onClick={() => setShowConfirm(false)}>Annuleren</button>
        </div>
      )}
    </>
  );
}
