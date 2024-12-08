# Wolfie Tutor: AI-Driven SAT Math Tutor

Wolfie Tutor is an innovative project designed to assist students in their SAT Math preparation. This repository contains the source code for the project, providing features like Similar Question generation and Question Breakdown to enhance learning.

## Original Source

This project was originally developed as part of a coursework submission at Stony Brook University. The repository is available on GitHub:

- [Original Repository URL](https://github.com/dkadur/ai-tutor)

## Modified Files

The following files have been modified or created for the project:

- **app/**: Contains the main Next.js app logic.
  - Key components added: `BreakdownComponent.tsx`, `SimilarQuestionComponent.tsx`.
- **components/**: Modular React components used across the app.
  - Modified: `QuestionCard.tsx` (to handle SAT Math questions dynamically).
- **hooks/**: Custom hooks for state and API interactions.
  - Added: `useQuestionContext.ts` (handles user interactions with AI tutor).
- **server/**: Contains backend APIs for question generation and breakdown.
  - Added: `questionService.ts` (main service for handling AI API calls).
- **types/**: TypeScript types for better type safety.
  - Modified: `QuestionType.ts` (extended for AI tutor-specific needs).
- **middleware.ts**: Added custom middleware to handle API requests.

## Training and Testing Commands

Follow these steps to train and test the system:

1. Install dependencies:
   npm install
2. Run the development server:
   npm run dev
3. Test the application:
   npm test
4. Build for production:
   npm run build
5. Start the production server:
   npm start


## Trained Models Used: This project primarily uses pretrained models like GPT-4o-mini, Gemini, and xAI Grok. No additional model training was conducted in this repository.

Datasets Used: SAT Math section questions sourced from publicly available datasets.

Links to Models and Data:

OpenAI GPT-4o-mini
Gemini AI
xAI Grok

Prompts are stored at: apps/next/components/ui/assistant-ui/thread.tsx

## Software Requirements
Node.js >= 16.0.0
npm >= 8.0.0
Next.js >= 13.0.0
Tailwind CSS >= 3.0.0
TypeScript >= 4.5.0
Prisma >= 4.0.0
Database: PostgreSQL >= 13.0.0
AI SDKs:

OpenAI SDK
Google Gemini API
xAI API


## Getting Started

Clone the repository:
git clone https://github.com/dkadur/ai-tutor.git

Navigate to the project directory:
cd ai-tutor

Install dependencies:
npm install

Start the development server:
npm run dev

Access the app in your browser:
http://localhost:3000