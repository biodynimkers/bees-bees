"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NewObservationFormProps {
  apiaryId: string;
  hiveId: string;
  hiveName: string;
}

export default function NewObservationForm({
  apiaryId,
  hiveId,
  hiveName,
}: NewObservationFormProps) {
  const [beeCount, setBeeCount] = useState("");
  const [pollenColor, setPollenColor] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/observations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiveId: parseInt(hiveId),
          beeCount: parseInt(beeCount),
          pollenColor,
          notes: notes || null,
        }),
      });

      if (!response.ok) throw new Error("Kon observatie niet aanmaken");

      router.push(`/account/apiaries/${apiaryId}/hives/${hiveId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
      setLoading(false);
    }
  }

  return (
    <section className="section section--standard bg-alt">
      <div className="container container--narrow">
        <div className="auth-container">
          <div className="auth-header">
            <Link
              href={`/account/apiaries/${apiaryId}/hives/${hiveId}`}
              className="breadcrumb"
            >
              ← Terug naar kast
            </Link>
            <h1 className="title">Nieuwe observatie</h1>
            <p className="subtitle subtitle--centered">{hiveName}</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="beeCount" className="form-label">
                Aantal bijen
              </label>
              <input
                type="number"
                id="beeCount"
                value={beeCount}
                onChange={(e) => setBeeCount(e.target.value)}
                className="form-input"
                placeholder="Geschat aantal bijen"
                required
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pollenColor" className="form-label">
                Stuifmeelkleur
              </label>
              <input
                type="text"
                id="pollenColor"
                value={pollenColor}
                onChange={(e) => setPollenColor(e.target.value)}
                className="form-input"
                placeholder="bv. Geel, Oranje, Wit"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Notities (optioneel)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input"
                placeholder="Extra opmerkingen over de kast..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="button button--primary button--large"
              disabled={loading}
            >
              {loading ? "Bezig met opslaan..." : "Observatie toevoegen"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
