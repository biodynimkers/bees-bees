import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ApiaryCardData {
  id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  hiveCount: number;
}

interface ApiaryCardProps {
  apiary: ApiaryCardData;
}

export function ApiaryCard({ apiary }: ApiaryCardProps) {
  return (
    <Link href={`/apiaries/${apiary.id}`} className="apiary-card-link">
      <Card variant="elevated">
        <Card.Header>
          <div className="apiary-card-header">
            <Card.Title as="h3">{apiary.name}</Card.Title>
            <Badge variant="info">{apiary.hiveCount} kasten</Badge>
          </div>
        </Card.Header>

        <Card.Content>
          {apiary.latitude && apiary.longitude && (
            <div className="apiary-card-location">
              <MapPin size={16} aria-hidden="true" />
              <span>
                {apiary.latitude.toFixed(5)}, {apiary.longitude.toFixed(5)}
              </span>
            </div>
          )}
        </Card.Content>
      </Card>
    </Link>
  );
}
