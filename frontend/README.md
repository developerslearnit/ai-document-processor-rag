# 🚀 DocMind AI Frontend

**Author:** Adesina Mark Omoniyi

A premium, world-class AI Document Processor built with **Next.js 15**, **Tailwind CSS 4**, and **Framer Motion**. This application leverages a sophisticated RAG (Retrieval-Augmented Generation) pipeline to enable natural language conversations with your documents.

---

## ✨ Key Features

- **Premium UI/UX**: State-of-the-art dark mode design with glassmorphism, smooth animations, and a highly responsive layout.
- **Secure Authentication**: Complete sign-up and sign-in flow powered by JWT and Zustand state management.
- **Intelligent Ingestion**: Drag-and-drop document upload (PDF, DOCX, TXT) with real-time processing status tracking.
- **Semantic Q&A**: Context-grounded chat interface with split-panel document summaries and deep analysis.
- **Document Dashboard**: Advanced document management system with filtering and search capabilities.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **HTTP Client**: [Axios](https://axios-http.com/) (with JWT interceptors)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root of the frontend directory and add your backend API URL:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5165/api
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```text
src/
├── app/             # Next.js App Router (Pages, Layouts, CSS)
│   ├── login/       # Authentication pages
│   ├── register/    # ...
│   ├── documents/   # Dashboard and Analysis pages
│   └── upload/      # Ingestion flow
├── components/      # Reusable UI components
├── lib/             # API configuration and utilities
│   └── api.ts       # Axios instance with Auth interceptors
└── store/           # Global state (Zustand)
    └── useAuthStore.ts
```

---

## 🔐 Security

This application implements industry-standard security practices:
- **JWT Persistence**: Tokens are securely stored and automatically injected into all API calls via Axios interceptors.
- **Route Protection**: Conditional rendering and middleware patterns ensure only authenticated users access sensitive data.
- **Data Isolation**: Multi-tenant architecture ensures your documents are only accessible to you.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
