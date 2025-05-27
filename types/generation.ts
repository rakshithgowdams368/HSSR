// types/generation.ts

// Base generation interface
export interface BaseGeneration {
  id: string;
  userId: string;
  prompt: string;
  createdAt: Date;
  synced: boolean;
}

// Common type aliases
export type AIModel = 'chatgpt' | 'gemini' | 'claude' | 'dall-e';
export type ImageResolution = '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
export type ImageAmount = '1' | '2' | '3' | '4';
export type Quality = 'standard' | 'high' | 'hd';
export type AudioFormat = 'mp3' | 'wav' | 'flac';
export type CodeStyle = 'concise' | 'detailed' | 'commented';
export type MessageRole = 'user' | 'assistant' | 'system';
export type ConversationModel = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'claude-3-sonnet';
export type GenerationType = 'image' | 'video' | 'audio' | 'code' | 'conversation';

// Image generation types
export interface ImageGenerationOptions {
  model: AIModel;
  resolution: ImageResolution;
  amount: ImageAmount;
  quality?: Quality;
  enhancePrompt?: boolean;
  style?: string;
  negativePrompt?: string;
}

export interface ImageGenerationResult extends BaseGeneration {
  type: 'image';
  model: AIModel;
  imageUrl: string;
  resolution: string;
  enhancedPrompt?: string;
  promptSuggestions?: string[];
  metadata: ImageGenerationOptions;
}

// Video generation types
export interface VideoGenerationOptions {
  duration?: number;
  fps?: number;
  resolution?: string;
  style?: string;
  quality?: Quality;
  aspectRatio?: '16:9' | '9:16' | '1:1';
}

export interface VideoGenerationResult extends BaseGeneration {
  type: 'video';
  videoUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  fps?: number;
  metadata: VideoGenerationOptions;
}

// Audio generation types
export interface AudioGenerationOptions {
  duration?: number;
  style?: string;
  format?: AudioFormat;
  quality?: Quality;
  voice?: string;
  speed?: number;
}

export interface AudioGenerationResult extends BaseGeneration {
  type: 'audio';
  audioUrl: string;
  duration?: number;
  format?: AudioFormat;
  metadata: AudioGenerationOptions;
}

// Code generation types
export interface CodeGenerationOptions {
  language?: string;
  framework?: string;
  style?: CodeStyle;
  includeComments?: boolean;
  includeTests?: boolean;
}

export interface CodeGenerationResult extends BaseGeneration {
  type: 'code';
  generatedCode: string;
  language?: string;
  framework?: string;
  metadata: CodeGenerationOptions;
}

// Conversation types
export interface ConversationMessage {
  id?: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ConversationOptions {
  model?: ConversationModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface ConversationResult extends BaseGeneration {
  type: 'conversation';
  messages: ConversationMessage[];
  sessionId: string;
  model?: ConversationModel;
  metadata: ConversationOptions;
}

// Union type for all generations
export type GenerationResult = 
  | ImageGenerationResult
  | VideoGenerationResult
  | AudioGenerationResult
  | CodeGenerationResult
  | ConversationResult;

// API Response types
export interface GenerationResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  requestId?: string;
}

// Local storage types for IndexedDB
export interface LocalGeneration {
  id: string;
  userId: string;
  type: GenerationType;
  prompt: string;
  result: string | Blob;
  model?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt?: Date;
  synced: boolean;
}

// Form validation types
export interface GenerationFormData {
  prompt: string;
  model?: string;
  options?: Record<string, any>;
}

// Error types
export interface GenerationError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp?: Date;
}

// Progress tracking types
export interface GenerationProgress {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  estimatedTimeRemaining?: number;
  message?: string;
}

// Generation statistics types
export interface GenerationStats {
  totalGenerations: number;
  generationsByType: Record<GenerationType, number>;
  generationsByModel: Record<string, number>;
  averageProcessingTime: number;
  successRate: number;
}

// Batch generation types
export interface BatchGenerationRequest {
  prompts: string[];
  type: GenerationType;
  options?: Record<string, any>;
  userId: string;
}

export interface BatchGenerationResult {
  batchId: string;
  results: GenerationResult[];
  totalCount: number;
  successCount: number;
  failureCount: number;
  processingTime: number;
}

// Filter and search types
export interface GenerationFilters {
  type?: GenerationType;
  model?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  synced?: boolean;
  userId?: string;
}

export interface GenerationSearchParams {
  query?: string;
  filters?: GenerationFilters;
  sortBy?: 'createdAt' | 'prompt' | 'type';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
