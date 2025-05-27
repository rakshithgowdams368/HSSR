// scripts/cleanup-generations.ts
import { db } from '@/lib/db';
import { lt } from 'drizzle-orm';
import { imageGenerations } from '@/lib/db/schema';

const RETENTION_DAYS = 30; // Keep images for 30 days

async function cleanupOldGenerations() {
    try {
        // Find generations older than retention period
        const cutoffDate = new Date(Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000);
        
        // Find and delete old database records
        const oldGenerations = await db
            .select({
                userId: imageGenerations.userId,
                imageUrl: imageGenerations.imageUrl
            })
            .from(imageGenerations)
            .where(lt(imageGenerations.createdAt, cutoffDate));

        // Delete old database records
        await db
            .delete(imageGenerations)
            .where(lt(imageGenerations.createdAt, cutoffDate));

        // Note: File deletion removed for Vercel compatibility
        // Vercel uses a read-only file system in production
        // Physical files in /public directory cannot be deleted at runtime
        
        console.log(`Cleaned up ${oldGenerations.length} old image generation records from database`);
        console.log('Note: Physical image files remain in storage. Consider using cloud storage for automatic cleanup.');
        
    } catch (error) {
        console.error('Error during generations cleanup:', error);
    }
}

export default cleanupOldGenerations;
