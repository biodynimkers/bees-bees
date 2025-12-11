"use client";
import React from "react";
import { loginSchema } from "@/lib/validators/schemas";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Hero, Section } from "@/components/layout";
import { Button } from "@/components/ui";

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
    <>
      <Hero
        title="Inloggen"
        subtitle="Welkom terug bij uw bijenwaarnemingen"
        image="/assets/hero-new.jpg"
        imageAlt="BEES Platform Login"
      />

      <Section variant="default" spacing="large">
        <div className="auth-form-wrapper">
          <form onSubmit={handleSubmit} className="form">
            {errors && (
              <div className="form-error form-error--general">
                <p>{errors}</p>
              </div>
            )}

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
                onChange={(e) => {
                  if (fieldErrors?.email) {
                    setFieldErrors((prev) => ({ ...prev, email: [] }));
                  }
                }}
              />
              {fieldErrors?.email && (
                <div className="form-error">
                  {fieldErrors.email.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="form__group">
              <label htmlFor="password" className="form__label">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                name="password"
                className="form__input"
                placeholder="Uw wachtwoord"
                onChange={(e) => {
                  if (fieldErrors?.password) {
                    setFieldErrors((prev) => ({ ...prev, password: [] }));
                  }
                }}
              />
              {fieldErrors?.password && (
                <div className="form-error">
                  {fieldErrors.password.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={loading}
              className="btn--full-width"
            >
              {loading ? "Inloggen..." : "Inloggen"}
            </Button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer__text">
              Nog geen account?{" "}
              <Link href="/auth/register" className="auth-footer__link">
                Registreer hier
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
