"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function OrganizerFilterBar({ current }: { current: string }) {
    const router = useRouter();
    const options = [
        { label: "All Events", value: "all" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Ended", value: "ENDED" },
    ];

    return (
        <select
            value={current}
            onChange={e => router.push(`?status=${e.target.value}`)}
            className="border-b-2 border-gray-200 bg-transparent py-1 pl-3 pr-8 text-sm font-bold tracking-wide text-charcoal-blue focus:border-charcoal-blue focus:ring-0 cursor-pointer hover:border-signal-orange transition-colors"
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
    );
}
