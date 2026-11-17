import { formatCount } from "../lib/format";

type StatBadgeProps = {
  label: string;
  value: number; // every caller passes a number, so the type says so, and no cast is needed
};

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <span className="inline-flex items-baseline gap-1 rounded-full bg-bg px-3 py-1 text-sm">
      <span className="font-semibold tabular-nums">{formatCount(value)}</span>
      <span className="text-muted">{label}</span>
    </span>
  );
}
