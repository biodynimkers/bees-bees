"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NewHiveFormProps {
  apiaryId: string;
  apiaryName: string;
}

export default function NewHiveForm({
  apiaryId,
  apiaryName,
}: NewHiveFormProps) {
  const [type, setType] = useState("");
  const [colonyType, setColonyType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/hives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          colonyType,
          apiaryId: parseInt(apiaryId),
        }),
      });

      if (!response.ok) throw new Error("Kon kast niet aanmaken");

      router.push(`/account/apiaries/${apiaryId}`);
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
            <h1 className="title">Nieuwe kast toevoegen</h1>
            <p className="subtitle subtitle--centered">
              Voor bijenstand: {apiaryName}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {error && (
              <div className="form-error form-error--general">
                <p>{error}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="type" className="form-label">
                Type kast *
              </label>
              <select
                id="type"
                className="form-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">-- Selecteer type --</option>
                <option value="Dadant">Dadant</option>
                <option value="Langstroth">Langstroth</option>
                <option value="Warré">Warré</option>
                <option value="Top Bar Hive">Top Bar Hive</option>
                <option value="Klokkast">Klokkast</option>
                <option value="Anders">Anders</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="colonyType" className="form-label">
                Type volk *
              </label>
              <select
                id="colonyType"
                className="form-input"
                value={colonyType}
                onChange={(e) => setColonyType(e.target.value)}
                required
              >
                <option value="">-- Selecteer volk --</option>
                <option value="Buckfast">Buckfast</option>
                <option value="Carnica">Carnica</option>
                <option value="Italiaanse bij">Italiaanse bij</option>
                <option value="Zwarte bij">Zwarte bij (Belgische)</option>
                <option value="Hybride">Hybride</option>
                <option value="Onbekend">Onbekend</option>
              </select>
            </div>

            <div className="button-group">
              <button
                type="submit"
                disabled={loading}
                className="button button--primary button--large"
              >
                {loading ? "Toevoegen..." : "Kast toevoegen"}
              </button>
              <Link
                href={`/account/apiaries/${apiaryId}`}
                className="button button--outline button--large"
              >
                Annuleren
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
