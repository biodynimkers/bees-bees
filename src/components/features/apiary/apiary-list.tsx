import { ApiaryCard } from "./apiary-card";

interface ApiaryListData {
  id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  hiveCount: number;
}

interface ApiaryListProps {
  apiaries: ApiaryListData[];
  emptyMessage?: string;
}

export function ApiaryList({
  apiaries,
  emptyMessage = "Nog geen bijenstanden toegevoegd",
}: ApiaryListProps) {
  if (apiaries.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="apiary-list">
      {apiaries.map((apiary) => (
        <ApiaryCard key={apiary.id} apiary={apiary} />
      ))}
    </div>
  );
}
