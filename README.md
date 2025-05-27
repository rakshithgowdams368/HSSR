# NexusAI - AI-Powered Content Generation Platform

<div align="center">
  <img src="./public/logo.png" alt="NexusAI Logo" width="120" height="120">
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Clerk](https://img.shields.io/badge/Clerk-Auth-6C5CE7?style=for-the-badge)](https://clerk.com/)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

  **Create stunning images, videos, code, audio, and have intelligent conversations with advanced AI models.**

  [🚀 Live Demo](https://nexusai.vercel.app) | [📖 Documentation](./docs) | [🎯 Features](#features) | [🛠️ Installation](#installation)
</div>

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Component Documentation](#component-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🌟 Overview

NexusAI is a comprehensive AI-powered content generation platform that enables users to create various types of content using state-of-the-art artificial intelligence models. Built with Next.js 14, TypeScript, and modern web technologies, it provides a seamless experience for generating images, videos, code, audio, and engaging in intelligent conversations.

### 🎯 Key Highlights

- **Multi-Modal AI Generation**: Support for images, videos, audio, code, and conversations
- **Advanced Authentication**: Secure user management with Clerk
- **Real-time Processing**: Live generation status and progress tracking
- **Mobile Responsive**: Optimized for all device sizes
- **Dark Mode**: Beautiful dark theme with smooth transitions
- **Type Safety**: Full TypeScript implementation
- **Modern UI/UX**: Clean, intuitive interface with Tailwind CSS

## ✨ Features

### 🎨 Image Generation
- **Multiple AI Models**: ChatGPT DALL-E, Gemini Imagen
- **High Resolution**: Support for up to 1024x1024 resolution
- **Batch Generation**: Generate multiple images simultaneously
- **Prompt Enhancement**: AI-powered prompt suggestions
- **Style Transfer**: Various artistic styles and filters

### 🎬 Video Generation
- **AI Video Creation**: Text-to-video generation
- **Custom Duration**: Configurable video length
- **Multiple Formats**: MP4, WebM support
- **Quality Options**: Standard to HD quality
- **Thumbnail Generation**: Automatic preview thumbnails

### 🔊 Audio Generation
- **Music Synthesis**: AI-generated music and sounds
- **Voice Synthesis**: Text-to-speech conversion
- **Multiple Formats**: MP3, WAV, FLAC support
- **Custom Voices**: Various voice options
- **Audio Effects**: Built-in audio processing

### 💻 Code Generation
- **Multi-Language Support**: Python, JavaScript, TypeScript, and more
- **Framework Integration**: React, Next.js, Node.js templates
- **Code Explanation**: Intelligent code documentation
- **Bug Detection**: Automated code review
- **Best Practices**: Industry-standard code patterns

### 💬 Intelligent Conversations
- **Multiple AI Models**: GPT-4, Claude, Gemini support
- **Context Awareness**: Maintains conversation history
- **Custom Personalities**: Configurable AI behavior
- **Export Options**: Save conversations as text/PDF
- **Multi-turn Dialogs**: Complex conversation flows

### 🔐 User Management
- **Secure Authentication**: Clerk integration
- **User Profiles**: Customizable user accounts
- **Usage Analytics**: Track generation history
- **Subscription Management**: Free and premium tiers
- **Data Privacy**: GDPR compliant data handling

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation

### Backend & APIs
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless functions
- **[OpenAI API](https://openai.com/api/)** - GPT models and DALL-E
- **[Google AI](https://ai.google/)** - Gemini models
- **[Anthropic Claude](https://www.anthropic.com/)** - Claude AI models
- **[Replicate](https://replicate.com/)** - AI model hosting

### Authentication & Database
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)** - Client-side storage
- **[Prisma](https://www.prisma.io/)** - Database ORM (optional)

### UI Components
- **[shadcn/ui](https://ui.shadcn.com/)** - Reusable UI components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible primitives
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[React Markdown](https://remarkjs.github.io/react-markdown/)** - Markdown rendering

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Staged file linting

## 🚀 Installation

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm/yarn/pnpm** - Package manager
- **Git** - Version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexusai.git
   cd nexusai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys and configuration (see [Environment Variables](#environment-variables))

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# OpenAI API
OPENAI_API_KEY=sk-...
OPENAI_ORGANIZATION_ID=org-...

# Google AI (Gemini)
GOOGLE_AI_API_KEY=AIza...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...

# Replicate
REPLICATE_API_TOKEN=r8_...

# Database (Optional)
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Email (Optional)
RESEND_API_KEY=re_...

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-...

# Error Tracking (Optional)
SENTRY_DSN=https://...
```

### Required API Keys

1. **Clerk** - [Get API keys](https://dashboard.clerk.com/)
2. **OpenAI** - [Get API key](https://platform.openai.com/api-keys)
3. **Google AI** - [Get API key](https://makersuite.google.com/app/apikey)
4. **Anthropic** - [Get API key](https://console.anthropic.com/)
5. **Replicate** - [Get API token](https://replicate.com/account/api-tokens)

## 📁 Project Structure

```
nexusai/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── (routes)/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard routes
│   │   ├── (routes)/
│   │   │   ├── audio/
│   │   │   ├── code/
│   │   │   ├── conversation/
│   │   │   ├── dashboard/
│   │   │   ├── image/
│   │   │   ├── music/
│   │   │   └── video/
│   │   ├── dashboard-layout-client.tsx
│   │   └── layout.tsx
│   ├── api/                      # API routes
│   │   ├── audio/
│   │   ├── code/
│   │   ├── conversation/
│   │   ├── image/
│   │   ├── music/
│   │   └── video/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── storage/                  # Storage components
│   │   └── indexdb-provider.tsx
│   ├── bot-avatar.tsx
│   ├── empty.tsx
│   ├── loader.tsx
│   ├── mobile-sidebar.tsx
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   ├── theme-provider.tsx
│   └── user-avatar.tsx
├── hooks/                        # Custom React hooks
│   ├── use-pro-modal.ts
│   └── use-storage.ts
├── lib/                          # Utility libraries
│   ├── storage/
│   │   └── indexdb.ts
│   ├── subscription.ts
│   └── utils.ts
├── types/                        # TypeScript type definitions
│   ├── database.ts
│   └── generation.ts
├── public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── docs/                         # Documentation
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment variables
├── .gitignore
├── .eslintrc.json
├── components.json               # shadcn/ui configuration
├── next.config.js
├── package.json
├── README.md
├── tailwind.config.js
└── tsconfig.json
```

## 🌐 API Endpoints

### Authentication Routes
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Generation Endpoints

#### Image Generation
```typescript
POST /api/image
Body: {
  prompt: string;
  model?: 'chatgpt' | 'gemini';
  resolution?: '256x256' | '512x512' | '1024x1024';
  amount?: '1' | '2' | '3' | '4';
}
```

#### Video Generation
```typescript
POST /api/video
Body: {
  prompt: string;
  duration?: number;
  quality?: 'standard' | 'high';
}
```

#### Audio Generation
```typescript
POST /api/audio
Body: {
  prompt: string;
  duration?: number;
  format?: 'mp3' | 'wav';
}
```

#### Code Generation
```typescript
POST /api/code
Body: {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}
```

#### Conversation
```typescript
POST /api/conversation
Body: {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}
```

### Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}
```

## 🧩 Component Documentation

### Core Components

#### `<Sidebar />`
Navigation sidebar with generation tools
```tsx
interface SidebarProps {
  className?: string;
}
```

#### `<Navbar />`
Top navigation bar with user menu
```tsx
interface NavbarProps {
  className?: string;
}
```

#### `<BotAvatar />`
AI assistant avatar with gradients
```tsx
interface BotAvatarProps {
  gradient?: 'conversation' | 'image' | 'video' | 'audio' | 'code';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}
```

#### `<UserAvatar />`
User profile avatar component
```tsx
interface UserAvatarProps {
  className?: string;
  size?: number;
}
```

### Generation Components

#### `<Empty />`
Empty state component
```tsx
interface EmptyProps {
  label: string;
  action?: React.ReactNode;
}
```

#### `<Loader />`
Loading spinner component
```tsx
interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

### Storage Components

#### `<IndexedDBProvider />`
Client-side storage provider
```tsx
interface IndexedDBProviderProps {
  children: React.ReactNode;
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables**
   - Go to your Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all required environment variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t nexusai .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 --env-file .env.local nexusai
   ```

### Environment-Specific Configurations

#### Production
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### Staging
```env
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.yourdomain.com
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Getting Started

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/nexusai.git
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
5. **Run tests**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**

### Development Guidelines

#### Code Style
- Use TypeScript for all new code
- Follow the existing code patterns
- Use meaningful variable and function names
- Add comments for complex logic

#### Component Guidelines
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the existing component structure
- Add proper error handling

#### Testing
- Write unit tests for utility functions
- Test API endpoints thoroughly
- Add integration tests for critical flows

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new image generation model
fix: resolve video processing bug
docs: update API documentation
style: format code with prettier
refactor: optimize storage implementation
test: add unit tests for utils
chore: update dependencies
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 NexusAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support

### Getting Help

- **Documentation**: Check our [docs](./docs) folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/nexusai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nexusai/discussions)
- **Email**: support@nexusai.com

### Frequently Asked Questions

#### Q: How do I get API keys?
A: Check the [Environment Variables](#environment-variables) section for links to each provider.

#### Q: Can I use this commercially?
A: Yes, this project is MIT licensed. However, check the terms of service for each AI provider.

#### Q: How do I add a new AI model?
A: Check our [Contributing Guidelines](./docs/CONTRIBUTING.md) for detailed instructions.

#### Q: Is there a rate limit?
A: Rate limits depend on your API provider plans. Check each provider's documentation.

### Community

- **Discord**: [Join our community](https://discord.gg/nexusai)
- **Twitter**: [@NexusAI](https://twitter.com/nexusai)
- **LinkedIn**: [NexusAI](https://linkedin.com/company/nexusai)

---

<div align="center">
  <p>Built with ❤️ by the NexusAI Team</p>
  <p>
    <a href="https://nexusai.vercel.app">Website</a> •
    <a href="./docs">Documentation</a> •
    <a href="https://github.com/yourusername/nexusai/issues">Issues</a> •
    <a href="https://github.com/yourusername/nexusai/discussions">Discussions</a>
  </p>
</div>
