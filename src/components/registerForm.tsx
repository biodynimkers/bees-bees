'use client';
import type { RegisterResult } from '@/app/actions/register';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerSchema } from '@/lib/validators/schemas';

type FormProps = {
  createItem: (formData: FormData) => Promise<RegisterResult>;
};
export function RegisterForm({ createItem }: FormProps) {
  // In React+TypeScript kun je een type meegeven aan useState zodat de compiler weet welke shape de state later heeft: useState<Type>(initialValue)

  // errors are a mapping from field name to array of messages (zod.flatten().fieldErrors)
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);
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
      const res = await createItem(fd);
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
    <form onSubmit={handleSubmit}>
      <div>
        {errors?.form?.map((msg, i) => (
          <p key={i} style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
            {msg}
          </p>
        ))}
        <label htmlFor="">Naam</label>
        <input
          type="text"
          name="name"
          placeholder="John Doe"
          //remove the name error when user starts typing
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

        {errors?.name?.map((msg, i) => (
          <p key={i} style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
            {msg}
          </p>
        ))}
      </div>

      <div>
        <label htmlFor="">E-mail</label>
        <input
          type="email"
          name="email"
          placeholder="john.doe@example.com" //remove the name error when user starts typing
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
        {errors?.email?.map((msg, i) => (
          <p key={i} style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
            {msg}
          </p>
        ))}
      </div>
      <div>
        <label htmlFor="">Paswoord</label>
        <input
          type="password"
          name="password"
          placeholder="test@123!" //remove the name error when user starts typing
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
        {errors?.password?.map((msg, i) => (
          <p key={i} style={{ color: 'red', fontSize: '0.9em', margin: 0 }}>
            {msg}
          </p>
        ))}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Bezig...' : 'Verstuur'}
      </button>
    </form>
  );
}
