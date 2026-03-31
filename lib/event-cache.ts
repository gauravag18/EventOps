import { redis } from './redis';

const LIST_CACHE_PREFIX = 'events:list';
const DETAIL_CACHE_PREFIX = 'event:detail';
const CACHE_TTL = 60 * 30; // 30 minutes (more stable for presentation)

// List Caching (existing)
export async function getCachedEvents(keySuffix: string) {
    try {
        const data = await redis.get(`${LIST_CACHE_PREFIX}:${keySuffix}`);
        if (data) console.log(`[REDIS] List Cache HIT: ${keySuffix}`);
        else console.log(`[REDIS] List Cache MISS: ${keySuffix}`);
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
        if (data) {
            console.log(`[REDIS] Detail Cache HIT: ${eventId}`);
            return JSON.parse(data);
        }
        console.log(`[REDIS] Detail Cache MISS: ${eventId}`);
        return null;
    } catch (error) {
        console.error('Redis get event error:', error);
        return null;
    }
}

export async function cacheEvent(eventId: string, event: any, soldCount: number) {
    try {
        const cacheData = { ...event, soldCount };
        console.log(`[REDIS] Setting Detail Cache (with count): ${eventId}`);
        await redis.setex(`${DETAIL_CACHE_PREFIX}:${eventId}`, CACHE_TTL, JSON.stringify(cacheData));
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
            
            // Also prefix-match and delete any user-specific caches for this event 
            // so they get fresh registration/team data next time
            const userKeys = await redis.keys(`user-event:*:${eventId}`);
            if (userKeys.length > 0) {
                await redis.del(...userKeys);
            }
        }
    } catch (error) {
        console.error('Redis delete error:', error);
    }
}

// User-Specific Registration/Team Cache
const USER_EVENT_TTL = 300; // 5 minutes

export async function getCachedUserEventState(userId: string, eventId: string) {
    try {
        const key = `user-event:${userId}:${eventId}`;
        const data = await redis.get(key);
        if (data) console.log(`[REDIS] User-Event HIT: ${userId}:${eventId}`);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis get user-event error:', error);
        return null;
    }
}

export async function cacheUserEventState(userId: string, eventId: string, state: any) {
    try {
        const key = `user-event:${userId}:${eventId}`;
        await redis.setex(key, USER_EVENT_TTL, JSON.stringify(state));
    } catch (error) {
        console.error('Redis set user-event error:', error);
    }
}
