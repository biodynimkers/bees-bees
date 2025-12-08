import { RegisterForm } from "@/components/forms/RegisterForm";
import { createItem } from "@/app/actions/register";
import Link from "next/link";
import Hero from "@/components/magazine/Hero";
import Section from "@/components/magazine/Section";

export default function Register() {
  return (
    <>
      <Hero
        title="Account aanmaken"
        subtitle="Start vandaag met digitale bijenwaarnemingen"
        image="/assets/hero-new.jpg"
        imageAlt="BEES Platform Registratie"
        showScroll={false}
      />

      <Section variant="white" size="lg">
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <RegisterForm createItem={createItem} />

          <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
            <p style={{ color: "var(--color-text-light)" }}>
              Heeft u al een account?{" "}
              <Link
                href="/auth/login"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                }}
              >
                Log hier in
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
