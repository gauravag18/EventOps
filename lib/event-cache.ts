import { redis } from './redis';

const LIST_CACHE_PREFIX = 'events:list';
const DETAIL_CACHE_PREFIX = 'event:detail';
const CACHE_TTL = 60 * 5; // 5 minutes

// List Caching (existing)
export async function getCachedEvents(keySuffix: string) {
    try {
        const data = await redis.get(`${LIST_CACHE_PREFIX}:${keySuffix}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
}

export async function cacheEvents(keySuffix: string, data: any) {
    try {
        await redis.setex(`${LIST_CACHE_PREFIX}:${keySuffix}`, CACHE_TTL, JSON.stringify(data));
    } catch (error) {
        console.error('Redis set error:', error);
    }
}

// Single Event Caching (new)
export async function getCachedEvent(eventId: string) {
    try {
        const data = await redis.get(`${DETAIL_CACHE_PREFIX}:${eventId}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis get event error:', error);
        return null;
    }
}

export async function cacheEvent(eventId: string, data: any) {
    try {
        await redis.setex(`${DETAIL_CACHE_PREFIX}:${eventId}`, CACHE_TTL, JSON.stringify(data));
    } catch (error) {
        console.error('Redis set event error:', error);
    }
}

export async function invalidateEventCache(eventId?: string) {
    try {
        // Always clear list caches as any change might affect lists
        const listKeys = await redis.keys(`${LIST_CACHE_PREFIX}:*`);
        if (listKeys.length > 0) {
            await redis.del(...listKeys);
        }

        // If specific event ID provided, clear that too
        if (eventId) {
            await redis.del(`${DETAIL_CACHE_PREFIX}:${eventId}`);
        }
    } catch (error) {
        console.error('Redis delete error:', error);
    }
}
