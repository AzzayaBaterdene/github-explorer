export const SORTS = ["updated", "stars", "name"] as const;  // a real array
export type Sort = (typeof SORTS)[number];   // This line creates a type from a value, Sort ends up as the union 

export const SORT_LABELS: Record<Sort, string> = {
    updated: "Recently updated",
    stars: "Most Stars",
    name: "Name"
}

// value is Sort --> the return type (boolean)
export function isSort (value: string): value is Sort {
    return SORTS.some((sort) => sort === value);
}