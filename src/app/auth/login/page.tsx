"use client";
import React from "react";
import { loginSchema } from "@/lib/validators/schemas";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Hero from "@/components/magazine/Hero";
import Section from "@/components/magazine/Section";
import Button from "@/components/magazine/Button";

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
        showScroll={false}
      />

      <Section variant="white" size="lg">
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
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
                  <p>{fieldErrors.email}</p>
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
                  <p>{fieldErrors.password}</p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? "Inloggen..." : "Inloggen"}
            </Button>
          </form>

          <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
            <p style={{ color: "var(--color-text-light)" }}>
              Nog geen account?{" "}
              <Link
                href="/auth/register"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                }}
              >
                Registreer hier
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
