import { describe, it, expect } from "vitest";
import { formatCount, timeAgo } from "./format";

// old tests for formatCount
// describe("formatCount", () => {
//     it("leaves small numbers alone", () => {
//         expect(formatCount(99)).toBe("99");
//     });
//     it("abbreviates thousands", () => {
//         expect(formatCount(1234)).toBe("1.2K");
//     });
// });

describe("formatCount", () => {
    it.each([
        [0, "0"],
        [999, "999"],
        [1000, "1K"],
        [1500, "1.5K"],
        [999999, "1M"],
        [1000000, "1M"],
        [1500000, "1.5M"],
        [-1500, "-1.5K"]
    ])("formats %d as %s", (input, expected) => {
    expect(formatCount(input)).toBe(expected);
  });
})

describe("timeAgo", () => {
    const now = new Date("2026-10-20T12:00:00Z"); // fixed "now" for consistent testing

    it.each([
    ["2026-10-20T12:00:00Z", "now"],
    ["2026-10-20T11:59:30Z", "30 seconds ago"],
    ["2026-10-20T11:55:00Z", "5 minutes ago"],
    ["2026-10-20T03:00:00Z", "9 hours ago"],
    ["2026-10-19T12:00:00Z", "yesterday"],
    ["2026-10-17T12:00:00Z", "3 days ago"],
    ["2026-10-06T12:00:00Z", "2 weeks ago"],
    ["2026-08-20T12:00:00Z", "2 months ago"],
    ["2024-10-20T12:00:00Z", "2 years ago"],
    ["2026-10-23T12:00:00Z", "in 3 days"],
    ])("%s → %s", (date, expected) => { // test each case with the fixed "now" date
    expect(timeAgo(date, now)).toBe(expected);
  });

  it("returns an empty string for an invalid date instead of throwing", () => {
    expect(timeAgo("not a date", now)).toBe("");
  });
})