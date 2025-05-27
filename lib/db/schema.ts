// lib/db/schema.ts
import { 
    pgTable, 
    text, 
    timestamp, 
    integer, 
    boolean, 
    jsonb, 
    pgEnum, 
    uuid, 
    varchar, 
    decimal,
    index,
    uniqueIndex
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const planEnum = pgEnum('plan', ['free', 'basic', 'pro']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'expired', 'past_due']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['pending', 'paid', 'failed', 'refunded']);
export const contactStatusEnum = pgEnum('contact_status', ['new', 'in_progress', 'resolved']);

// Type definitions for better TypeScript support
export type Plan = 'free' | 'basic' | 'pro';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due';
export type InvoiceStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type ContactStatus = 'new' | 'in_progress' | 'resolved';

export type MessageType = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    id?: string;
};

export type GeneralSettings = {
    language: string;
    timezone: string;
    animations: boolean;
    autoSave: boolean;
};

export type AppearanceSettings = {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    reducedMotion: boolean;
    highContrast: boolean;
    compactMode: boolean;
};

export type NotificationSettings = {
    emailGenerationComplete: boolean;
    emailSystemUpdates: boolean;
    emailPromotional: boolean;
    browserNotifications: boolean;
    desktopNotifications: boolean;
    soundEffects: boolean;
};

export type AISettings = {
    defaultModel: string;
    qualityPreference: 'speed' | 'balanced' | 'quality';
    defaultImageSettings: {
        resolution: string;
        style: string;
        aspectRatio: string;
    };
    defaultVideoSettings: {
        duration: number;
        quality: string;
    };
    defaultAudioSettings: {
        voice: string;
        speed: number;
    };
};

export type PrivacySettings = {
    dataCollection: boolean;
    saveHistory: boolean;
    shareUsageStats: boolean;
    allowDataExport: boolean;
};

// Users table
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkId: text('clerk_id').notNull().unique(),
    email: text('email').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    imageUrl: text('image_url'),
    isActive: boolean('is_active').notNull().default(true),
    lastLoginAt: timestamp('last_login_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    clerkIdIdx: uniqueIndex('users_clerk_id_idx').on(table.clerkId),
    emailIdx: index('users_email_idx').on(table.email),
    createdAtIdx: index('users_created_at_idx').on(table.createdAt),
}));

// Subscriptions table
export const subscriptions = pgTable('subscriptions', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    plan: planEnum('plan').notNull().default('free'),
    status: subscriptionStatusEnum('status').notNull().default('active'),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull().default('0'),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    startDate: timestamp('start_date').notNull().defaultNow(),
    endDate: timestamp('end_date'),
    paypalSubscriptionId: text('paypal_subscription_id'),
    paypalPayerId: text('paypal_payer_id'),
    canceledAt: timestamp('canceled_at'),
    cancelReason: text('cancel_reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('subscriptions_user_id_idx').on(table.userId),
    statusIdx: index('subscriptions_status_idx').on(table.status),
    endDateIdx: index('subscriptions_end_date_idx').on(table.endDate),
    paypalSubscriptionIdIdx: index('subscriptions_paypal_subscription_id_idx').on(table.paypalSubscriptionId),
}));

// Invoices table
export const invoices = pgTable('invoices', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    subscriptionId: uuid('subscription_id').references(() => subscriptions.id, { onDelete: 'cascade' }).notNull(),
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('USD'),
    status: invoiceStatusEnum('status').notNull().default('pending'),
    paypalPaymentId: text('paypal_payment_id'),
    paypalInvoiceId: text('paypal_invoice_id'),
    invoiceNumber: text('invoice_number').notNull().unique(),
    invoiceDate: timestamp('invoice_date').notNull(),
    dueDate: timestamp('due_date').notNull(),
    paidAt: timestamp('paid_at'),
    refundedAt: timestamp('refunded_at'),
    refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
    invoiceJson: jsonb('invoice_json').notNull(),
    pdfUrl: text('pdf_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('invoices_user_id_idx').on(table.userId),
    subscriptionIdIdx: index('invoices_subscription_id_idx').on(table.subscriptionId),
    statusIdx: index('invoices_status_idx').on(table.status),
    invoiceNumberIdx: uniqueIndex('invoices_invoice_number_idx').on(table.invoiceNumber),
    invoiceDateIdx: index('invoices_invoice_date_idx').on(table.invoiceDate),
    dueDateIdx: index('invoices_due_date_idx').on(table.dueDate),
}));

// Image generations table
export const imageGenerations = pgTable('image_generations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    prompt: text('prompt').notNull(),
    model: text('model').notNull(),
    imageUrl: text('image_url').notNull(),
    resolution: text('resolution').notNull(),
    style: text('style'),
    aspectRatio: text('aspect_ratio').default('1:1'),
    seed: integer('seed'),
    steps: integer('steps'),
    guidance: decimal('guidance', { precision: 4, scale: 2 }),
    metadata: jsonb('metadata').$type<{
        processingTime?: number;
        fileSize?: number;
        dimensions?: { width: number; height: number };
        tags?: string[];
        isPublic?: boolean;
        likes?: number;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('image_generations_user_id_idx').on(table.userId),
    modelIdx: index('image_generations_model_idx').on(table.model),
    createdAtIdx: index('image_generations_created_at_idx').on(table.createdAt),
    resolutionIdx: index('image_generations_resolution_idx').on(table.resolution),
}));

// Video generations table
export const videoGenerations = pgTable('video_generations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    prompt: text('prompt').notNull(),
    videoUrl: text('video_url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    duration: integer('duration'), // in seconds
    resolution: text('resolution').default('1920x1080'),
    frameRate: integer('frame_rate').default(30),
    quality: text('quality').default('standard'),
    metadata: jsonb('metadata').$type<{
        processingTime?: number;
        fileSize?: number;
        codec?: string;
        bitrate?: number;
        tags?: string[];
        isPublic?: boolean;
        likes?: number;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('video_generations_user_id_idx').on(table.userId),
    createdAtIdx: index('video_generations_created_at_idx').on(table.createdAt),
    durationIdx: index('video_generations_duration_idx').on(table.duration),
}));

// Audio generations table
export const audioGenerations = pgTable('audio_generations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    prompt: text('prompt').notNull(),
    audioUrl: text('audio_url').notNull(),
    duration: integer('duration'), // in seconds
    voice: text('voice'),
    language: text('language').default('en'),
    speed: decimal('speed', { precision: 3, scale: 2 }).default('1.0'),
    pitch: decimal('pitch', { precision: 3, scale: 2 }).default('1.0'),
    format: text('format').default('mp3'),
    metadata: jsonb('metadata').$type<{
        processingTime?: number;
        fileSize?: number;
        sampleRate?: number;
        bitrate?: number;
        channels?: number;
        tags?: string[];
        isPublic?: boolean;
        likes?: number;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('audio_generations_user_id_idx').on(table.userId),
    createdAtIdx: index('audio_generations_created_at_idx').on(table.createdAt),
    voiceIdx: index('audio_generations_voice_idx').on(table.voice),
    languageIdx: index('audio_generations_language_idx').on(table.language),
}));

// Code generations table
export const codeGenerations = pgTable('code_generations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    prompt: text('prompt').notNull(),
    generatedCode: text('generated_code').notNull(),
    language: text('language'),
    framework: text('framework'),
    complexity: text('complexity'), // 'simple', 'intermediate', 'advanced'
    linesOfCode: integer('lines_of_code'),
    metadata: jsonb('metadata').$type<{
        processingTime?: number;
        tokens?: number;
        dependencies?: string[];
        tags?: string[];
        isPublic?: boolean;
        likes?: number;
        exports?: string[];
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('code_generations_user_id_idx').on(table.userId),
    languageIdx: index('code_generations_language_idx').on(table.language),
    frameworkIdx: index('code_generations_framework_idx').on(table.framework),
    createdAtIdx: index('code_generations_created_at_idx').on(table.createdAt),
}));

// Conversations table
export const conversations = pgTable('conversations', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: text('title'),
    messages: jsonb('messages').notNull().$type<MessageType[]>(),
    model: text('model').notNull(),
    sessionId: text('session_id').notNull(),
    messageCount: integer('message_count').default(0),
    totalTokens: integer('total_tokens').default(0),
    isBookmarked: boolean('is_bookmarked').default(false),
    metadata: jsonb('metadata').$type<{
        tags?: string[];
        isPublic?: boolean;
        sharedWith?: string[];
        temperature?: number;
        maxTokens?: number;
    }>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('conversations_user_id_idx').on(table.userId),
    sessionIdIdx: index('conversations_session_id_idx').on(table.sessionId),
    modelIdx: index('conversations_model_idx').on(table.model),
    createdAtIdx: index('conversations_created_at_idx').on(table.createdAt),
    isBookmarkedIdx: index('conversations_is_bookmarked_idx').on(table.isBookmarked),
}));

// User settings table
export const userSettings = pgTable('user_settings', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    general: jsonb('general').notNull().$type<GeneralSettings>(),
    appearance: jsonb('appearance').notNull().$type<AppearanceSettings>(),
    notifications: jsonb('notifications').notNull().$type<NotificationSettings>(),
    ai: jsonb('ai').notNull().$type<AISettings>(),
    privacy: jsonb('privacy').notNull().$type<PrivacySettings>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: uniqueIndex('user_settings_user_id_idx').on(table.userId),
}));

// Contact messages table
export const contactMessages = pgTable('contact_messages', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    subject: text('subject'),
    message: text('message').notNull(),
    status: contactStatusEnum('status').notNull().default('new'),
    priority: text('priority').default('normal'), // 'low', 'normal', 'high', 'urgent'
    assignedTo: text('assigned_to'),
    resolvedAt: timestamp('resolved_at'),
    responseTime: integer('response_time'), // in minutes
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
    userIdIdx: index('contact_messages_user_id_idx').on(table.userId),
    statusIdx: index('contact_messages_status_idx').on(table.status),
    emailIdx: index('contact_messages_email_idx').on(table.email),
    createdAtIdx: index('contact_messages_created_at_idx').on(table.createdAt),
    priorityIdx: index('contact_messages_priority_idx').on(table.priority),
}));

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
    subscriptions: many(subscriptions),
    invoices: many(invoices),
    imageGenerations: many(imageGenerations),
    videoGenerations: many(videoGenerations),
    audioGenerations: many(audioGenerations),
    codeGenerations: many(codeGenerations),
    conversations: many(conversations),
    settings: one(userSettings),
    contactMessages: many(contactMessages),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
    user: one(users, {
        fields: [subscriptions.userId],
        references: [users.id],
    }),
    invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
    user: one(users, {
        fields: [invoices.userId],
        references: [users.id],
    }),
    subscription: one(subscriptions, {
        fields: [invoices.subscriptionId],
        references: [subscriptions.id],
    }),
}));

export const imageGenerationsRelations = relations(imageGenerations, ({ one }) => ({
    user: one(users, {
        fields: [imageGenerations.userId],
        references: [users.id],
    }),
}));

export const videoGenerationsRelations = relations(videoGenerations, ({ one }) => ({
    user: one(users, {
        fields: [videoGenerations.userId],
        references: [users.id],
    }),
}));

export const audioGenerationsRelations = relations(audioGenerations, ({ one }) => ({
    user: one(users, {
        fields: [audioGenerations.userId],
        references: [users.id],
    }),
}));

export const codeGenerationsRelations = relations(codeGenerations, ({ one }) => ({
    user: one(users, {
        fields: [codeGenerations.userId],
        references: [users.id],
    }),
}));

export const conversationsRelations = relations(conversations, ({ one }) => ({
    user: one(users, {
        fields: [conversations.userId],
        references: [users.id],
    }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
    user: one(users, {
        fields: [userSettings.userId],
        references: [users.id],
    }),
}));

export const contactMessagesRelations = relations(contactMessages, ({ one }) => ({
    user: one(users, {
        fields: [contactMessages.userId],
        references: [users.id],
    }),
}));

// Export types for use in other files
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type ImageGeneration = typeof imageGenerations.$inferSelect;
export type NewImageGeneration = typeof imageGenerations.$inferInsert;
export type VideoGeneration = typeof videoGenerations.$inferSelect;
export type NewVideoGeneration = typeof videoGenerations.$inferInsert;
export type AudioGeneration = typeof audioGenerations.$inferSelect;
export type NewAudioGeneration = typeof audioGenerations.$inferInsert;
export type CodeGeneration = typeof codeGenerations.$inferSelect;
export type NewCodeGeneration = typeof codeGenerations.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;
export type UserSettings = typeof userSettings.$inferSelect;
export type NewUserSettings = typeof userSettings.$inferInsert;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
