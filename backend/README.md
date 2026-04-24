# 🧠 DocMind AI Backend

**Author:** Adesina Mark Omoniyi

The robust, enterprise-grade backend for the AI Document Processor, built with **.NET 10** using **Clean Architecture** principles. This service powers the RAG (Retrieval-Augmented Generation) pipeline, document ingestion, and secure user authentication.

---

## 🚀 Features

- **Clean Architecture**: Separation of concerns across Domain, Application, Infrastructure, and API layers.
- **RAG Pipeline**: Complete document ingestion flow including text extraction, AI summarization, and vector embedding generation.
- **Vector Search**: High-performance semantic search using **PostgreSQL** with the `pgvector` extension.
- **Background Processing**: Reliable asynchronous document processing powered by **Quartz.NET**.
- **Secure Auth**: Custom JWT-based authentication system with **BCrypt** password hashing and multi-tenant data isolation.
- **Azure OpenAI Integration**: Leverages state-of-the-art models for embeddings (text-embedding-ada-002) and chat completions (GPT-4).

---

## 🛠️ Technology Stack

- **Runtime**: [.NET 10](https://dotnet.microsoft.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) + [pgvector](https://github.com/pgvector/pgvector)
- **ORM**: [Entity Framework Core 10](https://learn.microsoft.com/en-us/ef/core/)
- **AI Services**: [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service)
- **Job Scheduling**: [Quartz.NET](https://www.quartz-scheduler.net/)
- **Storage**: [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs/)

---

## 🏗️ Architecture Layers

1.  **Domain**: Core entities (User, Document, DocumentChunk), interfaces, and business logic.
2.  **Application**: Data Transfer Objects (DTOs) and service abstractions.
3.  **Infrastructure**: Implementation of external services (Azure OpenAI, Blob Storage, DB Context), migrations, and background jobs.
4.  **API**: RESTful controllers, middleware, and dependency injection configuration.

---

## 🏃 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [PostgreSQL](https://www.postgresql.org/download/) (with pgvector installed)
- [Azure OpenAI Service](https://azure.microsoft.com/en-us/products/ai-services/openai-service) instance

### Configuration

Update `AIDocument.Api/appsettings.json` with your credentials:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=AIDocumentDb;Username=postgres;Password=your_password"
  },
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "ApiKey": "your-api-key",
    "EmbeddingDeploymentName": "text-embedding-ada-002",
    "ChatDeploymentName": "gpt-4"
  },
  "AzureBlobStorage": {
    "ConnectionString": "your-storage-connection-string",
    "ContainerName": "documents"
  },
  "Jwt": {
    "Key": "your-super-secret-key-at-least-32-chars",
    "Issuer": "DocMindAI",
    "Audience": "DocMindAI-Frontend"
  }
}
```

### Setup & Run

1.  **Apply Database Migrations**:
    ```bash
    dotnet ef database update -p AIDocument.Infrastructure -s AIDocument.Api
    ```

2.  **Run the application**:
    ```bash
    dotnet run --project AIDocument.Api
    ```

3.  **Explore the API**:
    Navigate to `http://localhost:5165/swagger` to view the interactive API documentation.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate and receive JWT

### Documents
- `POST /api/documents/upload` - Upload and start processing (Multipart/Form-Data)
- `GET /api/documents` - List all user documents
- `GET /api/documents/{id}/status` - Check ingestion progress and get AI summary
- `POST /api/documents/{id}/chat` - Ask questions about a specific document

---

## 📄 License

This project is licensed under the MIT License.
