# OmniCura CHW

An agentic clinical reasoning tool that gives India's 1 million ASHA workers the diagnostic support of a doctor, in the field, in real time.

Built for the FAR AWAY 2026 hackathon.

## The Problem

India has 1 million ASHA workers serving populations with no doctor within 40 km. They make life-or-death triage decisions daily with no decision support. The existing system fails them, and through them, 800 million rural Indians.

## What We Built

- Structured symptom intake designed for fast field use with minimal typing
- A five-step reasoning chain that checks danger signs before considering likely conditions
- Geography-aware disease context based on district and season
- An escalation engine that produces a clear referral decision and ASHA referral note
- A decision audit trail that records every assessment, timestamp, justification, and differential

## The Agentic Architecture

```text
Patient Input
    |
    v
[Symptom Intake]
    |
    v
[Geography Context Injection]
    |
    v
[Danger Sign Agent]
    |
    v
[Differential Agent]
    |
    v
[Action Agent]
    |
    v
[Escalation Agent]
    |
    v
[Referral Note Generator]
    |
    v
[Audit Logger]
```

The system checks WHO IMCI danger signs first. It then weighs the patient's symptoms, measured vitals, district, season, and the supplies available in the ASHA kit. Every result ends with an explicit `ESCALATE` or `MONITOR` decision.

## Tech Stack

- React 18
- Vite and Node.js serverless API routes
- Gemini 2.5 Flash
- Tailwind CSS
- Vercel

## Demo

[Video demo](demo-link)

Live application: [omnicura.vercel.app](https://omnicura.vercel.app)

## Impact

If deployed across India's 600,000 villages, this system could give every ASHA worker the equivalent of a clinical supervisor available 24/7, without requiring additional staff or changes to the ASHA worker's existing workflow.

The current prototype uses a cloud model and therefore requires an internet connection. Offline or low-connectivity deployment would require a local model or a store-and-forward workflow.

## Setup

### Requirements

- Node.js 18 or newer
- A Gemini API key

### Install

```bash
git clone https://github.com/thatshedesigner/OmniCura.git
cd OmniCura
npm install
```

Create a `.env.local` file:

```env
GEMINI_KEY=your_gemini_api_key
```

Do not prefix the key with `VITE_`. The key is read only by backend API routes and must not be exposed to client-side code.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Production

Add `GEMINI_KEY` to the Vercel project environment variables for Production and Preview, then redeploy.

## Safety

OmniCura CHW is a decision support prototype, not a diagnostic system. It prioritizes danger-sign detection, limits recommendations to available ASHA kit resources, and defaults to referral when information is incomplete or risk is high.

The current JSON audit store is suitable for demonstration only. A production deployment requires durable encrypted storage, access controls, consent handling, clinical validation, and review under applicable Indian health data and medical device requirements.
