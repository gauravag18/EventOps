import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(getAuthOptions());
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Stripe is not configured' }, { status: 500 });
    }

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, price: true, isFree: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.isFree) {
      return NextResponse.json({ error: 'Event is free, no payment needed' }, { status: 400 });
    }

    // price is stored as a string like "49.99" or number — convert to cents
    const priceInCents = Math.round(parseFloat(String(event.price)) * 100);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      return NextResponse.json({ error: 'Invalid event price' }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        eventId: event.id,
        eventTitle: event.title,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('create-intent error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}