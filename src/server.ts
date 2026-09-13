/**
 * MedTrace Express server.
 *
 * Exposes three endpoints:
 *   POST /api/decision — run the demo clinical decision engine + seal evidence
 *   POST /api/verify   — verify a CooL receipt offline
 *   GET  /api/health   — liveness check
 *
 * DEMO / HACKATHON PROTOTYPE — fictional data only.
 * Not for clinical use with real patient data.
 */

import express from "express";
import cors from "cors";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { processClinicalDecision } from "./routes/decision.js";
import {
  verifyClinicalEvidence,
  getVerificationSummary,
} from "./cool/verifier.js";

// Absolute path to the project-level receipts/ directory.
// Resolved relative to this file so it works regardless of cwd.
const RECEIPTS_DIR = resolve(fileURLToPath(import.meta.url), "../../receipts");

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------

export const app = express();

app.use(express.json());
app.use(cors());

// ---------------------------------------------------------------------------
// GET /api/health
// ---------------------------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "medtrace" });
});

// ---------------------------------------------------------------------------
// POST /api/decision
// ---------------------------------------------------------------------------

app.post("/api/decision", async (req, res) => {
  const body: unknown = req.body;

  // Basic type validation — reject missing or wrong-typed fields early.
  if (
    body === null ||
    typeof body !== "object" ||
    !("age" in body) ||
    !("chestPain" in body) ||
    !("fatigue" in body) ||
    !("hypertension" in body)
  ) {
    res.status(400).json({
      error: "Missing required fields: age, chestPain, fatigue, hypertension",
    });
    return;
  }

  const { age, chestPain, fatigue, hypertension } = body as Record<string, unknown>;

  if (typeof age !== "number") {
    res.status(400).json({ error: "age must be a number" });
    return;
  }
  if (typeof chestPain !== "boolean") {
    res.status(400).json({ error: "chestPain must be a boolean" });
    return;
  }
  if (typeof fatigue !== "boolean") {
    res.status(400).json({ error: "fatigue must be a boolean" });
    return;
  }
  if (typeof hypertension !== "boolean") {
    res.status(400).json({ error: "hypertension must be a boolean" });
    return;
  }

  try {
    const result = await processClinicalDecision({
      age,
      chestPain,
      fatigue,
      hypertension,
    });

    // Persist the evidence receipt to receipts/<recordId>.json.
    // The directory is created if it doesn't exist; patient data is never saved.
    await mkdir(RECEIPTS_DIR, { recursive: true });
    await writeFile(
      join(RECEIPTS_DIR, `${result.recordId}.json`),
      JSON.stringify(result.evidence, null, 2),
      "utf-8",
    );

    // Return decision evidence — intentionally omit result.patient from the
    // response to avoid echoing patient data back over the wire.
    res.json({
      recordId: result.recordId,
      executionId: result.executionId,
      clinicalDecision: result.clinicalDecision,
      evidence: result.evidence,
      digest: result.digest,
    });
  } catch (err) {
    console.error("Error processing clinical decision:", (err as Error).message);
    res.status(500).json({ error: "Failed to process clinical decision" });
  }
});

// ---------------------------------------------------------------------------
// POST /api/verify
// ---------------------------------------------------------------------------

app.post("/api/verify", async (req, res) => {
  const body: unknown = req.body;

  if (
    body === null ||
    typeof body !== "object" ||
    !("evidence" in body)
  ) {
    res.status(400).json({ error: "Request body must contain an 'evidence' field" });
    return;
  }

  const { evidence } = body as Record<string, unknown>;

  try {
    const verdict = await verifyClinicalEvidence(evidence);
    const summary = getVerificationSummary(verdict);

    res.json({ ok: verdict.ok, summary, verdict });
  } catch (err) {
    console.error("Error verifying evidence:", (err as Error).message);
    res.status(500).json({ error: "Failed to verify evidence" });
  }
});

// ---------------------------------------------------------------------------
// Entry point — only listen when run directly, not when imported
// ---------------------------------------------------------------------------

// ESM equivalent of `if (require.main === module)`
const isMain =
  typeof process !== "undefined" &&
  process.argv[1] !== undefined &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (isMain) {
  const PORT = process.env["PORT"] !== undefined ? Number(process.env["PORT"]) : 3000;
  app.listen(PORT, () => {
    console.log(`MedTrace server running on http://localhost:${PORT}`);
  });
}
