import { RegisterForm } from "@/components/forms/RegisterForm";
import { createItem } from "@/app/actions/register";
import Link from "next/link";

export default function Register() {
  return (
    <>
      <section className="page-header" data-page="—">
        <div className="container">
          <h1 className="heading-primary">Account aanmaken</h1>
  
        </div>
      </section>

      <section className="section ">
        <div className="container container--narrow">
          <RegisterForm createItem={createItem} />
        </div>
      </section>
    </>
  );
}
