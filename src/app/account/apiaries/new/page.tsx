import NewApiaryForm from "@/components/forms/NewApiaryForm";

export default function AccountNewApiaryPage() {
  return (
    <section className="section section--standard bg-alt">
      <div className="container container--narrow">
        <div className="auth-container">
          <div className="auth-header">
            <h1 className="title">Nieuwe bijenstand toevoegen</h1>
            <p className="subtitle subtitle--centered">
              Registreer een nieuwe locatie voor uw bijenkasten
            </p>
          </div>

          <NewApiaryForm />
        </div>
      </div>
    </section>
  );
}
