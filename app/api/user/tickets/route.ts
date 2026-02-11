import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const session = await getServerSession(getAuthOptions());

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const tickets = await prisma.ticket.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                event: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Also fetch recommended events logic here if user wants the full dashboard data in one go?
        // Or keep it separate. The dashboard page did logic for "recommended".
        // Let's just return tickets here.

        return NextResponse.json({ tickets });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
    }
}
