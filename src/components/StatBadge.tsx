import { formatCount } from "../lib/format"

type StatBadgeProps = {
    label: string,
    value: string | number
}

export function StatBadge({ label, value }: StatBadgeProps) {
    return (
        <div className="stat-badge">
            <span className="stat-badge__value">{formatCount(value as number)}</span>
            <span className="stat-badge__label">{label}</span>
        </div>
    )
}