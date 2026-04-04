# ⚖️ Code Verdict  
**AI-Powered Code Review Assistant**

---

## 🚀 Live Demo  
https://codeverdict-r1ac.onrender.com/dashboard

---

## 📌 Overview  

**Code Verdict** is an intelligent, AI-powered code review platform designed to automate and enhance the pull request review process. It integrates seamlessly with GitHub repositories to analyze code changes, provide contextual feedback, and help developers maintain high-quality code standards efficiently.

By leveraging advanced LLMs and Retrieval-Augmented Generation (RAG), Code Verdict understands not just code differences but the entire codebase context.

---

## ✨ Key Features  

- 🤖 **AI-Powered Code Reviews**  
  Uses advanced LLMs (via Vercel AI SDK) to generate meaningful and actionable feedback on pull requests.

- 🧠 **Context-Aware Analysis (RAG)**  
  Integrates Pinecone with RAG to understand full repository context instead of isolated diffs.

- 🔗 **GitHub Integration**  
  Connect repositories and automatically track pull requests.

- 📊 **Interactive Dashboard**  
  Visualize repository activity, review history, and insights.

- 💳 **Subscription Management**  
  Integrated with Polar.sh for billing, plans, and usage limits.

- ⚡ **Real-time Processing**  
  Uses Inngest for background jobs and event-driven workflows.

---

## 🛠️ Tech Stack  

| Category            | Technology |
|--------------------|-----------|
| **Framework**       | Next.js 16 (App Router) |
| **Language**        | TypeScript |
| **Styling**         | Tailwind CSS v4 |
| **UI Components**   | Shadcn UI, Radix UI, Lucide React |
| **Database**        | PostgreSQL (Prisma ORM) |
| **Authentication**  | Better Auth |
| **AI & Vector DB**  | Vercel AI SDK, Pinecone |
| **Background Jobs** | Inngest |
| **Payments**        | Polar.sh |

---

## 🏁 Getting Started  

### ✅ Prerequisites  

- Node.js (v18+)  
- npm / pnpm / bun  
- PostgreSQL  
- GitHub OAuth App  
- Pinecone API Key  
- Google Gemini API Key  


### ⚙️ Installation 
npm install
# or
pnpm install
# or
bun install

#### 1️⃣ Clone the Repository  

```bash
git clone https://github.com/your-username/code-verdict.git
cd code-verdict

🔐 Environment Variables

Create a .env file in the root directory:

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/code_verdict?schema=public"

# Authentication
BETTER_AUTH_SECRET="your_secret_key"
BETTER_AUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# AI (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY="your_google_api_key"

# Pinecone
PINECONE_API_KEY="your_pinecone_api_key"

# Inngest
INNGEST_EVENT_KEY="your_inngest_event_key"
INNGEST_SIGNING_KEY="your_inngest_signing_key"

# Payments
POLAR_ACCESS_TOKEN="your_polar_access_token"
🗄️ Database Setup
npx prisma generate
npx prisma migrate dev
▶️ Run Development Server
npm run dev

Visit 👉 http://localhost:3000

⚡ Run Inngest Dev Server
npx inngest-cli@latest dev
🧠 Architecture

For a deeper understanding of system design and data flow, refer to:

ARCHITECTURE.md
🤝 Contributing

Contributions are welcome! 🚀

# Fork the repo
# Create your branch
git checkout -b feature/AmazingFeature

# Commit changes
git commit -m "Add AmazingFeature"

# Push
git push origin feature/AmazingFeature

Then open a Pull Request.

📄 License

This project is licensed under the MIT License.


