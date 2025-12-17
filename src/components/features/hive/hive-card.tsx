import Link from "next/link";
import { Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HiveCardData {
  id: number;
  type: string;
  colonyType: string;
  apiaryName?: string;
  observationCount?: number;
}

interface HiveCardProps {
  hive: HiveCardData;
  apiaryId?: number;
}

export function HiveCard({ hive }: HiveCardProps) {
  return (
    <Link href={`/hives/${hive.id}`}>
      <Card>
        <Card.Header>
          <div className="card-icon">
            <Box size={20} strokeWidth={1.5} />
          </div>
          <Card.Title>
            {hive.type} - {hive.colonyType}
          </Card.Title>
        </Card.Header>
        <Card.Content>
          {hive.apiaryName && (
            <Card.Description>Bijenstand: {hive.apiaryName}</Card.Description>
          )}
          {hive.observationCount !== undefined && (
            <Card.Description>
              ({hive.observationCount}) Observaties
            </Card.Description>
          )}
        </Card.Content>
      </Card>
    </Link>
  );
}
