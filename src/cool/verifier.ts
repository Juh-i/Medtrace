/**
 * CooL evidence verifier for MedTrace.
 *
 * Thin, honest wrappers around cool-nwc's verifyEvidence() and formatVerdict().
 * No results are invented — every status is taken directly from the verdict
 * returned by CooL's offline verifier.
 */

import { verifyEvidence, formatVerdict } from "cool-nwc";
import type { Verdict, DomainStatus } from "cool-nwc";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Flat summary of the seven CooL verification domains. */
export interface VerificationSummary {
  /** Overall pass/fail across all domains. */
  ok: boolean;
  /** Recomputed binding commitment matched the receipt. */
  binding: DomainStatus;
  /** Both ML-DSA-65 and Ed25519 signatures verified. */
  signature: DomainStatus;
  /** RFC 6962 Merkle inclusion proof is valid. */
  inclusion: DomainStatus;
  /** External witness co-signatures (none required in local mode). */
  witnesses: DomainStatus;
  /** Hardware attestation chain (simulated in local/dev mode). */
  attestation: DomainStatus;
  /** Key binding between the TEE quote and the signing key. */
  enclave: DomainStatus;
  /** Public-chain (Bitcoin OpenTimestamps) anchor. */
  anchor: DomainStatus;
  /** Human-readable detail strings for any failed or degraded domains. */
  reasons: readonly string[];
}

// ---------------------------------------------------------------------------
// Verifier
// ---------------------------------------------------------------------------

/**
 * Verify a piece of CooL evidence returned by `recordClinicalDecision`.
 *
 * Delegates entirely to the cool-nwc offline verifier — no network access
 * is required and nothing is invented. Problems surface as failed domains
 * inside the returned verdict rather than thrown exceptions.
 *
 * @param evidence A `cool.receipt.v2` value (from `cool.record()` or loaded
 *                 from a saved JSON file). Accepts `unknown` so callers can
 *                 pass raw parsed JSON safely.
 * @returns        The full structured `Verdict` from CooL.
 */
export async function verifyClinicalEvidence(evidence: unknown): Promise<Verdict> {
  return verifyEvidence(evidence);
}

/**
 * Flatten a CooL verdict into a simple summary object.
 *
 * Statuses are taken verbatim from the verdict — no mapping, no rounding.
 * Possible values per domain: "pass" | "fail" | "simulated" | "absent" |
 * "mock" | "pending".
 *
 * @param verdict The `Verdict` returned by `verifyClinicalEvidence`.
 */
export function getVerificationSummary(verdict: Verdict): VerificationSummary {
  const { checks } = verdict;
  return {
    ok: verdict.ok,
    binding: checks.binding.status,
    signature: checks.signature.status,
    inclusion: checks.inclusion.status,
    witnesses: checks.witnesses.status,
    attestation: checks.attestation.status,
    enclave: checks.enclave.status,
    anchor: checks.anchor.status,
    reasons: verdict.reasons,
  };
}

/**
 * Render a verdict as a plain-ASCII human-readable block.
 *
 * Delegates to CooL's `formatVerdict()` — suitable for logs and CLI output.
 *
 * @param verdict The `Verdict` returned by `verifyClinicalEvidence`.
 * @returns       A multi-line ASCII string, e.g.:
 *
 *   +----------------------------------------------------------+
 *   | OK  binding      valid                                   |
 *   | OK  signature    valid                                   |
 *   | ~   attestation  simulated                               |
 *   +----------------------------------------------------------+
 *   | RESULT      VERIFIED                                     |
 */
export function formatClinicalVerdict(verdict: Verdict): string {
  return formatVerdict(verdict);
}
