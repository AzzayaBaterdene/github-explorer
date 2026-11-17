// src/hooks/useRequest.ts
// Runs one request for a login and returns its state: loading → success | error.
// Written once, used for both the profile and the repos.

import { useEffect, useReducer, useState } from "react";
import type { RequestState } from "../lib/github-types";
import { initialRequestState, requestReducer } from "../lib/requestReducer";

export function useRequest<T>(
  load: (login: string, signal: AbortSignal) => Promise<T>,
  login: string,
): RequestState<T> {
  // const [state, setState] = useState<RequestState<T>>({ status: "loading" });
  // it must say RequestState<T>. If it says RequestState<never>, TypeScript took the type from the initial state instead of from the reducer.
  // <T> fixes the reducer's type to this hook's T, so state is RequestState<T>, not <never>.
  const [state, dispatch] = useReducer(requestReducer<T>, initialRequestState);

  // `load` is in the dependency array because the effect uses it. getUser and getRepos are
  // module-level functions, so they never change and don't cause extra runs.
  useEffect(() => {
    // One controller per run of the effect, i.e. per request.
    const controller = new AbortController();

    // Kept so the hook is correct on its own, even without key={login}.
    // setState({ status: "loading" });
    dispatch({ type: "started" });

    load(login, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return; // a newer request owns the screen now
        // setState({ status: "success", data });
        dispatch({ type: "succeeded", data });
      })
      .catch((error: unknown) => {
        // Cancelled on purpose (login changed, unmounted, StrictMode): not an error to show.
        if (controller.signal.aborted) return;
        // setState({ status: "error", error });
        dispatch({ type: "failed", error });
      });

    // Cleanup runs BEFORE the next run and on unmount: cancel this run's request.
    return () => controller.abort();
  }, [load, login]);

  return state;
}

// document every way a request can change
//  a type -> lists of every event that can happen to a request
// starts -> success with data , fails with an error

// The RequestAction<T> union is the list of every possible event, and the never check enforces it.
// dispatch sends one action from that list to the reducer.
