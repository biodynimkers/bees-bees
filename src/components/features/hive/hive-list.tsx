import { HiveCard } from "./hive-card";

interface HiveListData {
  id: number;
  type: string;
  colonyType: string;
  apiaryName?: string;
  observationCount?: number;
}

interface HiveListProps {
  hives: HiveListData[];
  apiaryId?: number;
  emptyMessage?: string;
}

export function HiveList({
  hives,
  apiaryId,
  emptyMessage = "Nog geen kasten toegevoegd",
}: HiveListProps) {
  if (hives.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-message">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-3">
      {hives.map((hive) => (
        <HiveCard key={hive.id} hive={hive} apiaryId={apiaryId} />
      ))}
    </div>
  );
}
