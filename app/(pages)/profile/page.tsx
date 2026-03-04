import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await getServerSession(getAuthOptions());

    if (!session || !session.user?.email) {
        redirect("/login");
    }

    const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            _count: {
                select: { organizedEvents: true, participatingEvents: true, tickets: true }
            }
        }
    });

    if (!dbUser) {
        redirect("/login");
    }

    // A heuristic for Google OAuth since the Account model isn't populated
    const isOAuthLinked = dbUser.image?.includes("googleusercontent.com") || false;

    const userData = {
        id: dbUser.id,
        name: dbUser.name ?? "",
        email: dbUser.email,
        image: dbUser.image,
        isOAuthLinked,
        organizedCount: dbUser._count.organizedEvents,
        attendedCount: dbUser._count.tickets,
        createdAt: dbUser.createdAt.toISOString()
    };

    return <ProfileClient user={userData} />;
}
