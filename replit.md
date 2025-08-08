# CreativeData Pro

## Overview

CreativeData Pro is a comprehensive marketing automation platform designed for creative professionals. The application combines AI-powered insights with social media management, data visualization, and email campaign tools. Built as a full-stack React application with Express.js backend, it features an AI assistant named "TOBI TECH AI" that provides intelligent recommendations for content strategy and performance optimization.

The platform enables users to schedule social media posts across multiple platforms, create data visualizations, run email campaigns, and analyze performance metrics—all from a unified dashboard. The system includes subscription management through Stripe integration and uses Replit's authentication system for user management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client uses React with TypeScript, built with Vite for fast development and optimized builds. The UI is constructed with Radix UI primitives and shadcn/ui components, providing a consistent design system with proper accessibility. The application uses Wouter for client-side routing and TanStack Query for efficient server state management and caching.

The component structure follows a modular approach with reusable UI components, feature-specific components (like AIAssistant, DashboardHero, QuickPost), and page-level components. Styling is handled through Tailwind CSS with CSS custom properties for theming, supporting both light and dark modes.

### Backend Architecture
The server is built on Express.js with TypeScript, following a RESTful API design. The main entry point sets up middleware for JSON parsing, request logging, and error handling. The application uses a modular routing system where routes are registered dynamically.

Key backend services include:
- OpenAI integration for AI-powered insights and chat functionality
- Stripe integration for subscription management
- WebSocket support for real-time features
- Session management with PostgreSQL storage
- Authentication through Replit's OIDC system

### Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes:
- User management tables (mandatory for Replit Auth)
- Posts table for social media content scheduling
- Email campaigns table for marketing automation
- Visualizations table for saved charts and reports
- Analytics table for performance metrics
- Chat conversations for AI assistant history
- Session storage for authentication

The database uses UUID primary keys and includes proper indexing for session management.

### Authentication System
The application implements Replit's OpenID Connect (OIDC) authentication system with Passport.js. This provides secure user authentication with session management stored in PostgreSQL. The auth system includes middleware for protecting routes and extracting user information from authenticated requests.

### AI Integration
OpenAI's GPT-4o model powers the AI assistant functionality, providing:
- Conversational AI for user queries
- Content performance analysis
- Marketing insights generation
- Content suggestions with platform-specific recommendations
- Trend analysis and optimization suggestions

### State Management
Client-side state is managed through TanStack Query for server state and React's built-in state management for UI state. The query client is configured with appropriate caching strategies and error handling, including specific handling for authentication errors.

### Development Workflow
The application uses modern development tools including:
- TypeScript for type safety across the entire stack
- Vite for fast development builds with HMR
- ESBuild for production server bundling
- Drizzle Kit for database schema management and migrations
- Path aliases for clean import statements

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework with modern hooks and concurrent features
- **Express.js**: Node.js web framework for the backend API
- **TypeScript**: Type safety across the entire application stack
- **Vite**: Build tool and development server with fast HMR

### UI and Design System
- **Radix UI**: Headless UI components for accessibility and functionality
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

### Database and ORM
- **PostgreSQL**: Primary database (configured for Neon serverless)
- **Drizzle ORM**: Type-safe SQL query builder and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL client for Neon

### Authentication and Session Management
- **Replit OIDC**: Authentication provider through Replit's system
- **Passport.js**: Authentication middleware for Node.js
- **express-session**: Session middleware with PostgreSQL storage
- **connect-pg-simple**: PostgreSQL session store

### AI and External APIs
- **OpenAI API**: GPT-4o model for AI assistant functionality
- **Stripe**: Payment processing and subscription management

### State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for type safety

### Development and Build Tools
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS
- **tsx**: TypeScript execution for development

### Deployment and Environment
- **Replit**: Hosting platform with integrated development environment
- **WebSocket (ws)**: Real-time communication support
- **Neon Database**: Serverless PostgreSQL hosting