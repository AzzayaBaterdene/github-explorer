// src/lib/requestReducer.test.ts
import { describe, expect, it } from "vitest";
import type { RequestAction, RequestState } from "./github-types";
import { initialRequestState, requestReducer } from "./requestReducer";

// The reducer is generic, so the simplest T (string) tests the same logic as GitHubUser.
type S = RequestState<string>;
type A = RequestAction<string>;

const boom = new Error("boom");
const loading: S = initialRequestState;
const success: S = { status: "success", data: "old" };
const failed: S = { status: "error", error: boom };

describe("requestReducer", () => {
  it.each<{ name: string; state: S; action: A; expected: S }>([
    {
      name: "loading + started → loading",
      state: loading,
      action: { type: "started" },
      expected: { status: "loading" },
    },
    {
      name: "loading + succeeded → success with the data",
      state: loading,
      action: { type: "succeeded", data: "hi" },
      expected: { status: "success", data: "hi" },
    },
    {
      name: "loading + failed → error with the error",
      state: loading,
      action: { type: "failed", error: boom },
      expected: { status: "error", error: boom },
    },
    // Re-fetch. Step 8 changes this row to "refreshing" that keeps "old".
    {
      name: "success + started → loading",
      state: success,
      action: { type: "started" },
      expected: { status: "loading" },
    },
    {
      name: "error + started → loading (retry)",
      state: failed,
      action: { type: "started" },
      expected: { status: "loading" },
    },
  ])("$name", ({ state, action, expected }) => {
    expect(requestReducer(state, action)).toEqual(expected);
  });

  // Decision B: a result that arrives when nothing is loading changes nothing.
  it.each<{ name: string; state: S; action: A }>([
    {
      name: "success + succeeded",
      state: success,
      action: { type: "succeeded", data: "late" },
    },
    {
      name: "success + failed",
      state: success,
      action: { type: "failed", error: boom },
    },
    {
      name: "error + succeeded",
      state: failed,
      action: { type: "succeeded", data: "late" },
    },
  ])("ignores a late result: $name", ({ state, action }) => {
    expect(requestReducer(state, action)).toBe(state);
  });

  it("throws on an unknown action", () => {
    // `as never` forces a bad action past TypeScript, which is the case the throw is there for.
    expect(() => requestReducer(loading, { type: "nope" } as never)).toThrow(
      /Unknown action/,
    );
  });
});
