/**
 * MedTrace decision service.
 *
 * Connects the simulated clinical decision engine to the CooL evidence
 * recorder. This is the single function the Express layer will call —
 * it keeps routing concerns out of both the engine and the recorder.
 *
 * DEMO / HACKATHON PROTOTYPE — fictional data only.
 * No real patient data must ever be passed to this function.
 */

import { clinicalDecision } from "../clinical/decisionEngine.js";
import type { PatientCase, ClinicalDecision } from "../clinical/decisionEngine.js";
import { recordClinicalDecision } from "../cool/recorder.js";
import type { EvidenceResult } from "cool-nwc";

// ---------------------------------------------------------------------------
// Result type
// ---------------------------------------------------------------------------

/** Structured result returned by processClinicalDecision(). */
export interface DecisionResult {
  /** The fictional patient case that was submitted. */
  patient: PatientCase;
  /** The decision produced by the simulated engine. */
  clinicalDecision: ClinicalDecision;
  /** The sealed CooL receipt — self-contained, offline-verifiable. */
  evidence: EvidenceResult["evidence"];
  /** ULID uniquely identifying this evidence record. */
  recordId: string;
  /** Session identifier grouping related evidence records. */
  executionId: string;
  /** Binding commitment (mh:sha256:…) over the sealed record core. */
  digest: EvidenceResult["digest"];
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Run the simulated clinical decision engine and seal the result as
 * tamper-evident CooL evidence.
 *
 * Steps:
 *   1. Generate a stable execution ID for this request.
 *   2. Evaluate the deterministic demo rule engine.
 *   3. Seal the decision (metadata + sensitive payloads) via CooL.
 *   4. Return the structured result to the caller.
 *
 * Patient input and AI output are passed as CooL payloads — they are
 * committed as salted hashes and discarded. They never appear in the
 * receipt or in any log.
 *
 * DEMO ONLY — fictional patient data, not for clinical use.
 */
export async function processClinicalDecision(
  patient: PatientCase,
): Promise<DecisionResult> {
  // 1. Stable ID that groups all evidence records for this request.
  const executionId = crypto.randomUUID();

  // 2. Run the deterministic demo rule engine.
  const decision = clinicalDecision(patient);

  // 3. Seal the decision as CooL evidence.
  //    - Non-sensitive fields go into metadata (queryable, auditable).
  //    - patient + decision objects go into payloads (hashed, discarded).
  const result = await recordClinicalDecision({
    modelName: decision.modelName,
    modelVersion: decision.modelVersion,
    decision: decision.risk,
    recommendation: decision.recommendation,
    confidence: decision.confidence,
    patientInput: JSON.stringify(patient),   // sensitive — committed as hash
    aiOutput: JSON.stringify(decision),      // sensitive — committed as hash
    executionId,
  });

  // 4. Return the structured result. Patient data is intentionally included
  //    so the API layer can echo it back to the caller for demo purposes,
  //    but it is never logged or stored beyond this in-memory object.
  return {
    patient,
    clinicalDecision: decision,
    evidence: result.evidence,
    recordId: result.recordId,
    executionId: result.executionId,
    digest: result.digest,
  };
}
