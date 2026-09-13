# MedTrace 🔐🩺

> A clinical AI accountability prototype using cryptographic receipts to record, verify, and detect tampering in AI-generated clinical decisions.

## 🚨 Disclaimer

**Demo / Not for clinical use.**

MedTrace is a hackathon prototype using fictional patient data. It is not a medical device and must not be used to make real clinical decisions.

## 💡 Problem

AI systems can make important clinical decisions, but it can be difficult to prove exactly what happened after a decision was generated.

MedTrace creates a verifiable cryptographic record of an AI decision so that later verification can detect whether the recorded evidence has been altered.

## 🎯 Solution

MedTrace demonstrates:

**Clinical AI Decision → CooL Receipt → Cryptographic Verification → Tamper Detection**

The prototype records decision metadata and evidence commitments using the CooL SDK and verifies the resulting receipt.

## ✨ Current Features

- Simulated clinical AI decision engine
- CooL cryptographic evidence recording
- Evidence receipt generation
- Cryptographic verification
- Binding verification
- Signature verification
- Merkle inclusion verification
- Simulated attestation/enclave status
- REST API endpoints for decisions and verification

## 🛠️ Tech Stack

- Node.js
- TypeScript
- Express
- CooL SDK (`cool-nwc`)
- CORS

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
