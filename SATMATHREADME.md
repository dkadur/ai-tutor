# Wolfie Tutor: AI-Driven SAT Math Tutor

Wolfie Tutor is an innovative project designed to assist students in their SAT Math preparation. This repository contains the source code for the project, providing features like **Similar Question Generation** and **Question Breakdown** to enhance learning.

---

## 📂 Project Structure

### **Modified Files**
The following files have been modified or created for the project inside the `apps/next` folder:

- **`app/`**: Contains the main Next.js application logic.
- **`app/components/`**: Modular React components used throughout the app.
- **`hooks/`**: Custom hooks for managing state and API interactions.
- **`server/`**: Backend APIs for question generation and breakdown features.
- **`types/`**: TypeScript types to ensure type safety across the codebase.
- **`middleware.ts`**: Custom middleware added to handle API requests.

---

## 🛠️ Testing

Follow these steps to train and test the system:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Test the application:
   ```bash
   npm test
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

---

## 🤖 Trained Models Used

This project primarily uses pretrained models like GPT-4o-mini, Gemini, and xAI Grok. No additional model training was conducted in this repository.

Prompts are stored at: `apps/next/components/ui/assistant-ui/thread.tsx`

---

## 🖥️ Software Requirements

- Node.js >= 16.0.0
- npm >= 8.0.0
- Next.js >= 13.0.0
- Tailwind CSS >= 3.0.0
- TypeScript >= 4.5.0
- Prisma >= 4.0.0
- Database: PostgreSQL >= 13.0.0
- AI SDKs:
  - OpenAI SDK
  - Google Gemini API
  - xAI API

---

## 🚀 Getting Started

Clone the repository:
```bash
git clone https://github.com/dkadur/ai-tutor.git
```

Navigate to the project directory:
```bash
cd ai-tutor/next
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
