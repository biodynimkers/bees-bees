"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface NewApiaryFormProps {
  onSuccess?: () => void;
}

export default function NewApiaryForm({ onSuccess }: NewApiaryFormProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/apiaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, location }),
      });

      if (!response.ok) throw new Error("Kon bijenstand niet aanmaken");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/account/apiaries");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && (
        <div className="form-error form-error--general">
          <p>{error}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Naam bijenstand *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="bv. Tuin achteraan, Bij de beek"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location" className="form-label">
          Locatie *
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="form-input"
          placeholder="bv. Gent, Brugge"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="button button--primary button--large"
      >
        {loading ? "Toevoegen..." : "Bijenstand toevoegen"}
      </button>
    </form>
  );
}
