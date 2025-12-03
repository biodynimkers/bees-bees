"use client";
import React from "react";
import { loginSchema } from "@/lib/validators/schemas";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  type Errors = string | undefined | null;

  const [errors, setErrors] = useState<Errors>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors(null);
    setLoading(true);

    const fd = new FormData(event.currentTarget);
    const rawFormData = Object.fromEntries(fd.entries()) as Record<
      string,
      unknown
    >;

    // Validate with Zod
    const validationResult = loginSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      const { fieldErrors } = validationResult.error.flatten();
      setFieldErrors(fieldErrors);
      setLoading(false);
      return;
    }
    try {
      const res = await signIn("credentials", {
        ...rawFormData,
        redirect: false,
        callbackUrl: "/account",
      });
      if (!res?.ok) {
        console.log("signIn errors:", res?.error);
        if (res?.error === "CredentialsSignin") {
          setErrors(
            "Onjuiste inloggegevens. Controleer uw e-mail en wachtwoord."
          );
        } else if (res?.error) {
          setErrors("Er is iets misgegaan. Probeer later opnieuw.");
        }
        setLoading(false);
        return;
      }
      router.push("/account");
    } catch (err) {
      console.error(err);
      setErrors("Er is iets misgegaan. Probeer later opnieuw.");
      setLoading(false);
    }
  }

  return (
    <section className="section section--standard bg-alt">
      <div className="container container--narrow">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="title">Inloggen</h1>
            <p className="subtitle subtitle--centered">
              Welkom terug bij uw bijenwaarnemingen
            </p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {errors && (
              <div className="form-error form-error--general">
                <p>{errors}</p>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                E-mailadres
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="uw.naam@voorbeeld.be"
                onChange={(e) => {
                  if (fieldErrors?.email) {
                    setFieldErrors((prev) => ({ ...prev, email: [] }));
                  }
                }}
              />
              {fieldErrors?.email && (
                <div className="form-error">
                  <p>{fieldErrors.email}</p>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form-input"
                placeholder="Uw wachtwoord"
                onChange={(e) => {
                  if (fieldErrors?.password) {
                    setFieldErrors((prev) => ({ ...prev, password: [] }));
                  }
                }}
              />
              {fieldErrors?.password && (
                <div className="form-error">
                  <p>{fieldErrors.password}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="button button--primary button--large button--full-width"
            >
              {loading ? "Inloggen..." : "Inloggen"}
            </button>
          </form>

          <div className="auth-footer">
            <p className="text-secondary">
              Nog geen account?{" "}
              <Link href="/auth/register" className="auth-link">
                Registreer hier
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
