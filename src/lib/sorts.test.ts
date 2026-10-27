import { describe, it, expect } from "vitest";
import { isSort } from "./sorts";
describe("isSort", () => {
it.each(["updated", "stars", "name"])("accepts %s", (v) => expect(isSort(v)).toBe(true));
it.each(["STARS", "", "date", " stars"])("rejects %j", (v) => expect(isSort(v)).toBe(false));
});