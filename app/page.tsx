import CursorHighlight from '@/components/CursorHighlight';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import Link from 'next/link';
import { LoadingLink } from '@/components/Loaders';

// Caching stats for 10 minutes for high performance during presentation
async function getMangaStats() {
  const CACHE_KEY = 'manga:stats';
  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const [tickets, events] = await Promise.all([
      prisma.ticket.count(),
      prisma.event.count()
    ]);
    
    const stats = { tickets, events };
    await redis.setex(CACHE_KEY, 600, JSON.stringify(stats));
    return stats;
  } catch (e) {
    console.error("Cache error, falling back to live stats", e);
    const [tickets, events] = await Promise.all([
      prisma.ticket.count(),
      prisma.event.count()
    ]);
    return { tickets, events };
  }
}

export default async function LandingPage() {
  const [featuredEvents, stats] = await Promise.all([
    prisma.event.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
          id: true,
          title: true,
          category: true,
          date: true,
          image: true,
          isFree: true,
          price: true,
          location: true,
      }
    }),
    getMangaStats(),
  ]);

  const totalTickets = stats.tickets;
  const totalEvents = stats.events;

  return (
    <div className="bg-linear-to-b from-[#F4F7F9] to-[#EDF1F5] font-sans text-gray-700">
      <CursorHighlight />

      {/* ── HERO — Manga Panel Split ── */}
      <section className="relative overflow-hidden border-b-4 border-black">

        {/* ── Desktop manga background layers (clip-path creates the diagonal slash) ── */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none" style={{ height: '100dvh' }}>
          {/* Left teal panel */}
          <div className="absolute inset-0 bg-attendee-surface"
            style={{ clipPath: 'polygon(0 0, 62% 0, 53% 100%, 0 100%)' }} />
          {/* Left halftone dots */}
          <div className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage: 'radial-gradient(circle, #0F766E 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
              clipPath: 'polygon(0 0, 62% 0, 53% 100%, 0 100%)',
            }} />
          {/* Left speed lines — Ultra-subtle action wisps */}
          <div className="absolute inset-0"
            style={{
              clipPath: 'polygon(0 0, 62% 0, 53% 100%, 0 100%)',
              background: 'repeating-conic-gradient(from 0deg at 31% 65%, transparent 0deg, transparent 0.6deg, rgba(15,118,110,0.06) 0.6deg, rgba(15,118,110,0.06) 1.1deg)',
              mixBlendMode: 'multiply'
            }} />
          {/* Right orange panel */}
          <div className="absolute inset-0 bg-organizer-surface"
            style={{ clipPath: 'polygon(65% 0, 100% 0, 100% 100%, 56% 100%)' }} />
          {/* Right speed lines — Minimal focal hints */}
          <div className="absolute inset-0"
            style={{
              clipPath: 'polygon(65% 0, 100% 0, 100% 100%, 56% 100%)',
              background: 'repeating-conic-gradient(from 0deg at 82% 60%, transparent 0deg, transparent 0.6deg, rgba(194,65,12,0.07) 0.6deg, rgba(194,65,12,0.07) 1.1deg)',
              mixBlendMode: 'multiply'
            }} />
          {/* ── THE MANGA SLASH ── thick black diagonal divider */}
          <div className="absolute inset-0"
            style={{ background: '#0D0F14', clipPath: 'polygon(62% 0, 65% 0, 56% 100%, 53% 100%)' }} />
          {/* Thin white highlight on right edge of slash (depth) */}
          <div className="absolute inset-0 opacity-25"
            style={{ background: 'white', clipPath: 'polygon(64.7% 0, 65% 0, 56% 100%, 55.7% 100%)' }} />
        </div>

        {/* ── Content grid ── */}
        <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-[62fr_38fr] lg:h-[100dvh] pt-16">

          {/* LEFT — Attendee Panel */}
          <div className="bg-attendee-surface lg:bg-transparent flex flex-col items-center justify-center text-center
                          px-8 pt-32 pb-20 lg:pt-32 lg:pb-24 lg:pl-20 lg:pr-32
                          border-b-4 lg:border-b-0 border-black relative cursor-default">
            {/* Mobile dot pattern */}
            <div className="absolute inset-0 opacity-[0.035] lg:hidden"
              style={{ backgroundImage: 'radial-gradient(circle, #0F766E 2px, transparent 2px)', backgroundSize: '28px 28px' }} />

            <div className="relative z-10 max-w-xl flex flex-col items-center lg:items-center">
              {/* Manga panel label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-muted-teal" />
                <span className="text-[10px] font-black tracking-[0.45em] text-muted-teal/60 uppercase">01 / Attendee</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-[5.75rem] font-black tracking-tighter leading-[1.02] mb-6 text-charcoal-blue drop-shadow-sm">
                Find Your<br />
                <span className="text-muted-teal italic">Next Vibe.</span>
              </h1>

              <p className="max-w-md text-[#556987] text-base sm:text-lg font-medium leading-relaxed mb-8">
                Discover local meetups, epic conferences, and exclusive shows. Secure your spot in seconds.
              </p>

              <LoadingLink
                href="/events"
                className="inline-flex items-center gap-4 border-2 border-charcoal-blue bg-muted-teal text-white px-10 py-5 text-base font-bold tracking-widest uppercase hover:bg-charcoal-blue hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(31,42,55,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 group/btn"
              >
                Browse Events
                <svg className="h-5 w-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </LoadingLink>

              {/* Live stats */}
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-muted-teal bg-white shadow-sm flex items-center justify-center">
                      <svg className="h-5 w-5 text-muted-teal/70" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-muted-teal bg-muted-teal flex items-center justify-center text-xs font-bold text-white shadow-sm">+</div>
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-charcoal-blue leading-none">
                    {totalTickets > 0 ? `${totalTickets.toLocaleString()}+` : '0'}
                  </p>
                  <p className="text-xs font-bold text-steel-gray uppercase tracking-widest mt-1">Tickets Booked</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Organizer Panel */}
          <div className="bg-organizer-surface lg:bg-transparent flex flex-col items-center justify-center text-center
                          px-8 pt-16 pb-16 lg:pt-20 lg:pb-20 lg:pl-20 lg:pr-12
                          relative cursor-default">
            {/* Mobile hatch pattern */}
            <div className="absolute inset-0 opacity-[0.025] lg:hidden"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C2410C 0, #C2410C 2px, transparent 0, transparent 50%)', backgroundSize: '24px 24px' }} />

            <div className="relative z-10 max-w-xs flex flex-col items-center lg:items-center">
              {/* Manga panel label */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-8 bg-signal-orange" />
                <span className="text-[10px] font-black tracking-[0.45em] text-signal-orange/60 uppercase">02 / Organizer</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight leading-[1.05] mb-6 text-charcoal-blue drop-shadow-sm">
                Hosting <br className="hidden lg:block" /> an Event?
              </h2>

              <p className="max-w-xs text-steel-gray text-base font-medium leading-relaxed mb-8">
                Launch events instantly. Track live sales, manage check-ins, and scale effortlessly.
              </p>

              <LoadingLink href="/organizer/create-event" 
                className="inline-flex items-center gap-3 border-2 border-charcoal-blue bg-signal-orange text-white px-6 py-4 text-xs font-bold tracking-widest uppercase hover:bg-charcoal-blue hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(31,42,55,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 cursor-pointer"
              >
                Start Creating
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </LoadingLink>

              {/* Live event count */}
              <div className="mt-12 flex items-center gap-4 border-t border-black/10 pt-8">
                <div className="text-left">
                  <p className="text-2xl font-black text-charcoal-blue leading-none">
                    {totalEvents > 0 ? `${totalEvents.toLocaleString()}+` : '0'}
                  </p>
                  <p className="text-xs font-bold text-steel-gray uppercase tracking-widest mt-1">Events Created</p>
                </div>
                <div className="h-8 w-px bg-black/10" />
                <div className="text-left">
                  <p className="text-2xl font-black text-charcoal-blue leading-none">Free</p>
                  <p className="text-xs font-bold text-steel-gray uppercase tracking-widest mt-1">To Publish</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/*  FEATURES */}
      <section className="relative bg-gray-950 text-white lg:min-h-[90vh] flex flex-col justify-center py-20 lg:py-20 overflow-hidden">

        {/* Background accents */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6">

          {/* Heading */}
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tight mb-4">
              Built for Both Sides of the Experience
            </h2>
            <p className="text-gray-400 text-lg">
              Whether you&apos;re attending or hosting — we&apos;ve got you covered.
            </p>
          </div>

          {/* Split Layout */}
          <div className="grid lg:grid-cols-2 gap-10">

            {/* ATTENDEES */}
            <div className="group relative border border-teal-500/30 bg-teal-500/5 p-10 hover:bg-teal-500/10 transition-all">
              <h3 className="text-3xl font-black text-teal-400 mb-8">For Attendees</h3>
              <div className="space-y-8">
                {[
                  { title: "Discover Events", desc: "Find curated meetups, concerts, and experiences near you." },
                  { title: "Instant Booking", desc: "Book tickets in seconds with seamless checkout." },
                  { title: "Smart Entry", desc: "QR-based tickets for fast and secure check-ins." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group/item">
                    <div className="w-10 h-10 flex items-center justify-center border border-teal-400 text-teal-400 font-bold shrink-0">{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-lg group-hover/item:text-teal-300">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ORGANIZERS */}
            <div className="group relative border border-orange-500/30 bg-orange-500/5 p-10 hover:bg-orange-500/10 transition-all">
              <h3 className="text-3xl font-black text-orange-400 mb-8">For Organizers</h3>
              <div className="space-y-8">
                {[
                  { title: "Launch in Minutes", desc: "Create and publish events with zero friction." },
                  { title: "Live Analytics", desc: "Track sales, attendees, and performance in real-time." },
                  { title: "Effortless Check-ins", desc: "Scan QR codes and manage entries seamlessly." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group/item">
                    <div className="w-10 h-10 flex items-center justify-center border border-orange-400 text-orange-400 font-bold shrink-0">{i + 1}</div>
                    <div>
                      <h4 className="font-bold text-lg group-hover/item:text-orange-300">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/*  TRENDING & FEATURED  */}
      <section className="lg:min-h-[90vh] flex flex-col justify-center py-20 border-t-2 border-gray-900">
        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-black md:text-5xl">
              Trending &amp; Featured Events
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Discover what&apos;s happening near you right now
            </p>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid gap-10 lg:grid-cols-3">
              {featuredEvents.map((event, index) => {
                const displayLocation = event.location ? event.location.split('|')[0] : 'TBD';
                const isFeatured = index === 0;
                return (
                  <div
                    key={event.id}
                    className={`group relative overflow-hidden border-2 border-gray-200 bg-white transition-all duration-500
                      ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}
                      hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1`}
                  >
                    <div className={`relative overflow-hidden ${isFeatured ? 'aspect-16/10' : 'aspect-video'}`}>
                      {event.image && (
                        <img src={event.image} alt={event.title}
                          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110" />
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-red-500 text-white text-xs px-3 py-1 font-bold tracking-wider">TRENDING</span>
                        {isFeatured && <span className="bg-yellow-400 text-black text-xs px-3 py-1 font-bold tracking-wider">FEATURED</span>}
                      </div>
                      <div className="absolute bottom-4 left-4 text-white text-sm flex items-center gap-2">
                        <span>📍</span><span>{displayLocation}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-2 text-xs text-gray-500 uppercase tracking-wider">{event.category}</div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition">{event.title}</h3>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500">Starting from</div>
                          <div className="text-lg font-bold">{event.isFree ? 'Free' : `$${event.price}`}</div>
                        </div>
                        <LoadingLink
                          center={true}
                          href={`/event/${event.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-sm font-bold border-b-2 border-black cursor-pointer">
                          View →
                        </LoadingLink>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">No events yet — be the first to create one!</p>
              <LoadingLink href="/organizer/create-event"
                className="inline-flex items-center gap-2 border-2 border-charcoal-blue bg-signal-orange text-white px-6 py-3 text-sm font-bold tracking-widest uppercase hover:bg-charcoal-blue transition-all">
                Create an Event
              </LoadingLink>
            </div>
          )}

          <div className="mt-10 text-center">
            <LoadingLink
              href="/events"
              className="group inline-flex items-center gap-2 border-b-2 border-teal-600 pb-1 font-sans text-lg font-bold text-teal-700 tracking-widest transition-all hover:bg-teal-50 hover:px-4 cursor-pointer"
            >
              Explore All Events
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </LoadingLink>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-4 border-black bg-[#0D0F14] py-12 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <span className="text-2xl font-extrabold tracking-tighter text-white">EventOps</span>
              <p className="text-sm text-white/40 mt-1 max-w-xs">Orchestrating seamless event experiences with precision and scalability.</p>
            </div>
            <div className="flex flex-wrap gap-8 text-sm">
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/30">Navigate</p>
                <div className="flex flex-col gap-1">
                  <Link href="/events" className="text-white/60 hover:text-white transition">Browse Events</Link>
                  <Link href="/organizer/create-event" className="text-white/60 hover:text-white transition">Create Event</Link>
                  <Link href="/messages" className="text-white/60 hover:text-white transition">Messages</Link>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-widest uppercase text-white/30">Account</p>
                <div className="flex flex-col gap-1">
                  <Link href="/attendee/dashboard" className="text-white/60 hover:text-white transition">My Tickets</Link>
                  <Link href="/organizer/dashboard" className="text-white/60 hover:text-white transition">Dashboard</Link>
                  <Link href="/profile" className="text-white/60 hover:text-white transition">Profile</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/30 tracking-wider">© 2026 EventOps. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-teal animate-pulse" />
              <span className="text-xs text-white/30">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}