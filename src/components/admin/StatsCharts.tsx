'use client';

interface StatsChartsProps {
  pollenColorStats: Record<string, number>;
  pollenAmountStats: Record<string, number>;
  weatherStats: Record<string, number>;
  hiveTypeStats: Record<string, number>;
  colonyTypeStats: Record<string, number>;
}

const pollenColorNames: Record<string, string> = {
  '#d8b769': 'hazelaar, els, peer, meidoorn, winderlinde, heide',
  '#e56e59': 'sneeuwklokje, paardenbloem, kers, brem, koningskaars, aster',
  '#fdfe97': 'esdoorn, aalbes, stekelbes, sneeuwbes, mais, zomerlinde',
  '#ffff32': 'wilgensoorten, koolzaad, raapzaad, zonnebloem, helenium, guldenroede',
  '#cfbf62': 'appel, tulp, meidoorn, aardbei',
  '#a72744': 'paardenkastanje',
  '#d6c49c': 'framboos',
  '#37255d': 'klaproos',
  '#bb832b': 'klaver, witte steenklaver, akelei',
  '#e7dfbd': 'bernagie, braam',
  '#3e65ee': 'facelia, kogeldistel',
  '#6b7280': 'geen stuifmeel zichtbaar',
};

const pollenColorMap: Record<string, string> = {
  '#d8b769': '#d8b769',
  '#e56e59': '#e56e59',
  '#fdfe97': '#fdfe97',
  '#ffff32': '#ffff32',
  '#cfbf62': '#cfbf62',
  '#a72744': '#a72744',
  '#d6c49c': '#d6c49c',
  '#37255d': '#37255d',
  '#bb832b': '#bb832b',
  '#e7dfbd': '#e7dfbd',
  '#3e65ee': '#3e65ee',
  '#6b7280': '#6b7280',
};

const weatherNames: Record<string, string> = {
  SUNNY: 'Zonnig',
  PARTLY_CLOUDY: 'Half bewolkt',
  CLOUDY: 'Bewolkt',
  RAINY: 'Regenachtig',
  UNKNOWN: 'Onbekend',
};

const pollenAmountNames: Record<string, string> = {
  GEEN: 'Geen',
  WEINIG: 'Weinig',
  GEMIDDELD: 'Gemiddeld',
  VEEL: 'Veel',
};

function PieChart({
  title,
  data,
  labels,
  colors,
  order,
}: {
  title: string;
  data: Record<string, number>;
  labels?: Record<string, string>;
  colors?: Record<string, string>;
  order?: string[];
}) {
  let entries = Object.entries(data);
  
  // Sorteer op basis van order array indien aanwezig, anders sorteer op aantal (hoog naar laag)
  if (order) {
    entries = entries.sort(([keyA], [keyB]) => {
      const indexA = order.indexOf(keyA);
      const indexB = order.indexOf(keyB);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  } else {
    // Sorteer van hoog naar laag op basis van aantal
    entries = entries.sort(([, a], [, b]) => b - a);
  }
  
  const total = entries.reduce((sum, [, value]) => sum + value, 0);

  if (total === 0) return null;

  let currentAngle = -90;

  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="pie-container">
        <svg viewBox="0 0 200 200" className="pie-chart">
          {entries.map(([key, value], index) => {
            const percentage = (value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startX = 100 + 90 * Math.cos((Math.PI * startAngle) / 180);
            const startY = 100 + 90 * Math.sin((Math.PI * startAngle) / 180);
            const endX = 100 + 90 * Math.cos((Math.PI * endAngle) / 180);
            const endY = 100 + 90 * Math.sin((Math.PI * endAngle) / 180);
            const largeArc = angle > 180 ? 1 : 0;

            const path = `M 100 100 L ${startX} ${startY} A 90 90 0 ${largeArc} 1 ${endX} ${endY} Z`;
            const fillColor = colors?.[key] || `hsl(${index * (360 / entries.length)}, 70%, 60%)`;

            return (
              <path
                key={key}
                d={path}
                fill={fillColor}
                className="pie-slice"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {entries.map(([key, value], index) => {
            const percentage = ((value / total) * 100).toFixed(0);
            const label = labels?.[key] || key;
            const fillColor = colors?.[key] || `hsl(${index * (360 / entries.length)}, 70%, 60%)`;
            
            return (
              <div key={key} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: fillColor }}></span>
                <span className="legend-label">{label}</span>
                <span className="legend-value">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function StatsCharts({
  pollenColorStats,
  pollenAmountStats,
  weatherStats,
  hiveTypeStats,
  colonyTypeStats,
}: StatsChartsProps) {
  return (
    <div className="stats-grid">
      <PieChart
        title="Stuifmeelkleuren"
        data={pollenColorStats}
        labels={pollenColorNames}
        colors={pollenColorMap}
      />
      <PieChart
        title="Stuifmeelhoeveelheid"
        data={pollenAmountStats}
        labels={pollenAmountNames}
        order={['WEINIG', 'GEMIDDELD', 'VEEL', 'GEEN']}
      />
      <PieChart
        title="Weersomstandigheden"
        data={weatherStats}
        labels={weatherNames}
        order={['SUNNY', 'PARTLY_CLOUDY', 'CLOUDY', 'RAINY', 'UNKNOWN']}
      />
      <PieChart
        title="Behuizingen"
        data={hiveTypeStats}
        order={['Korf', 'Hangkorf', 'Simplex', 'Aanrainbeuren', 'Anders']}
      />
      <PieChart
        title="Bijenvolk soorten"
        data={colonyTypeStats}
        order={['Carnica', 'Buckfast', 'Zwarte bij', 'Andere', 'Onbekend']}
      />
    </div>
  );
}
