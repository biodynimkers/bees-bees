interface StatsSectionProps {
  totalObservations: number;
  totalUsers: number;
  totalHives: number;
}

export default function StatsSection({
  totalObservations,
  totalUsers,
  totalHives,
}: StatsSectionProps) {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats">
          <div className="stat">
            <span className="stat__number">{totalObservations}</span>
            <span className="stat__label">Geregistreerde waarnemingen</span>
          </div>
          <div className="stat">
            <span className="stat__number">{totalUsers}</span>
            <span className="stat__label">Actieve imkers</span>
          </div>
          <div className="stat">
            <span className="stat__number">{totalHives}</span>
            <span className="stat__label">Behuizingen</span>
          </div>
        </div>
      </div>
    </section>
  );
}
