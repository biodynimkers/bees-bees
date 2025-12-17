"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

interface HiveFormData {
  apiaryId: string;
  name: string;
  type: string;
  colonyType: string;
}

interface Apiary {
  id: number;
  name: string;
}

interface HiveFormProps {
  apiaries?: Apiary[];
  apiaryId?: string;
  apiaryName?: string;
  initialHive?: string;
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

export function HiveForm({
  apiaries,
  apiaryId,
  apiaryName,
  initialHive,
  onSuccess,
}: HiveFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<HiveFormData>({
    apiaryId: apiaryId || "",
    name: "",
    type: "",
    colonyType: "",
  });

  // Effect voor het laden van bestaande hive data (edit mode)
  useEffect(() => {
    if (!initialHive) return;
    
    async function fetchHive() {
      try {
        const res = await fetch(`/api/hives/${initialHive}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            apiaryId: data.apiaryId?.toString() || apiaryId || "",
            name: data.name || "",
            type: data.type || "",
            colonyType: data.colonyType || "",
          });
        } else {
          console.error('Failed to fetch hive data');
        }
      } catch (error) {
        console.error('Error fetching hive:', error);
      }
    }
    
    fetchHive();
  }, [initialHive, apiaryId]);

  const handleChange =
    (field: keyof HiveFormData) =>
    (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const hiveData = {
      name: formData.name,
      type: formData.type,
      colonyType: formData.colonyType,
      ...(!initialHive && formData.apiaryId && { apiaryId: parseInt(formData.apiaryId) }),
    };

    try {
      const url = initialHive ? `/api/hives/${initialHive}` : "/api/hives";
      const method = initialHive ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hiveData),
      });

      if (!response.ok) {
        throw new Error("Kon kast niet aanmaken");
      }

      if (onSuccess) {
        onSuccess();
      } else if (initialHive) {
        router.push(`/hives/${initialHive}`);
      } else {
        router.push(`/apiaries/${formData.apiaryId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setIsLoading(false);
    }
  };

  const apiaryOptions = apiaries?.map((apiary) => ({
    value: apiary.id.toString(),
    label: apiary.name,
  })) || [];

  return (
    <div className="hive-form-container">
      <form onSubmit={handleSubmit} className="form">
        {error && <Alert variant="error">{error}</Alert>}

        {/* Alleen apiary selector tonen als geen apiaryId vooraf ingesteld */}
        {!apiaryId && apiaries && apiaries.length > 0 && (
          <Select
            label="Bijenstand"
            value={formData.apiaryId}
            onChange={handleChange("apiaryId")}
            options={apiaryOptions}
            placeholder="Selecteer een bijenstand"
            required
          />
        )}

        {/* Toon geselecteerde apiary als vooraf ingesteld */}
        {apiaryId && apiaryName && (
          <div className="form-group">
            <label className="form-label">Bijenstand</label>
            <p>{apiaryName}</p>
            <input type="hidden" value={apiaryId} />
          </div>
        )}

        <Input
          label="Naam kast"
          type="text"
          value={formData.name}
          onChange={handleChange("name")}
          placeholder="Bijv. Kast 1"
          required
        />

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
            {isLoading 
              ? initialHive 
                ? "Bezig met opslaan..." 
                : "Toevoegen..." 
              : initialHive 
                ? "Kast wijzigen" 
                : "Kast toevoegen"
            }
          </Button>

          <Button href="/hives" variant="outline" fullWidth>
            Annuleren
          </Button>
        </div>
      </form>
    </div>
  );
}
