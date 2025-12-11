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
    <Link href={`/apiaries/${apiary.id}`}>
      <Card>
        <Card.Header>
          <div className="card-icon">
            <MapPin size={20} strokeWidth={1.5} />
          </div>
          <Card.Title>{apiary.name}</Card.Title>
        </Card.Header>
        <Card.Content>
          <Card.Description>({apiary.hiveCount}) Kasten</Card.Description>
        </Card.Content>
      </Card>
    </Link>
  );
}
