import { describe, it, expect } from "vitest";
import { formatCount } from "./format";

describe("formatCount", () => {
    it("leaves small numbers alone", () => {
        expect(formatCount(99)).toBe("99");
    });
    it("abbreviates thousands", () => {
        expect(formatCount(1234)).toBe("1.2k");
    });
});