import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HiveCardData {
  id: number;
  type: string;
  colonyType: string;
}

interface HiveCardProps {
  hive: HiveCardData;
  apiaryId?: number;
}

export function HiveCard({ hive, apiaryId }: HiveCardProps) {
  const href = apiaryId ? `/hives/${hive.id}` : `/hives/${hive.id}`;

  return (
    <Link href={href} className="hive-card-link">
      <Card variant="elevated">
        <Card.Header>
          <Card.Title as="h4">Kast #{hive.id}</Card.Title>
        </Card.Header>

        <Card.Content>
          <div className="hive-card-details">
            <div className="hive-card-detail">
              <span className="hive-card-label">Type kast:</span>
              <Badge variant="default">{hive.type}</Badge>
            </div>

            <div className="hive-card-detail">
              <span className="hive-card-label">Type volk:</span>
              <Badge variant="info">{hive.colonyType}</Badge>
            </div>
          </div>
        </Card.Content>
      </Card>
    </Link>
  );
}
