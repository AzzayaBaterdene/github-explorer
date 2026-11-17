// the worker!
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// setupWorker takes handlers one by one, so spread the array: setupWorker(h1, h2, h3).
export const worker = setupWorker(...handlers);
