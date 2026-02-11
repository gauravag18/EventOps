export async function fetchFromApi(path: string, options: RequestInit = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;

    // In server components, headers need to be passed for auth
    // But since this runs on both client and server, we need to be careful
    // For now, let's just do standard fetch.
    const res = await fetch(url, {
        ...options,
        cache: 'no-store' // default to dynamic for now
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(`API error: ${res.statusText}`);
    }

    return res.json();
}
