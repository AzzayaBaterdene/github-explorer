// as const 
// 1. keeps the exact words ("updated", not just string)
// 2. makes the array readonly: it can’t be changed
export const SORTS = ["updated", "stars", "name"] as const;  // a real array
export type Sort = (typeof SORTS)[number];   // This line creates a type from a value, Sort ends up as the union 

export const SORT_LABELS: Record<Sort, string> = {
    updated: "Recently updated",
    stars: "Most Stars",
    name: "Name"
}

// value is Sort --> the return type (boolean)
// isSort checks whether a string is one of these three words:
export function isSort (value: string): value is Sort {
    return SORTS.some((sort) => sort === value);
}

// TypeScript makes you prove the value is one of the three before you use it. isSort is that proof.
