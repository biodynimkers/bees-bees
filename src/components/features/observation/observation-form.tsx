"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface ObservationFormData {
  hiveId: string;
  beeCount: string;
  pollenColor: string;
  notes: string;
}

interface Hive {
  id: number;
  displayName: string;
}

interface ObservationFormProps {
  hives?: Hive[];
  hiveId?: string;
  hiveName?: string;
  initialObservation?: string;
}

export function ObservationForm({ hives, hiveId, hiveName, initialObservation }: ObservationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<ObservationFormData>({
    hiveId: hiveId || "",
    beeCount: "",
    pollenColor: "",
    notes: "",
  });

  // Effect voor het laden van bestaande observatie data (edit mode)
  useEffect(() => {
    if (!initialObservation) return;
    
    async function fetchObservation() {
      try {
        const res = await fetch(`/api/observations/${initialObservation}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            hiveId: data.hiveId?.toString() || hiveId || "",
            beeCount: data.beeCount?.toString() || "",
            pollenColor: data.pollenColor || "",
            notes: data.notes || "",
          });
        } else {
          console.error('Failed to fetch observation data');
        }
      } catch (error) {
        console.error('Error fetching observation:', error);
      }
    }
    
    fetchObservation();
  }, [initialObservation, hiveId]);

  const handleChange =
    (field: keyof ObservationFormData) =>
    (
      e: React.ChangeEvent<
        HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const observationData = {
      beeCount: parseInt(formData.beeCount),
      pollenColor: formData.pollenColor,
      notes: formData.notes || null,
      ...(!initialObservation && formData.hiveId && { hiveId: parseInt(formData.hiveId) }),
    };

    try {
      const url = initialObservation
        ? `/api/observations/${initialObservation}`
        : '/api/observations';
      const method = initialObservation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(observationData),
      });

      if (!response.ok) {
        throw new Error("Kon observatie niet aanmaken");
      }

      router.push(`/hives/${formData.hiveId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsLoading(false);
    }
  };

  const hiveOptions = hives?.map((hive) => ({
    value: hive.id.toString(),
    label: hive.displayName,
  })) || [];

  return (
    <section className="section section--standard bg-alt">
      <div className="container container--narrow">
        <div className="auth-container">
          <div className="auth-header">
            <Link href={`/hives/${formData.hiveId}`} className="breadcrumb">
              ← Terug naar kast
            </Link>
            {hiveName && (
              <p className="subtitle subtitle--centered">{hiveName}</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            {/* Alleen hive selector tonen als geen hiveId vooraf ingesteld */}
            {!hiveId && hives && hives.length > 0 && (
              <Select
                label="Bijenkast"
                value={formData.hiveId}
                onChange={handleChange("hiveId")}
                options={hiveOptions}
                placeholder="Selecteer een kast"
                required
              />
            )}

            <div className="form-group">
              <label htmlFor="beeCount" className="form-label">
                Aantal bijen
              </label>
              <input
                type="number"
                id="beeCount"
                value={formData.beeCount}
                onChange={handleChange("beeCount")}
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
                value={formData.pollenColor}
                onChange={handleChange("pollenColor")}
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
                value={formData.notes}
                onChange={handleChange("notes")}
                className="form-input"
                placeholder="Extra opmerkingen over de kast..."
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="button button--primary button--large"
              disabled={isLoading}
            >
              {isLoading
                ? initialObservation
                  ? 'Bezig met opslaan...'
                  : 'Bezig met opslaan...'
                : initialObservation
                ? 'Observatie wijzigen'
                : 'Observatie toevoegen'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
