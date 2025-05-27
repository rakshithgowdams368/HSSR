// types/database.ts

// User related types
export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription types
export type PlanType = 'free' | 'basic' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired';

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanType;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  startDate: Date;
  endDate?: Date;
  paypalSubscriptionId?: string;
  paypalPayerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Billing/Invoice types
export type InvoiceStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paypalPaymentId?: string;
  paypalInvoiceId?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  paidAt?: Date;
  invoiceJson: Record<string, any>; // More specific than 'any'
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Generation history types
export type AIModel = 'chatgpt' | 'gemini' | 'claude' | 'dall-e' | 'midjourney';

export interface ImageGeneration {
  id: string;
  userId: string;
  prompt: string;
  model: AIModel;
  imageUrl: string;
  resolution: string;
  metadata?: {
    enhancedPrompt?: string;
    promptSuggestions?: string[];
    settings?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VideoGeneration {
  id: string;
  userId: string;
  prompt: string;
  videoUrl: string;
  duration?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AudioGeneration {
  id: string;
  userId: string;
  prompt: string;
  audioUrl: string;
  duration?: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeGeneration {
  id: string;
  userId: string;
  prompt: string;
  generatedCode: string;
  language?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  userId: string;
  messages: ConversationMessage[];
  model: string;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Settings types
export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large';
export type QualityPreference = 'speed' | 'balanced' | 'quality';
export type ContactStatus = 'new' | 'in_progress' | 'resolved';

export interface UserSettings {
  id: string;
  userId: string;
  general: {
    language: string;
    timezone: string;
    animations: boolean;
  };
  appearance: {
    theme: Theme;
    accentColor: string;
    fontSize: FontSize;
    reducedMotion: boolean;
    highContrast: boolean;
  };
  notifications: {
    emailGenerationComplete: boolean;
    emailSystemUpdates: boolean;
    browserNotifications: boolean;
  };
  ai: {
    defaultModel: string;
    qualityPreference: QualityPreference;
    defaultImageSettings: {
      resolution: string;
      style: string;
    };
  };
  privacy: {
    dataCollection: boolean;
    saveHistory: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Help/Contact form types
export interface ContactMessage {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Union types for easier use
export type Generation = ImageGeneration | VideoGeneration | AudioGeneration | CodeGeneration;

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
