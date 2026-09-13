# MedTrace 🔐🩺

> A clinical AI accountability prototype using cryptographic receipts to record, verify, and detect tampering in AI-generated clinical decisions.

## 🚨 Disclaimer

**Demo / Not for clinical use.**

MedTrace is a hackathon prototype using fictional patient data. It is not a medical device and must not be used to make real clinical decisions.

## 💡 Problem

AI systems can make important clinical decisions, but it can be difficult to prove exactly what happened after a decision was generated.

MedTrace creates a verifiable cryptographic record of an AI decision so that later verification can detect whether the recorded evidence has been altered.

## 🎯 Solution

**Clinical AI Decision → CooL Receipt → Cryptographic Verification → Tamper Detection**

## ✨ Current Features

* Simulated clinical AI decision engine
* CooL cryptographic evidence recording
* Evidence receipt generation
* Cryptographic verification
* Binding verification
* Signature verification
* Merkle inclusion verification
* REST API endpoints for decisions and verification

## 🛠️ Tech Stack

* Node.js
* TypeScript
* Express
* CooL SDK (`cool-nwc`)
* CORS

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npx tsx src/server.ts
```

The server runs at:

`http://localhost:3000`

### 3. Health Check

```text
GET /api/health
```

### 4. Create a Clinical AI Decision

```text
POST /api/decision
```

Example request:

```json
{
  "age": 67,
  "chestPain": true,
  "fatigue": true,
  "hypertension": true
}
```

### 5. Verify Evidence

```text
POST /api/verify
```

Provide the returned CooL evidence receipt to verify it.

## 🔐 Important Note About Verification

CooL verification proves the integrity and authenticity of the recorded evidence.

It **does not prove that the AI's medical decision is correct, safe, unbiased, or clinically appropriate.**

Attestation and enclave status in this prototype may be simulated locally and should not be interpreted as production hardware-backed attestation.

## 🗺️ Roadmap

* [x] Clinical decision engine
* [x] CooL receipt creation
* [x] Cryptographic verification
* [x] REST API
* [ ] Persistent receipt storage
* [ ] Tamper simulation
* [ ] Frontend dashboard
* [ ] Evidence timeline
* [ ] Final demo polish

## 👥 Team

Built as a hackathon prototype.

## 📄 License

To be decided.



