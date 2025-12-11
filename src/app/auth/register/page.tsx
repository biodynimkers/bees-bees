import { RegisterForm } from "@/components/forms/RegisterForm";
import { createItem } from "@/app/actions/register";
import Link from "next/link";
import { Hero, Section } from "@/components/layout";

export default function Register() {
  return (
    <>
      <Hero
        title="Account aanmaken"
        subtitle="Start vandaag met digitale bijenwaarnemingen"
        image="/assets/hero-new.jpg"
        imageAlt="BEES Platform Registratie"
      />

      <Section variant="default" spacing="large">
        <div className="auth-form-wrapper">
          <RegisterForm createItem={createItem} />

          <div className="auth-footer">
            <p className="auth-footer__text">
              Heeft u al een account?{" "}
              <Link href="/auth/login" className="auth-footer__link">
                Log hier in
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
