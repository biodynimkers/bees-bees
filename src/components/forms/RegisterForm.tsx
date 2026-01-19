'use client';
import type { RegisterResult } from '@/app/actions/register';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/lib/validators/schemas';
import Button from '@/components/magazine/Button';
import { Eye, EyeOff } from 'lucide-react';
type FormProps = {
  createItem: (formData: Record<string, unknown>) => Promise<RegisterResult>;
};
export function RegisterForm({ createItem }: FormProps) {
  // In React+TypeScript kun je een type meegeven aan useState zodat de compiler weet welke shape de state later heeft: useState<Type>(initialValue)
  // errors are a mapping from field name to array of messages (zod.flatten().fieldErrors)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    // Convert FormData to plain object. Values should be strings for our fields.
    const rawFormData = Object.fromEntries(fd.entries()) as Record<
      string,
      unknown
    >;
    // Validate and parse input data with Zod's safeParse method
    const validationResult = registerSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setErrors(fieldErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await createItem(rawFormData);
      if (!res.ok) {
        console.log('Registration errors:', res.errors);
        setErrors(res.errors);
        setLoading(false);
        return;
      }
      // success: redirect to login
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
      setErrors({ form: ['Er is iets misgegaan. Probeer later opnieuw.'] });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form">
      {errors?.form && (
        <div className="form-error form-error--general">
          {errors.form.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
      )}
      <div className="form__group">
        <label htmlFor="name" className="form__label">
          Naam
        </label>
        <input
          id="name"
          type="text"
          name="name"
          className="form__input"
          placeholder="Voornaam Achternaam"
          onChange={e => {
            if (errors?.name) {
              setErrors(prev => {
                if (!prev) return null;
                const { name, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
        />
        {errors?.name && (
          <div className="form-error">
            {errors.name.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}
      </div>
      <div className="form__group">
        <label htmlFor="email" className="form__label">
          E-mailadres
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="form__input"
          placeholder="uw.naam@voorbeeld.be"
          onChange={e => {
            if (errors?.email) {
              setErrors(prev => {
                if (!prev) return null;
                const { email, ...rest } = prev;
                return Object.keys(rest).length ? rest : null;
              });
            }
          }}
        />
        {errors?.email && (
          <div className="form-error">
            {errors.email.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}
      </div>

      {/* Password group (met toggle) */}
      <div className="form__group">
        <label htmlFor="password" className="form__label">
          Wachtwoord
        </label>
        <div className="input-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="form__input password-input" // Extra class voor padding
            placeholder="Minimaal 8 tekens"
            onChange={e => {
              if (errors?.password) {
                setErrors(prev => {
                  if (!prev) return null;
                  const { password, ...rest } = prev;
                  return Object.keys(rest).length ? rest : null;
                });
              }
            }}
          />
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors?.password && (
          <div className="form-error">
            {errors.password.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}
      </div>
      {/* Confirm Password group */}
      <div className="form__group">
        <label htmlFor="confirmPassword" className="form__label">
          Bevestig wachtwoord
        </label>
        <div className="input-wrapper">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            className="form__input password-input"
            placeholder="Herhaal wachtwoord"
            onChange={e => {
              if (errors?.confirmPassword) {
                setErrors(prev => {
                  if (!prev) return null;
                  const { confirmPassword, ...rest } = prev;
                  return Object.keys(rest).length ? rest : null;
                });
              }
            }}
          />
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword ? 'Verberg bevestiging' : 'Toon bevestiging'
            }
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors?.confirmPassword && (
          <div className="form-error">
            {errors.confirmPassword.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? 'Account aanmaken...' : 'Account aanmaken'}
      </Button>
    </form>
  );
}
