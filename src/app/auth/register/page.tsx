import { RegisterForm } from "@/components/forms/RegisterForm";
import { createItem } from "@/app/actions/register";
import Link from "next/link";

export default function Register() {
  return (
    <section className="section section--standard bg-alt">
      <div className="container container--narrow">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="title">Account aanmaken</h1>
            <p className="subtitle subtitle--centered">
              Start vandaag met digitale bijenwaarnemingen
            </p>
          </div>
          <RegisterForm createItem={createItem} />
          <div className="auth-footer">
            <p className="text-secondary">
              Heeft u al een account?{" "}
              <Link href="/auth/login" className="auth-link">
                Log hier in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
