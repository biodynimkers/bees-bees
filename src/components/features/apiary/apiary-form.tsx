'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface ApiaryFormData {
  name: string;
  latitude: string;
  longitude: string;
}

interface ApiaryFormProps {
  initialApiary?: string;
  onSuccess?: () => void;
}

export function ApiaryForm({ initialApiary, onSuccess }: ApiaryFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<ApiaryFormData>({
    name: '',
    latitude: '',
    longitude: '',
  });

  // Effect voor het laden van bestaande apiary data (edit mode)
  useEffect(() => {
    if (!initialApiary) return;

    async function fetchApiary() {
      try {
        const res = await fetch(`/api/apiaries/${initialApiary}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || '',
            latitude: data.latitude?.toString() || '',
            longitude: data.longitude?.toString() || '',
          });
        } else {
          console.error('Failed to fetch apiary data');
        }
      } catch (error) {
        console.error('Error fetching apiary:', error);
      }
    }

    fetchApiary();
  }, [initialApiary]);

  const handleChange =
    (field: keyof ApiaryFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const url = initialApiary
        ? `/api/apiaries/${initialApiary}`
        : '/api/apiaries';
      const method = initialApiary ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (!response.ok) {
        throw new Error('Kon bijenstand niet aanmaken');
      }

      if (onSuccess) {
        onSuccess();
      } else if (initialApiary) {
        router.push(`/apiaries/${initialApiary}`);
      } else {
        router.push('/apiaries');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Er ging iets mis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <Alert variant="error">{error}</Alert>}

      <Input
        label="Naam bijenstand"
        type="text"
        value={formData.name}
        onChange={handleChange('name')}
        placeholder="Bijvoorbeeld: Tuin achteraan, Bij de beek"
        required
      />

      <Input
        label="Breedtegraad (Latitude)"
        type="number"
        step="any"
        value={formData.latitude}
        onChange={handleChange('latitude')}
        placeholder="50.8503"
        required
      />

      <Input
        label="Lengtegraad (Longitude)"
        type="number"
        step="any"
        value={formData.longitude}
        onChange={handleChange('longitude')}
        placeholder="4.3517"
        required
      />

      <Button type="submit" disabled={isLoading} fullWidth>
        {isLoading
          ? initialApiary
            ? 'Bezig met opslaan...'
            : 'Toevoegen...'
          : initialApiary
          ? 'Bijenstand wijzigen'
          : 'Bijenstand toevoegen'}
      </Button>
    </form>
  );
}
