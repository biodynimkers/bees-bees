import { RegisterForm } from "@/components/forms/RegisterForm";
import { createItem } from "@/app/actions/register";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Account aanmaken</h1>
          <p className="page-header__subtitle">Start vandaag met digitale bijenwaarnemingen</p>
        </div>
      </section>

      <section className="section ">
        <div className="container container--narrow">
          <RegisterForm createItem={createItem} />

          <div className="text-center margin-top-large">
            <p className="card__description">
              Heeft u al een account?{" "}
              <Link href="/auth/login" className="text-link">
                Log hier in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
