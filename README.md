# SiftPact

SiftPact is an AI-powered legal contract analysis platform built for Indian freelancers, consultants, and small-business teams. It reviews uploaded contracts for risky clauses, compares them against Indian Contract Act principles, explains issues in plain English or Hindi, and provides a risk score from 0 to 100.

The project combines document extraction, clause parsing, semantic matching, legal rule validation, and explainable AI to give users a fast first-pass legal review before they sign a contract.

## Project Vision

Most freelancing and consulting agreements are drafted by clients or agencies and are not always fair to the contractor. SiftPact helps users answer questions like:

- Is this clause enforceable under Indian law?
- Is this a red flag for a freelancer?
- What does this clause really mean in practice?
- What should I negotiate before signing?

The platform focuses on Indian legal context, not US-style contract assumptions, and is designed to be practical for Indian users.

## Features

- Contract upload support for PDF, DOCX, TXT, PNG, JPG, and JPEG
- OCR support for scanned contracts and images using Tesseract
- Clause extraction and paragraph segmentation
- Keyword and regex-based legal violation detection
- Semantic similarity detection using ChromaDB vector search
- Indian Contract Act section mapping
- Risk scoring with business-facing explanations
- Plain-language and Hindi-friendly legal summaries
- Contract drafting and template support
- Dashboard for saved analyses and document history
- Authenticated user flow with Clerk
- Privacy-oriented processing for uploaded documents

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript
- Styling: Tailwind CSS
- Authentication: Clerk
- Database: SQLite for metadata and legal knowledge, Prisma optional for user data
- Vector store: ChromaDB
- AI / inference: Hugging Face Inference API (with token fallback)
- OCR: Tesseract.js
- Document parsing: pdf-parse, mammoth
- PDF export: Puppeteer / custom export flow

## Core Workflow

1. User uploads a contract file
2. The backend extracts text from PDF, DOCX, TXT, or OCR image input
3. The text is segmented into clauses and paragraphs
4. Rules are checked against Indian Contract Act patterns and legal keyword logic
5. Semantic search looks for semantically similar risky clauses
6. Results are merged, deduplicated, and scored
7. The system explains the risk in simple language and highlights the affected sections
8. Results are displayed in the dashboard or contract result view

## High-Level Architecture

```text
User Upload
   ↓
Next.js App (Frontend + API Routes)
   ↓
Text Extraction Layer
   ├─ PDF / DOCX / TXT parsing
   ├─ OCR for images
   └─ File validation
   ↓
Clause Parsing + Rule Matching
   ├─ Indian law validator
   ├─ Semantic validator (ChromaDB)
   ├─ Deviation checker
   └─ Risk scorer
   ↓
AI Explanation Layer
   ├─ Hugging Face inference
   └─ fallback templates
   ↓
UI Output / Saved Analysis
```

## Repository Structure

```text
aiLegal-main/
├── app/
│   ├── actions/
│   ├── api/
│   ├── create-contract/
│   ├── dashboard/
│   ├── onboarding/
│   ├── result/
│   ├── sign-in/
│   ├── sign-up/
│   ├── layout.tsx
│   ├── page.tsx
│   └── report/
├── components/
│   ├── analysis/
│   ├── contract/
│   ├── email/
│   ├── landing/
│   ├── layout/
│   └── ui/
├── data/
├── lib/
│   ├── db/
│   ├── services/
│   ├── types/
│   └── utils/
├── public/
├── scripts/
├── README.md
├── explaination.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── middleware.ts
├── .env.example (if present in your environment)
└── node_modules/
```

## Environment Setup

Create a `.env.local` or `.env` file with the required configuration.

```env
# App
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_PATH=./data/legal_knowledge.db
DATABASE_URL="file:./dev.db"

# ChromaDB
CHROMA_API_KEY=your_chroma_key
CHROMA_TENANT=your_tenant
CHROMA_DATABASE=your_database_name
CHROMA_COLLECTION=clause_patterns

# Hugging Face
HF_TOKEN=your_huggingface_token
HF_TOKEN1=your_secondary_huggingface_token

# Optional app config
NODE_ENV=development
```

## Installation

```bash
git clone https://github.com/shreyavni/SiftPact.git
cd SiftPact
npm install
```

## Initialization

```bash
npm run seed
npm run generate-embeddings
npm run dev
```

Then open:

- http://localhost:3000

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run seed
npm run seed:enhanced
npm run generate-embeddings
npm run check-db
npm run lint
```

## Important Notes About the Legal Analysis

This app is designed as a screening and education tool, not a substitute for professional legal advice. It helps flag clauses that commonly raise issues under Indian contract principles such as:

- Section 27: restraint of trade / non-compete issues
- Section 23: unlawful object or public-policy issues
- Liability and penalty concerns
- Unilateral termination / unfair payment terms
- Excessive IP ownership claims
- Foreign jurisdiction or unfair dispute clauses

The tool is intentionally oriented around Indian law, freelance realities, and practical commercial risk.

## Data Flow

```text
File upload
  ↓
Validation (type / size / auth)
  ↓
Text extraction (PDF / DOCX / TXT / OCR)
  ↓
Clause parsing
  ↓
Rule evaluation
  ├─ keyword / regex rules
  ├─ semantic similarity rules
  ├─ deviation checks
  └─ legal section mapping
  ↓
Risk scoring and risk-level classification
  ↓
AI explanation generation
  ↓
Dashboard / result page / saved history
```

## Example Risk Categories

- CRITICAL: signs of void or highly risky clauses, including restraint of trade and illegal-object issues
- HIGH: excessive liability, penalty, or IP overreach
- MEDIUM: termination, delay, or jurisdiction issues
- LOW: minor ambiguity or generic drafting risk

## Security and Privacy

- Uploaded files are processed in the app flow and not treated as long-term storage by default
- Analysis is designed to be privacy-conscious
- User history can be saved in the authenticated dashboard when configured
- API keys and environment secrets must be kept local and not committed publicly

## Contribution Guidelines

Contributions are welcome for:

- improving legal rule coverage
- refining clause detection
- adding better Hindi legal explanations
- improving UI clarity and analytics
- adding broader Indian law scenarios

## License

This project is a local educational and product prototype. Check your repository or project policy for the formal license before public deployment.

## Disclaimer

This tool is for educational and risk-aware review purposes only. It does not replace a lawyer, and it should not be treated as legal advice. Users should confirm legal interpretation with qualified counsel before signing important agreements.
