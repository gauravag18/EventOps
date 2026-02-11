'use client';

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerForEvent } from "@/app/actions/event";

interface RegisterButtonProps {
    eventId: string;
    isFull: boolean;
    isRegistered: boolean;
}

export default function RegisterButton({ eventId, isFull, isRegistered }: RegisterButtonProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async () => {
        if (!session) {
            router.push(`/login?error=${encodeURIComponent("You must be logged in to register for an event.")}`);
            return;
        }

        setLoading(true);
        try {
            const res = await registerForEvent(eventId);
            if (res.success) {
                router.refresh();
            } else {
                alert(res.message);
            }
        } catch (e) {
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
            router.refresh();
        }
    };

    if (isRegistered) {
        return (
            <button disabled className="w-full border-2 border-gray-300 bg-gray-100 px-8 py-4 text-sm font-bold uppercase tracking-widest text-gray-500 cursor-not-allowed opacity-75">
                Already Registered
            </button>
        );
    }

    if (isFull) {
        return (
            <button disabled className="w-full border-2 border-gray-300 bg-gray-100 px-8 py-4 text-sm font-bold uppercase tracking-widest text-gray-500 cursor-not-allowed opacity-75">
                Sold Out
            </button>
        );
    }

    return (
        <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full border-2 border-muted-teal bg-muted-teal px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-white hover:text-muted-teal disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Processing...' : 'Register Now'}
        </button>
    );
}
