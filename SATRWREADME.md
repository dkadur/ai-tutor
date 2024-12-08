## Specifications

1. This is the original source for the codebase
2.
   - `apps/next/` contains all the folders/files for the Next.js frontend/backend
     - `app/` contains the main layout files for frontend
     - `components/` contains all the React components for frontend (question layout, answer choices, crossout, etc.) & assistant-ui chatbot interface (https://www.assistant-ui.com/) & shadcn components that we customized (https://ui.shadcn.com/)
     - `server/` contains all the server functions for getting/saving exam/question data in Supabase via Prisma (https://www.prisma.io/)
   - `packages/` contains the files for the database structure (we used Prisma to easily query the Supabase db with TypeScript functions) & types for type safety
3. We performed evaluations by having tutors utilize the chatbot interface for each question and providing their ratings for the 4 key metric discussed in the paper
4. We used pre-trained transformers so there was no training.
5. Walkthrough prompt: [walkthrough-prompt.txt](https://github.com/user-attachments/files/18053452/walkthrough-prompt.txt) - prompting was done in `apps/next/components/ui/assistant-ui/thread.tsx`
6. Software needed to run the system
   - Node.js >= 16.0.0
7. Main technologies used
   - Next.js (frontend/backend)
   - Supabase (database to store exams and questions) (https://supabase.com/)
   - Prisma (query Supabase with TypeScript functions instead of SQL)
   - assistant-ui (UI components for chatbot interface)
   - AI Vercel SDK (used to access API for `gpt-4o-mini`, `gemini-1.5-pro`, and `grok-beta` models) (https://sdk.vercel.ai/)

## Running the system (requires environment variables)

Clone the repository:
```bash
git clone https://github.com/dkadur/ai-tutor.git
```

Navigate to the project directory:
```bash
cd ai-tutor
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run next
```

Access the app in your browser:
[http://localhost:3000](http://localhost:3000)
