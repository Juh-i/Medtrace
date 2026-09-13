/**
 * Minimal ambient type declaration for the `cors` package.
 *
 * @types/cors is not installed. This declaration provides just enough
 * typing for the MedTrace server — a zero-argument call that returns an
 * Express RequestHandler — without adding a new dependency.
 */
declare module "cors" {
  import type { RequestHandler } from "express";
  function cors(options?: Record<string, unknown>): RequestHandler;
  namespace cors {}
  export = cors;
}
