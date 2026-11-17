import type { RequestAction, RequestState } from "./github-types";

// Starts at loading: the hook always fetches on mount, so "idle" never really happens.
// RequestState<never>: neither idle nor loading holds data, so one constant fits every T.
export const initialRequestState: RequestState<never> = { status: "loading" };

export function requestReducer<T>(
  state: RequestState<T>,
  action: RequestAction<T>,
): RequestState<T> {
  switch (action.type) {
    case "started":
      return { status: "loading" };
    case "succeeded":
      // Decision: a result only counts while a request is in flight; a late one is ignored
      if (state.status !== "loading") return state;
      return { status: "success", data: action.data };
    case "failed":
      // Decision: a result only counts while a request is in flight; a late one is ignored
      if (state.status !== "loading") return state;
      return { status: "error", error: action.error };

    default: {
      // If a new action is added to RequestAction and not handled above, this line won't compile.
      // never --> it turns a missing case into a compile error;
      const unreachable: never = action;
      // If a bad action still gets in at runtime (plain JS, `as any`), fail here and name it.
      throw new Error(`Unknown action: ${JSON.stringify(unreachable)}`);
    }
  }
}

// Trace: two cases

// A normal action. The state is { status: "loading" } and the action is { type: "succeeded", data: octocat }.

// switch (action.type) matches "succeeded".
// TypeScript knows action has data here.
// It returns a new object, { status: "success", data: octocat }.
// ProfileSection then reaches case "success" and shows the card.

// A bad action. The action is { type: "succeded" } (misspelled), arriving through as any.

// No case matches, so it goes to default.
// It throws Unknown action: {"type":"succeded"}. You get a clear error that points at the reducer and names the bad action.
