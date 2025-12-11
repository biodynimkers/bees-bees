"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

interface HiveFormData {
  type: string;
  colonyType: string;
}

interface HiveFormProps {
  apiaryId: string;
  apiaryName?: string;
  onSuccess?: () => void;
}

const HIVE_TYPE_OPTIONS = [
  { value: "Dadant", label: "Dadant" },
  { value: "Langstroth", label: "Langstroth" },
  { value: "Warré", label: "Warré" },
  { value: "Top Bar Hive", label: "Top Bar Hive" },
  { value: "Klokkast", label: "Klokkast" },
  { value: "Anders", label: "Anders" },
];

const COLONY_TYPE_OPTIONS = [
  { value: "Buckfast", label: "Buckfast" },
  { value: "Carnica", label: "Carnica" },
  { value: "Italiaanse bij", label: "Italiaanse bij" },
  { value: "Zwarte bij", label: "Zwarte bij (Belgische)" },
  { value: "Hybride", label: "Hybride" },
  { value: "Onbekend", label: "Onbekend" },
];

export function HiveForm({ apiaryId, apiaryName, onSuccess }: HiveFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<HiveFormData>({
    type: "",
    colonyType: "",
  });

  const handleChange =
    (field: keyof HiveFormData) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/hives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: formData.type,
          colonyType: formData.colonyType,
          apiaryId: parseInt(apiaryId),
        }),
      });

      if (!response.ok) {
        throw new Error("Kon kast niet aanmaken");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/apiaries/${apiaryId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hive-form-container">
      {apiaryName && (
        <div className="form-subtitle">
          <p>Voor bijenstand: {apiaryName}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        {error && <Alert variant="error">{error}</Alert>}

        <Select
          label="Type kast"
          value={formData.type}
          onChange={handleChange("type")}
          options={HIVE_TYPE_OPTIONS}
          placeholder="Selecteer een kasttype"
          required
        />

        <Select
          label="Type volk"
          value={formData.colonyType}
          onChange={handleChange("colonyType")}
          options={COLONY_TYPE_OPTIONS}
          placeholder="Selecteer een volktype"
          required
        />

        <div className="form-actions">
          <Button type="submit" disabled={isLoading} fullWidth>
            {isLoading ? "Toevoegen..." : "Kast toevoegen"}
          </Button>

          <Button href={`/apiaries/${apiaryId}`} variant="outline" fullWidth>
            Annuleren
          </Button>
        </div>
      </form>
    </div>
  );
}
