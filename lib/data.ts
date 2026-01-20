
export const EVENTS = [
    {
        id: '1',
        title: "Global Developer Summit 2026",
        tagline: "Building the future of software, together.",
        date: "Oct 15, 2026",
        time: "09:00 AM – 06:00 PM PST",
        location: "Moscone Center, San Francisco, CA",
        description: `Experience the most anticipated developer conference of the year. The Global Developer Summit brings together over 5,000 engineers, designers, and product leaders for three days of immersive workshops, keynotes, and networking. \n\nDive deep into the latest trends in AI, Cloud Computing, and Web Architectures. Whether you are a junior dev or a seasoned CTO, there is something for everyone.`,
        category: "Technology",
        price: "$299",
        spotsLeft: 42,
        organizer: "DevCommunity Inc.",
        image: "/placeholder-1.jpg",
    },
    {
        id: '2',
        title: "AI & Ethics Symposium",
        tagline: "Navigating the moral landscape of artificial intelligence.",
        date: "Nov 02, 2026",
        time: "10:00 AM – 04:00 PM GMT",
        location: "Barbican Centre, London, UK",
        category: "AI",
        description: "Join leading ethicists, researchers, and policymakers for a critical dialogue on the future of responsible AI. Topics include bias mitigation, regulatory frameworks, and human-AI collaboration.",
        price: "Free",
        spotsLeft: 120,
        organizer: "OpenAI Watch",
        image: "/placeholder-2.jpg",
    },
    {
        id: '3',
        title: "React Native Deep Dive",
        tagline: "Master cross-platform development.",
        date: "Dec 10, 2026",
        time: "08:00 AM – 12:00 PM PST",
        location: "Remote / Online",
        category: "Mobile Dev",
        description: "A focused, hands-on workshop designed to take your React Native skills to the next level. Learn about the new architecture, performance optimization, and native module integration.",
        price: "$50",
        spotsLeft: 15,
        organizer: "React Training",
        image: "/placeholder-3.jpg",
    },
    {
        id: '4',
        title: "Product Design Leadership 2027",
        tagline: "Shaping products that shape the world.",
        date: "Jan 15, 2027",
        time: "09:00 AM – 05:00 PM EST",
        location: "Javits Center, New York, NY",
        category: "Design",
        description: "For design managers, VPs, and creative directors. Explore strategies for scaling design teams, fostering creativity, and driving business value through design excellence.",
        price: "$450",
        spotsLeft: 8,
        organizer: "DesignObs",
        image: "/placeholder-4.jpg",
    },
    {
        id: '5',
        title: "Cybersecurity Ops Workshop",
        tagline: "Defend against the next generation of threats.",
        date: "Feb 20, 2027",
        time: "09:00 AM – 03:00 PM CET",
        location: "Berlin Congress Center, DE",
        category: "Security",
        description: "Practical simulations and red-teaming exercises. enhancing your organization's security posture against ransomware, phishing, and supply chain attacks.",
        price: "$199",
        spotsLeft: 55,
        organizer: "SecNet Europe",
        image: "/placeholder-5.jpg",
    },
];

export const CATEGORIES = ["All Events", "Technology", "Design", "Business", "Marketing", "Security"];

export const TRENDING = [
    { title: "HackTheFuture 2026", attendees: "1.2k attending" },
    { title: "DevOps Days: Austin", attendees: "850 attending" },
    { title: "UX Crunch London", attendees: "600 attending" },
];

export function getEvent(id: string) {
    return EVENTS.find((event) => event.id === id);
}
