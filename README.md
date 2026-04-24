# 🧠 DocMind AI: Production-Ready RAG Document Processor

**Author:** Adesina Mark Omoniyi

DocMind AI is a state-of-the-art, multi-tenant AI document processing platform. It leverages a **Retrieval-Augmented Generation (RAG)** architecture to allow users to upload complex documents (PDF, DOCX, TXT), extract deep insights, and query their content using natural language.

![DocMind AI Banner](https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2000&auto=format&fit=crop)

---

## 🚀 Core Capabilities

- **Intelligent Ingestion**: Asynchronous processing pipeline that extracts text, chunks content, and generates vector embeddings.
- **Semantic Search**: High-performance vector similarity search using **PostgreSQL (pgvector)**.
- **AI Chat & Grounding**: Natural language Q&A strictly grounded in your document's context using **Azure OpenAI (GPT-4o)**.
- **Premium UX**: A world-class dark mode interface with glassmorphism, fluid animations, and real-time status polling.
- **Secure Architecture**: Multi-tenant isolation with JWT-based authentication and secure cloud storage.

---

## 🏗️ Repository Structure

```bash
AIDocument/
├── backend/      # ASP.NET Core 10 Web API (Clean Architecture)
└── frontend/     # Next.js 15 + Tailwind CSS 4 + Framer Motion
```

### 🔙 [Backend](./backend)
Built with **.NET 10** following **Clean Architecture** principles:
- **Domain**: Pure business logic and entities.
- **Application**: Use cases, DTOs, and service orchestrators.
- **Infrastructure**: Azure OpenAI, Blob Storage, and DB implementations.
- **API**: RESTful controllers and Swagger documentation.

### 🔜 [Frontend](./frontend)
Built with **Next.js 15** for a premium user experience:
- **Design**: Custom CSS + Tailwind CSS 4 with a "World-Class" aesthetic.
- **Animations**: Framer Motion for high-fidelity transitions.
- **State**: Zustand for lightweight global auth and document state.
- **API**: Axios with centralized interceptors for secure communication.

---

## 🛠️ Technology Stack

| Layer | Technology |
| --- | --- |
| **Framework** | .NET 10 & Next.js 15 |
| **AI / LLM** | Azure OpenAI (GPT-4o & Text Embeddings) |
| **Database** | PostgreSQL + pgvector |
| **Storage** | Azure Blob Storage |
| **Styling** | Tailwind CSS 4 & Vanilla CSS |
| **Auth** | JWT (Custom implementation with BCrypt) |
| **Jobs** | Quartz.NET |

---

## 🏃 Getting Started

### 1. Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) (with pgvector extension)

### 2. Backend Setup
1. Navigate to `backend/AIDocument.Api`.
2. Update `appsettings.json` with your Azure and Database credentials.
3. Apply migrations: `dotnet ef database update`.
4. Run: `dotnet run`.

### 3. Frontend Setup
1. Navigate to `frontend`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.
4. Access at `http://localhost:3000`.

---

## 📄 Documentation
For detailed setup instructions, architecture diagrams, and API documentation, please refer to the individual READMEs:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

---

## 👤 Author
**Adesina Mark Omoniyi**
*Software Engineer & AI Solutions Architect*

---

## 🛡️ License
This project is licensed under the MIT License - see the LICENSE file for details.
