// lib/db/index.ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

// Validate environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Initialize Neon connection
const sql = neon(process.env.DATABASE_URL);

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Types for better type safety
interface ClerkUser {
  id: string;
  emailAddresses: { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

interface GenerationData {
  userId: string;
  prompt: string;
  model?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  generatedCode?: string;
  messages?: any;
  resolution?: string;
  duration?: number;
  language?: string;
  sessionId?: string;
  metadata?: any;
}

// Get user by Clerk ID
export async function getUserByClerkId(clerkId: string) {
  try {
    if (!clerkId) {
      console.error('Clerk ID is required');
      return null;
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.clerkId, clerkId)
    });

    return user || null;
  } catch (error) {
    console.error('Error getting user by Clerk ID:', error);
    return null;
  }
}

// Get user by database ID
export async function getUserById(id: string) {
  try {
    if (!id) {
      console.error('User ID is required');
      return null;
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id)
    });

    return user || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

// Create user if doesn't exist
export async function createUserIfNotExists(clerkUser: ClerkUser) {
  try {
    if (!clerkUser?.id) {
      throw new Error('Clerk user data is required');
    }

    // Check if user already exists
    const existingUser = await getUserByClerkId(clerkUser.id);
    
    if (existingUser) {
      console.log('User already exists:', existingUser.id);
      return existingUser;
    }

    // Validate required fields
    if (!clerkUser.emailAddresses?.length) {
      throw new Error('User email is required');
    }

    // Create new user
    const [newUser] = await db.insert(schema.users).values({
      clerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      firstName: clerkUser.firstName || null,
      lastName: clerkUser.lastName || null,
      imageUrl: clerkUser.imageUrl || null,
    }).returning();

    console.log('New user created:', newUser.id);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Update user information
export async function updateUser(clerkId: string, updates: Partial<ClerkUser>) {
  try {
    const user = await getUserByClerkId(clerkId);
    if (!user) {
      throw new Error('User not found');
    }

    const [updatedUser] = await db
      .update(schema.users)
      .set({
        email: updates.emailAddresses?.[0]?.emailAddress || user.email,
        firstName: updates.firstName ?? user.firstName,
        lastName: updates.lastName ?? user.lastName,
        imageUrl: updates.imageUrl ?? user.imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, user.id))
      .returning();

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Helper function to convert Clerk ID to database ID
async function resolveUserId(userId: string): Promise<string> {
  // If it's already a database UUID, return as-is
  if (!userId.startsWith('user_')) {
    return userId;
  }

  // It's a Clerk ID, convert to database ID
  const user = await getUserByClerkId(userId);
  if (!user) {
    throw new Error(`User not found for Clerk ID: ${userId}`);
  }

  return user.id;
}

// Save generation function with improved error handling
export async function saveGeneration(
  type: 'image' | 'video' | 'audio' | 'code' | 'conversation', 
  data: GenerationData
) {
  try {
    console.log('Attempting to save generation:', { type, dataKeys: Object.keys(data) });
    
    // Validate input
    if (!type || !data) {
      throw new Error('Generation type and data are required');
    }

    if (!data.userId) {
      throw new Error('User ID is required');
    }

    if (!data.prompt) {
      throw new Error('Prompt is required');
    }

    // Get the appropriate table schema
    const tableMap = {
      image: schema.imageGenerations,
      video: schema.videoGenerations,
      audio: schema.audioGenerations,
      code: schema.codeGenerations,
      conversation: schema.conversations,
    };

    const table = tableMap[type];
    if (!table) {
      throw new Error(`Invalid generation type: ${type}`);
    }

    // Resolve user ID (convert Clerk ID to database ID if needed)
    const resolvedUserId = await resolveUserId(data.userId);
    console.log('Resolved user ID:', { original: data.userId, resolved: resolvedUserId });

    // Prepare data based on generation type
    let insertData: any = {
      userId: resolvedUserId,
      prompt: data.prompt,
      metadata: data.metadata || null,
    };

    // Add type-specific fields
    switch (type) {
      case 'image':
        insertData = {
          ...insertData,
          model: data.model || 'unknown',
          imageUrl: data.imageUrl || '',
          resolution: data.resolution || '1024x1024',
        };
        break;

      case 'video':
        insertData = {
          ...insertData,
          videoUrl: data.videoUrl || '',
          duration: data.duration || null,
        };
        break;

      case 'audio':
        insertData = {
          ...insertData,
          audioUrl: data.audioUrl || '',
          duration: data.duration || null,
        };
        break;

      case 'code':
        insertData = {
          ...insertData,
          generatedCode: data.generatedCode || '',
          language: data.language || null,
        };
        break;

      case 'conversation':
        insertData = {
          ...insertData,
          messages: data.messages || [],
          model: data.model || 'unknown',
          sessionId: data.sessionId || `session_${Date.now()}`,
        };
        break;

      default:
        throw new Error(`Unsupported generation type: ${type}`);
    }

    // Insert into database
    const result = await db.insert(table).values(insertData).returning();
    
    console.log('Generation saved successfully:', { 
      type, 
      id: result[0]?.id, 
      userId: resolvedUserId 
    });
    
    return result[0];
  } catch (error) {
    console.error('Error saving generation:', error);
    throw error;
  }
}

// Get user's generations
export async function getUserGenerations(
  userId: string, 
  type?: 'image' | 'video' | 'audio' | 'code' | 'conversation',
  limit: number = 50
) {
  try {
    const resolvedUserId = await resolveUserId(userId);

    if (type) {
      // Get specific type of generations
      const tableMap = {
        image: schema.imageGenerations,
        video: schema.videoGenerations,
        audio: schema.audioGenerations,
        code: schema.codeGenerations,
        conversation: schema.conversations,
      };

      const table = tableMap[type];
      const generations = await db.query[`${type}Generations`].findMany({
        where: eq(table.userId, resolvedUserId),
        orderBy: (table, { desc }) => [desc(table.createdAt)],
        limit,
      });

      return generations;
    } else {
      // Get all generations (this would require union queries or separate calls)
      const [images, videos, audios, codes, conversations] = await Promise.all([
        db.query.imageGenerations.findMany({
          where: eq(schema.imageGenerations.userId, resolvedUserId),
          orderBy: (table, { desc }) => [desc(table.createdAt)],
          limit: Math.floor(limit / 5),
        }),
        db.query.videoGenerations.findMany({
          where: eq(schema.videoGenerations.userId, resolvedUserId),
          orderBy: (table, { desc }) => [desc(table.createdAt)],
          limit: Math.floor(limit / 5),
        }),
        db.query.audioGenerations.findMany({
          where: eq(schema.audioGenerations.userId, resolvedUserId),
          orderBy: (table, { desc }) => [desc(table.createdAt)],
          limit: Math.floor(limit / 5),
        }),
        db.query.codeGenerations.findMany({
          where: eq(schema.codeGenerations.userId, resolvedUserId),
          orderBy: (table, { desc }) => [desc(table.createdAt)],
          limit: Math.floor(limit / 5),
        }),
        db.query.conversations.findMany({
          where: eq(schema.conversations.userId, resolvedUserId),
          orderBy: (table, { desc }) => [desc(table.createdAt)],
          limit: Math.floor(limit / 5),
        }),
      ]);

      return {
        images,
        videos,
        audios,
        codes,
        conversations,
      };
    }
  } catch (error) {
    console.error('Error getting user generations:', error);
    throw error;
  }
}

// Delete generation
export async function deleteGeneration(
  type: 'image' | 'video' | 'audio' | 'code' | 'conversation',
  id: string,
  userId: string
) {
  try {
    const resolvedUserId = await resolveUserId(userId);

    const tableMap = {
      image: schema.imageGenerations,
      video: schema.videoGenerations,
      audio: schema.audioGenerations,
      code: schema.codeGenerations,
      conversation: schema.conversations,
    };

    const table = tableMap[type];
    
    const result = await db
      .delete(table)
      .where(eq(table.id, id) && eq(table.userId, resolvedUserId))
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error deleting generation:', error);
    throw error;
  }
}

export default db;
