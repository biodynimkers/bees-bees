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
        className="btn btn--secondary"
        onClick={() => setShowConfirm(true)}
      >
        {label}
      </button>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="heading-tertiary">
              Bevestig verwijdering
            </h3>
            <p className="modal__text">
              {confirmText}
            </p>
            <div className="modal__actions">
              <button 
                className="btn btn--secondary" 
                onClick={() => setShowConfirm(false)}
              >
                Annuleren
              </button>
              <button 
                className="btn btn--danger"
                onClick={handleDelete} 
                disabled={loading}
              >
                {loading ? loadingText : 'Ja, verwijderen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
