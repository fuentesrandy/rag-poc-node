# AI Chat Application

A full-stack AI chat application that features RAG (Retrieval Augmented Generation) capabilities, allowing users to chat with an AI that has context from uploaded documents.

## Features

- Simple chat interface with AI
- Document upload and processing
- RAG-powered responses using uploaded documents as context


## Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript


### Backend
- NestJS
- TypeScript
- Vector database for document embeddings Postgres
- OpenAI integration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Azure OpenAI API key

### Installation

To install all dependencies for both backend and frontend:

**Unix/Linux/macOS:**
```bash
./install.sh
```

**Windows:**
```cmd
install.bat
```

This will install all required dependencies for both the NestJS backend and Next.js frontend.

### Starting the Database

Start the PostgreSQL database with pgvector extension:

```bash
docker-compose -f docker-compose-db.yml up -d
```

This will start a PostgreSQL database with pgvector extension on port 54369.

### Running the Application

To start both backend and frontend in development mode:

**Unix/Linux/macOS:**
```bash
./dev.sh
```

**Windows:**
```cmd
./dev.bat
```

This will start:
- Backend (NestJS) in development mode
- Frontend (Next.js) in development mode

Both services will run in the background. You can access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001 (or the port configured in your backend)

