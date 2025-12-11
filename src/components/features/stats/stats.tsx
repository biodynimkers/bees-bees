import { Container } from "@/components/layout";

interface StatsProps {
  totalObservations: number;
  totalUsers: number;
  totalHives: number;
}

export function Stats({
  totalObservations,
  totalUsers,
  totalHives,
}: StatsProps) {
  return (
    <section className="stats">
      <Container>
        <div className="stats__grid">
          <div className="stats__item">
            <span className="stats__number">
              {totalObservations.toLocaleString()}
            </span>
            <div className="stats__label">Observaties</div>
            <p className="stats__description">Geregistreerd door onze imkers</p>
          </div>
          <div className="stats__item">
            <span className="stats__number">{totalUsers.toLocaleString()}</span>
            <div className="stats__label">Imkers</div>
            <p className="stats__description">Actief op het platform</p>
          </div>
          <div className="stats__item">
            <span className="stats__number">{totalHives.toLocaleString()}</span>
            <div className="stats__label">Bijenkasten</div>
            <p className="stats__description">In beheer via ons systeem</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
