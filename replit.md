# AI Translator

## Overview

This is a minimalist AI-powered translation application built with a modern full-stack architecture. The application provides real-time streaming translations using DeepSeek AI through NVIDIA's API. The interface follows OpenAI/ChatGPT design principles: clean, neutral, and focused on content over decoration.

The application features a Progressive Web App (PWA) capability, dark/light theme support, and a responsive design optimized for both desktop and mobile experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling:**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management

**UI Component System:**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Framer Motion for subtle animations
- Inter font family for clean typography matching OpenAI aesthetics

**Design System:**
- Neutral color palette based on grayscale (blacks, whites, grays)
- Custom CSS variables for theming (light/dark mode support)
- Minimalist design philosophy with large spacing and high readability
- Focus on content hierarchy over decorative elements

**State Management:**
- React Query for asynchronous server state
- React Context for theme management
- Local component state for UI interactions

**PWA Features:**
- Service worker for offline capability
- Web manifest for app installation
- Mobile-optimized meta tags and viewport configuration

### Backend Architecture

**Server Framework:**
- Express.js as the HTTP server
- Node.js runtime with ESM module system
- HTTP server for standard request/response handling

**API Design:**
- RESTful endpoint structure
- Server-Sent Events (SSE) for streaming translations
- Proxy pattern for external API integration (NVIDIA/DeepSeek)

**Translation Service Integration:**
- NVIDIA API integration for DeepSeek v3.1 model access
- Streaming response handling for real-time translation output
- Temperature setting of 0.3 for consistent, focused translations

**Request Handling:**
- JSON body parsing with raw body preservation
- URL-encoded form data support
- Request/response logging middleware
- Static file serving for production builds

### Data Storage

**Database:**
- PostgreSQL as the primary database
- Drizzle ORM for type-safe database operations
- Connection pooling via node-postgres (pg)

**Schema Design:**
- Translations table with source/target text and language pairs
- Timestamp tracking for created records
- Serial primary keys for simple indexing

**Data Access Layer:**
- Repository pattern implementation via storage interface
- Separation of concerns between storage and business logic
- Async/await patterns for database operations

### Development & Build Process

**TypeScript Configuration:**
- Strict mode enabled for type safety
- Path aliases for clean imports (@/, @shared/)
- ESNext module system with bundler resolution
- Separate configurations for client and server code

**Build System:**
- Vite for client-side bundling with code splitting
- esbuild for server-side bundling with dependency allowlisting
- Production builds output to dist/ directory
- Static asset optimization and minification

**Development Workflow:**
- Hot Module Replacement (HMR) for client development
- tsx for running TypeScript server code in development
- Vite middleware mode for integrated dev server
- Database schema migrations via Drizzle Kit

### Authentication & Security

Currently, the application does not implement user authentication. The storage layer includes session-related dependencies (express-session, connect-pg-simple) but authentication is not actively used in the current implementation.

## External Dependencies

### Third-Party APIs

**NVIDIA AI Platform:**
- Endpoint: `https://integrate.api.nvidia.com/v1`
- Model: DeepSeek v3.1 for translation tasks
- Authentication: API key-based (stored in server code)
- Usage: Real-time streaming chat completions for translation

### Database

**PostgreSQL:**
- Required environment variable: `DATABASE_URL`
- Connection pooling for efficient resource usage
- Schema managed through Drizzle migrations

### UI Libraries

**Radix UI:**
- Comprehensive set of unstyled, accessible component primitives
- Components include: Dialog, Dropdown Menu, Select, Toast, and 20+ others
- Provides keyboard navigation and ARIA compliance

**Shadcn/ui:**
- Pre-built component collection built on Radix UI
- Customized with "new-york" style variant
- Neutral base color scheme
- Components stored in client/src/components/ui/

### Development Tools

**Replit Integrations:**
- vite-plugin-runtime-error-modal for error overlay
- vite-plugin-cartographer for code navigation
- vite-plugin-dev-banner for development mode indicators
- Custom meta-images plugin for OpenGraph image URL updates

### Font & Icons

**Google Fonts:**
- Inter font family (weights: 300, 400, 500, 600)
- Loaded via CDN for optimal caching

**Lucide Icons:**
- Consistent icon library across the application
- Tree-shakeable for optimal bundle size

### Additional Runtime Dependencies

- date-fns for date formatting
- zod for runtime type validation
- nanoid for unique ID generation
- vaul for drawer components
- embla-carousel for carousel functionality