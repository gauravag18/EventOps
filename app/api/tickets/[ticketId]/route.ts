import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ ticketId: string }> }
) {
    const { ticketId } = await context.params;

    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: ticketId },
            include: {
                event: {
                    include: {
                        organizers: true
                    }
                }
            }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
    }
}
