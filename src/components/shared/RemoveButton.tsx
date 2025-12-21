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
        style={{ 
          border: "1px solid #dc2626",
          color: "#dc2626"
        }}
      >
        {label}
      </button>
      {showConfirm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: "white",
            padding: "var(--space-12)",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "90%"
          }}>
            <h3 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: "500",
              marginBottom: "var(--space-4)"
            }}>
              Bevestig verwijdering
            </h3>
            <p style={{
              color: "var(--color-text-light)",
              marginBottom: "var(--space-8)",
              lineHeight: "1.6"
            }}>
              {confirmText}
            </p>
            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button 
                className="btn btn--secondary" 
                onClick={() => setShowConfirm(false)}
                style={{ flex: 1 }}
              >
                Annuleren
              </button>
              <button 
                className="btn btn--primary"
                onClick={handleDelete} 
                disabled={loading}
                style={{ 
                  flex: 1,
                  background: "#dc2626",
                  borderColor: "#dc2626"
                }}
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
