/**
 * CooL evidence recorder for MedTrace.
 *
 * Wraps the cool-nwc client and exposes a single typed function for sealing
 * clinical AI decision evidence. Sensitive payloads (patient input, AI output)
 * are committed as salted hashes by CooL and never stored in the receipt.
 */

import { CooL } from "cool-nwc";
import type { EvidenceResult } from "cool-nwc";

// A single shared client — construction does no I/O.
// The evidence plane connects on the first call to record().
export const cool = new CooL({ applicationId: "medtrace" });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ClinicalDecisionInput {
  /** Name of the AI model that produced the decision, e.g. "DiagnosisGPT". */
  modelName: string;
  /** Semver or build tag of the model, e.g. "2.1.0". */
  modelVersion: string;
  /** Short label for the clinical decision, e.g. "Possible Type-2 Diabetes". */
  decision: string;
  /** The model's recommendation, e.g. "Refer to endocrinologist". */
  recommendation: string;
  /** Confidence score in the range [0, 1]. */
  confidence: number;
  /**
   * Fictional patient input fed to the model.
   * Treated as a sensitive payload — committed as a salted hash, never stored.
   */
  patientInput: string;
  /**
   * Raw AI output returned by the model.
   * Treated as a sensitive payload — committed as a salted hash, never stored.
   */
  aiOutput: string;
  /**
   * Stable session or request identifier that groups related evidence records.
   * Defaults to a fresh ULID if omitted.
   */
  executionId?: string;
}

// ---------------------------------------------------------------------------
// Recorder
// ---------------------------------------------------------------------------

/**
 * Seal a clinical AI decision as tamper-evident evidence via CooL.
 *
 * Non-sensitive decision metadata (model identity, decision label,
 * recommendation, confidence) is committed inside the evidence record.
 * Sensitive payloads (patientInput, aiOutput) are committed as salted SHA-256
 * hashes and discarded — the receipt never carries plaintext.
 *
 * @returns The full EvidenceResult from cool.record(), including the receipt,
 *          recordId, executionId, and binding digest.
 */
export async function recordClinicalDecision(
  input: ClinicalDecisionInput,
): Promise<EvidenceResult> {
  const {
    modelName,
    modelVersion,
    decision,
    recommendation,
    confidence,
    patientInput,
    aiOutput,
    executionId,
  } = input;

  return cool.record({
    type: "clinical.ai.decision",

    // Groups related records (e.g. a full diagnostic session) under one id.
    ...(executionId !== undefined ? { executionId } : {}),

    // Non-sensitive metadata sealed into the evidence record.
    metadata: {
      model: modelName,
      modelVersion,
      decision,
      recommendation,
      confidence,
      recordedAt: new Date().toISOString(),
    },

    // Sensitive payloads — CooL commits these as salted hashes and discards
    // the plaintext. The salts are stored alongside the commitments so an
    // auditor can later verify a disclosed value against the sealed record.
    payloads: {
      input: patientInput,
      output: aiOutput,
    },

    // Software identity stamped into every receipt.
    software: {
      name: "medtrace",
      version: "1.0.0",
      digest: null,
    },
  });
}
