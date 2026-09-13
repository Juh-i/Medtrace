/**
 * MedTrace simulated clinical decision engine.
 *
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  DEMO / HACKATHON PROTOTYPE — NOT FOR CLINICAL USE              ║
 * ║                                                                  ║
 * ║  This file contains fictional, deterministic rule logic for     ║
 * ║  demonstration purposes only. It does NOT constitute medical    ║
 * ║  advice, diagnosis, or treatment. It must never be used in      ║
 * ║  real clinical settings or with real patient data.              ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

/** Fictional patient case used as input to the demo decision engine. */
export interface PatientCase {
  /** Patient age in years. */
  age: number;
  /** Whether the patient reports chest pain. */
  chestPain: boolean;
  /** Whether the patient reports significant fatigue. */
  fatigue: boolean;
  /** Whether the patient has a documented hypertension diagnosis. */
  hypertension: boolean;
}

/** Output produced by the demo decision engine for a given patient case. */
export interface ClinicalDecision {
  /** Assessed risk level: HIGH or LOW. */
  risk: "HIGH" | "LOW";
  /** Plain-language recommendation for the fictional case. */
  recommendation: string;
  /** Model confidence score in the range [0, 1]. */
  confidence: number;
  /** Name of the fictional AI model. */
  modelName: string;
  /** Version of the fictional AI model. */
  modelVersion: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Fictional model identity stamped into every decision.
 * "CardioAssist" does not exist; this name is for demo purposes only.
 */
const MODEL_NAME = "CardioAssist";
const MODEL_VERSION = "3.2.1";

// ---------------------------------------------------------------------------
// Decision engine
// ---------------------------------------------------------------------------

/**
 * Produce a fictional clinical decision for the supplied patient case.
 *
 * DEMO LOGIC ONLY — deterministic rule engine for hackathon demonstration.
 * These rules are not medically validated and must not inform real decisions.
 *
 * Rule:
 *   If chestPain === true AND age > 60 AND hypertension === true
 *     → HIGH risk, immediate cardiac evaluation (confidence 0.94)
 *   Otherwise
 *     → LOW risk, routine follow-up (confidence 0.81)
 */
export function clinicalDecision(patient: PatientCase): ClinicalDecision {
  const isHighRisk =
    patient.chestPain === true &&
    patient.age > 60 &&
    patient.hypertension === true;

  if (isHighRisk) {
    return {
      risk: "HIGH",
      recommendation: "Immediate cardiac evaluation",
      confidence: 0.94,
      modelName: MODEL_NAME,
      modelVersion: MODEL_VERSION,
    };
  }

  return {
    risk: "LOW",
    recommendation: "Routine follow-up",
    confidence: 0.81,
    modelName: MODEL_NAME,
    modelVersion: MODEL_VERSION,
  };
}
