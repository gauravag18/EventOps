
export interface AgendaItem {
    time: string;
    title: string;
    description: string;
}

export interface Speaker {
    name: string;
    role: string;
    company: string;
    avatar: string;
}

export interface EventDetails {
    overview: string;
    agenda: AgendaItem[];
    speakers: Speaker[];
    policies: string;
}

export function packEventDescription(details: EventDetails): string {
    return JSON.stringify(details);
}

export function unpackEventDescription(description?: string | null): EventDetails {
    if (!description) {
        return {
            overview: '',
            agenda: [],
            speakers: [],
            policies: ''
        };
    }

    try {
        const parsed = JSON.parse(description);
        // Basic schema check to ensure it's our packed object and not just some random JSON
        if (parsed && typeof parsed === 'object' && 'overview' in parsed) {
            return {
                overview: parsed.overview || '',
                agenda: Array.isArray(parsed.agenda) ? parsed.agenda : [],
                speakers: Array.isArray(parsed.speakers) ? parsed.speakers : [],
                policies: parsed.policies || ''
            };
        }
    } catch (e) {
        // Not JSON, assume legacy plain text description
    }

    return {
        overview: description,
        agenda: [],
        speakers: [],
        policies: ''
    };
}
