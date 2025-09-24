# 📚 BCA Notes AI - Project Context

## 📌 Project Overview

**BCA Notes AI** is a comprehensive educational platform designed for BCA (Bachelor of Computer Applications) students in Nepal. The project combines a modern web application with an AI-powered question-answering system to provide students with easy access to syllabus content, question papers, and intelligent academic assistance.

### 🎯 Core Purpose

- **Digital Repository**: Centralized storage and management of BCA syllabus and question papers
- **AI-Powered Learning**: Intelligent Q&A system using RAG (Retrieval-Augmented Generation)
- **User Management**: Role-based access control for students and administrators
- **Modern UI/UX**: Responsive web interface built with React and Tailwind CSS

### 🏛️ Architecture

The project consists of two main components:

1. **Frontend/Backend Web Application** (`@bca_notes_ai/`) - Laravel + React
2. **AI Engine** (`@ai_engine/`) - FastAPI + LlamaIndex + Ollama

---

## 🏗️ Components Breakdown

### 🔧 @bca_notes_ai/ (Laravel + React Frontend/Backend)

**Technology Stack:**

- **Backend**: Laravel 12.x (PHP 8.2+)
- **Frontend**: React 19.x + TypeScript + Inertia.js
- **Styling**: Tailwind CSS 4.x + Radix UI Components
- **Database**: PostgreSQL with pgvector extension
- **Authentication**: Laravel Breeze with Inertia
- **Build Tool**: Vite 6.x

**Key Features:**

- User authentication and role-based access control
- Syllabus and question paper management
- Admin dashboard for content management
- Responsive design with dark/light mode
- File upload and storage system

### 🤖 @ai_engine/ (FastAPI + LlamaIndex + Ollama AI Engine)

**Technology Stack:**

- **API Framework**: FastAPI (Python 3.11+)
- **RAG Framework**: LlamaIndex 0.10.20 + LlamaIndex Core 0.13.0
- **LLM**: Ollama with Phi model
- **Vector Database**: PostgreSQL with pgvector
- **Embeddings**: HuggingFace sentence-transformers
- **Similarity Algorithm**: Cosine Similarity

**Key Features:**

- Document embedding and vector storage
- Semantic search using cosine similarity
- Context-aware question answering
- Support for both syllabus and question paper queries
- RESTful API for integration

---

## ✅ Completed Tasks

### @bca_notes_ai/ (Laravel + React)

#### 🗄️ Database & Models

- ✅ User authentication system with role-based access
- ✅ Semester management (8 semesters)
- ✅ Syllabus storage and management
- ✅ Question paper storage and management
- ✅ Resource upload system
- ✅ Vector storage tables (pdf_vectors, question_vectors)

#### 🔐 Authentication & Authorization

- ✅ Laravel Breeze authentication
- ✅ Role-based middleware (admin/user)
- ✅ Email verification system
- ✅ Password reset functionality
- ✅ Profile management

#### 🎨 Frontend Components

- ✅ Modern UI with Tailwind CSS and Radix UI
- ✅ Responsive design with mobile support
- ✅ Dark/light mode toggle
- ✅ Admin dashboard interface
- ✅ Syllabus and question paper viewers
- ✅ File upload components
- ✅ User management interface

#### 🛣️ Routing & Controllers

- ✅ RESTful API endpoints
- ✅ Admin-only routes with middleware
- ✅ Public academic content routes
- ✅ Chat integration with AI engine
- ✅ File upload and management

#### 📱 Pages & Features

- ✅ Welcome page
- ✅ Dashboard for admins
- ✅ Semester listing page
- ✅ Syllabus viewing page
- ✅ Question paper viewing page
- ✅ User management (admin)
- ✅ Resource upload (admin)
- ✅ Settings and profile pages

### @ai_engine/ (FastAPI + AI)

#### 🤖 AI Engine Core

- ✅ FastAPI application setup
- ✅ Ollama integration with Phi model
- ✅ Document embedding system
- ✅ Vector storage in PostgreSQL
- ✅ Cosine similarity algorithm implementation
- ✅ Context retrieval system

#### 📄 Document Processing

- ✅ Text extraction from syllabus files
- ✅ Unit-based chunking for better context
- ✅ Question paper processing
- ✅ Embedding generation and storage
- ✅ Vector database integration

#### 🔍 Search & Retrieval

- ✅ Semantic search using embeddings
- ✅ Top-K context retrieval
- ✅ Context-aware prompt generation
- ✅ Question answering with syllabus context
- ✅ Support for both syllabus and question queries

#### 🌐 API Endpoints

- ✅ `/chat` endpoint for Q&A
- ✅ Context type selection (syllabus/question)
- ✅ Structured response format
- ✅ Error handling and validation

---

## 🚧 Remaining Tasks (TODO)

### @bca_notes_ai/ (Laravel + React)

#### 🔧 Backend Improvements

- [ ] **Database Optimization**

  - [ ] Add indexes for better query performance
  - [ ] Implement caching for frequently accessed data
  - [ ] Add database migrations for new features

- [ ] **API Enhancements**

  - [ ] Add pagination for large datasets
  - [ ] Implement search functionality
  - [ ] Add filtering and sorting options
  - [ ] Create API documentation

- [ ] **File Management**
  - [ ] Implement file versioning
  - [ ] Add file preview functionality
  - [ ] Implement file compression
  - [ ] Add file type validation

#### 🎨 Frontend Enhancements

- [ ] **User Experience**

  - [ ] Add loading states and error handling
  - [ ] Implement real-time notifications
  - [ ] Add search functionality in UI
  - [ ] Create mobile-optimized views

- [ ] **Chat Interface**

  - [ ] Design chat UI component
  - [ ] Add message history
  - [ ] Implement typing indicators
  - [ ] Add file upload in chat

- [ ] **Content Management**
  - [ ] Add bulk upload functionality
  - [ ] Implement content editing
  - [ ] Add content versioning
  - [ ] Create content approval workflow

#### 🔐 Security & Performance

- [ ] **Security**

  - [ ] Implement rate limiting
  - [ ] Add CSRF protection
  - [ ] Implement file upload security
  - [ ] Add audit logging

- [ ] **Performance**
  - [ ] Implement lazy loading
  - [ ] Add image optimization
  - [ ] Implement caching strategies
  - [ ] Add CDN integration

### @ai_engine/ (FastAPI + AI)

#### 🤖 AI Engine Enhancements

- [ ] **Model Improvements**

  - [ ] Implement model fine-tuning
  - [ ] Add support for multiple LLM models
  - [ ] Implement model switching
  - [ ] Add model performance monitoring

- [ ] **RAG Optimization**

  - [ ] Implement hybrid search (keyword + semantic)
  - [ ] Add query expansion
  - [ ] Implement context window optimization
  - [ ] Add relevance scoring

- [ ] **Document Processing**
  - [ ] Add PDF text extraction
  - [ ] Implement OCR for scanned documents
  - [ ] Add document preprocessing
  - [ ] Implement automatic chunking

#### 🔍 Search & Retrieval

- [ ] **Advanced Search**

  - [ ] Add faceted search
  - [ ] Implement search filters
  - [ ] Add search suggestions
  - [ ] Implement search analytics

- [ ] **Context Enhancement**
  - [ ] Add multi-hop reasoning
  - [ ] Implement context summarization
  - [ ] Add source citation
  - [ ] Implement context ranking

#### 🌐 API & Integration

- [ ] **API Features**

  - [ ] Add authentication to AI API
  - [ ] Implement rate limiting
  - [ ] Add API versioning
  - [ ] Create comprehensive API docs

- [ ] **Integration**
  - [ ] Add WebSocket support for real-time chat
  - [ ] Implement streaming responses
  - [ ] Add batch processing
  - [ ] Create webhook system

#### 📊 Monitoring & Analytics

- [ ] **Performance Monitoring**

  - [ ] Add response time tracking
  - [ ] Implement error monitoring
  - [ ] Add usage analytics
  - [ ] Create performance dashboards

- [ ] **Quality Assurance**
  - [ ] Add response quality metrics
  - [ ] Implement feedback collection
  - [ ] Add A/B testing framework
  - [ ] Create quality improvement pipeline

---

## 🎯 Direct Instructions for Cursor AI

### 📋 When Working on This Project

#### 🔍 **Context Understanding**

1. **Always check both components** - This is a dual-component project
2. **Understand the data flow** - Laravel → FastAPI → Ollama → Response
3. **Consider the user roles** - Admin vs regular user permissions
4. **Remember the academic context** - BCA syllabus and question papers

#### 🛠️ **Development Guidelines**

**For @bca_notes_ai/ (Laravel + React):**

- Use Laravel 12.x conventions and PHP 8.2+ features
- Follow Inertia.js patterns for React components
- Use Tailwind CSS for styling with Radix UI components
- Implement proper authentication and authorization
- Follow Laravel naming conventions and best practices
- Use TypeScript for React components
- Implement proper error handling and validation

**For @ai_engine/ (FastAPI + AI):**

- Use Python 3.11+ and FastAPI best practices
- Follow LlamaIndex 0.10.20 patterns
- Implement proper error handling for Ollama calls
- Use cosine similarity for vector search
- Maintain compatibility with PostgreSQL + pgvector
- Follow async/await patterns for FastAPI
- Implement proper logging and monitoring

#### 🔗 **Integration Points**

- **Chat Integration**: Laravel ChatController → FastAPI /chat endpoint
- **Database**: Shared PostgreSQL instance with pgvector
- **File Storage**: Laravel handles file uploads, AI engine processes content
- **Authentication**: Laravel manages users, AI engine can be extended for auth

#### 📁 **File Structure Awareness**

- **Laravel**: Follow MVC pattern with Inertia.js
- **React**: Components in `resources/js/components/`, pages in `resources/js/pages/`
- **AI Engine**: Modular structure with separate files for different functionalities
- **Database**: Migrations in `database/migrations/`, models in `app/Models/`

#### 🎨 **UI/UX Guidelines**

- Use consistent design system with Tailwind CSS
- Implement responsive design for mobile and desktop
- Follow accessibility best practices
- Use Radix UI components for complex interactions
- Maintain dark/light mode support

#### 🔐 **Security Considerations**

- Always validate user permissions
- Sanitize file uploads
- Implement proper CSRF protection
- Use prepared statements for database queries
- Validate all API inputs

#### 🚀 **Performance Optimization**

- Use lazy loading for large datasets
- Implement caching where appropriate
- Optimize database queries
- Use efficient vector search algorithms
- Minimize API response times

### 📝 **Code Generation Tips**

1. **Check existing patterns** before creating new components
2. **Use TypeScript** for better type safety in React
3. **Follow Laravel conventions** for PHP code
4. **Implement proper error handling** in both components
5. **Add comments** for complex AI/ML logic
6. **Use environment variables** for configuration
7. **Test both components** when making changes

### 🔄 **Testing Strategy**

- **Laravel**: Use Pest for PHP testing
- **React**: Use React Testing Library
- **AI Engine**: Use pytest for Python testing
- **Integration**: Test API endpoints and database interactions
- **End-to-End**: Test complete user workflows

---

## 📚 **Additional Resources**

### 🔗 **Key Dependencies**

- **Laravel**: 12.x with Inertia.js
- **React**: 19.x with TypeScript
- **FastAPI**: Latest with Python 3.11+
- **LlamaIndex**: 0.10.20 with Core 0.13.0
- **Ollama**: Latest with Phi model
- **PostgreSQL**: With pgvector extension

### 📖 **Documentation References**

- Laravel Documentation: https://laravel.com/docs
- Inertia.js Documentation: https://inertiajs.com/
- FastAPI Documentation: https://fastapi.tiangolo.com/
- LlamaIndex Documentation: https://docs.llamaindex.ai/
- Ollama Documentation: https://ollama.ai/docs

### 🎯 **Project Goals**

1. **Educational Excellence**: Provide comprehensive BCA learning resources
2. **AI-Powered Learning**: Intelligent assistance for students
3. **Modern Technology**: Latest frameworks and best practices
4. **Scalability**: Architecture that can grow with user base
5. **User Experience**: Intuitive and accessible interface

---

_This CONTEXT.md file serves as the single source of truth for understanding and developing the BCA Notes AI project. Always refer to this document when making architectural decisions or implementing new features._
