'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/shared/Breadcrumbs';

const MAX_FILE_SIZE = 800 * 1024; // 800KB
const RECOMMENDED_WIDTH = 1920;
const RECOMMENDED_HEIGHT = 1080;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const COMPRESSION_QUALITY = 0.90; // 90% kwaliteit voor goede kwaliteit op grote schermen

export default function ExtrasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [pendingImage, setPendingImage] = useState('');
  const [altText, setAltText] = useState('');
  const [pendingAltText, setPendingAltText] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session?.user || session.user.role !== 'SUPERADMIN') {
      router.push('/unauthorized');
      return;
    }

    // Check of er een custom hero image bestaat
    fetch('/assets/hero-custom.jpg')
      .then(res => {
        if (res.ok) {
          setImagePreview('/assets/hero-custom.jpg?t=' + Date.now());
        }
      })
      .catch(() => {});
    
    // Laad alt text
    fetch('/assets/hero-alt.json')
      .then(res => res.json())
      .then(data => {
        if (data.alt) {
          setAltText(data.alt);
        }
      })
      .catch(() => {});
  }, [session, status, router]);

  const validateImage = (file: File): Promise<{ valid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        resolve({ 
          valid: false, 
          error: 'Bestandstype niet toegestaan. Gebruik JPG, PNG of WebP.' 
        });
        return;
      }

      // We checken niet meer de originele grootte, want we comprimeren het
      // Alleen type en validiteit checken

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ valid: true });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ valid: false, error: 'Kon afbeelding niet laden.' });
      };

      img.src = objectUrl;
    });
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Resize alleen als groter dan aanbevolen formaat
          let width = img.width;
          let height = img.height;
          
          if (width > RECOMMENDED_WIDTH || height > RECOMMENDED_HEIGHT) {
            const ratio = Math.min(RECOMMENDED_WIDTH / width, RECOMMENDED_HEIGHT / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject('Canvas not supported');
            return;
          }
          
          // Gebruik smoothing voor betere kwaliteit
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprimeer naar JPEG met 90% kwaliteit
          const compressedBase64 = canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY);
          resolve(compressedBase64);
        };
        img.onerror = () => reject('Kon afbeelding niet laden');
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject('Kon bestand niet lezen');
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setMessage('');

    const validation = await validateImage(file);
    
    if (!validation.valid) {
      setError(validation.error || 'Ongeldige afbeelding');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      const compressedImage = await compressImage(file);
      
      // Check gecomprimeerde grootte
      const compressedSize = (compressedImage.length * 3) / 4; // Base64 size estimate
      if (compressedSize > MAX_FILE_SIZE) {
        const sizeMB = (compressedSize / 1024).toFixed(0);
        setError(`Afbeelding nog steeds te groot na compressie (${sizeMB}KB). Probeer een kleinere afbeelding.`);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setPendingImage(compressedImage);
    } catch (err) {
      setError('Fout bij comprimeren van afbeelding. Probeer opnieuw.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!pendingAltText.trim()) {
      setError('Vul een alt tekst in voor SEO en toegankelijkheid.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: pendingImage,
          altText: pendingAltText
        })
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setImagePreview(pendingImage);
      setAltText(pendingAltText);
      setPendingImage('');
      setPendingAltText('');
      setMessage('Hero afbeelding succesvol opgeslagen!');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError('Fout bij opslaan. Probeer opnieuw.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPendingImage('');
    setPendingAltText('');
    setError('');
    setMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (status === 'loading') {
    return (
      <div className="container section">
        <p>Laden...</p>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'SUPERADMIN') {
    return null;
  }

  return (
    <div className="platform-page">
      <section className="platform-hero">
        <div className="container">
          <div className="platform-hero__content">
            <span className="platform-hero__label">Admin</span>
            <h1 className="platform-hero__title">Extra's</h1>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '12px' }}>
              Beheer de hero afbeelding op de homepage
            </p>
          </div>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Admin', href: '/admin' }, { label: "Extra's" }]} />

      <section className="home-features">
        <div className="container container--narrow">
          <div>

            <div className="card margin-bottom-large">
              <h3 className="heading-tertiary margin-bottom-medium">
                Vereisten
              </h3>
              <div className="grid gap-md">
                <div>
                  <p style={{ marginBottom: '8px', fontWeight: 500 }}>
                    Bestandstype
                  </p>
                  <p>JPG, PNG of WebP</p>
                </div>
                <div>
                  <p style={{ marginBottom: '8px', fontWeight: 500 }}>
                    Automatische compressie
                  </p>
                  <p>Max 800KB, 90% kwaliteit, 1920 × 1080 pixels</p>
                </div>
              </div>
            </div>

            {message && (
              <div 
                className="card" 
                style={{ 
                  marginBottom: 'var(--space-10)',
                  padding: 'var(--space-6)',
                  background: '#e8f5e9',
                  border: '1px solid #4caf50'
                }}
              >
                <p>
                  {message}
                </p>
              </div>
            )}

            {error && (
              <div 
                className="card" 
                style={{ 
                  marginBottom: 'var(--space-10)',
                  padding: 'var(--space-6)',
                  background: '#ffebee',
                  border: '1px solid #f44336'
                }}
              >
                <p>
                  {error}
                </p>
              </div>
            )}

            <div style={{ marginBottom: 'var(--space-10)', textAlign: 'center' }}>
              <input
                ref={fileInputRef}
                type="file"
                id="heroImageFile"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="btn btn--secondary btn--lg"
                disabled={!!pendingImage}
              >
                Selecteer afbeelding
              </button>
            </div>

            {pendingImage && (
              <div className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-10)' }}>
                <h3 
                  className="heading-tertiary" 
                  style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}
                >
                  Preview
                </h3>
                <div 
                  style={{
                    width: '100%',
                    height: '400px',
                    borderRadius: 'var(--border-radius)',
                    overflow: 'hidden',
                    marginBottom: 'var(--space-6)'
                  }}
                >
                  <img
                    src={pendingImage}
                    alt="Hero preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <label htmlFor="altText" className="form__label">
                    Alt tekst (verplicht voor SEO)
                  </label>
                  <p className="form__help">
                    Beschrijf de afbeelding in 1-2 zinnen. Dit helpt zoekmachines en mensen met een screenreader.
                  </p>
                  <input
                    type="text"
                    id="altText"
                    className="form__input"
                    placeholder="Bijv: Bijenstand met bloeiende bloemen in de lente"
                    value={pendingAltText}
                    onChange={(e) => setPendingAltText(e.target.value)}
                    maxLength={150}
                  />
                  <p className="form__help">
                    {pendingAltText.length}/150 karakters
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !pendingAltText.trim()}
                    className="btn btn--secondary btn--lg"
                  >
                    {saving ? 'Bezig met opslaan...' : 'Opslaan'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="btn btn--secondary btn--lg"
                  >
                    Annuleren
                  </button>
                </div>
              </div>
            )}

            {imagePreview && !pendingImage && (
              <div className="card" style={{ padding: 'var(--space-8)' }}>
                <h3 
                  className="heading-tertiary" 
                  style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}
                >
                  Huidige afbeelding
                </h3>
                <div 
                  style={{
                    width: '100%',
                    height: '400px',
                    borderRadius: 'var(--border-radius)',
                    overflow: 'hidden',
                    marginBottom: 'var(--space-5)'
                  }}
                >
                  <img
                    src={imagePreview}
                    alt="Hero preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
                <p style={{ textAlign: 'center', marginBottom: 'var(--space-3)' }}>
                  Deze afbeelding wordt getoond op de homepage
                </p>
                {altText && (
                  <div style={{ 
                    padding: 'var(--space-4)', 
                    background: 'rgba(0, 0, 0, 0.03)', 
                    borderRadius: 'var(--border-radius)',
                    textAlign: 'center'
                  }}>
                    <p style={{ marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                      Alt tekst:
                    </p>
                    <p style={{ fontStyle: 'italic' }}>"{altText}"</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}