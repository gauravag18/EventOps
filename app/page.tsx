import CursorHighlight from '@/components/CursorHighlight';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function LandingPage() {
  const featuredEvents = await prisma.event.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      participants: true
    }
  });

  return (
    <div className="bg-linear-to-b from-[#F4F7F9] to-[#EDF1F5] font-sans text-gray-700">
      <CursorHighlight />

      {/*  HERO  */}
      <section className="relative flex flex-col lg:block overflow-hidden border-b-2 border-charcoal-blue bg-attendee-surface">

        <div className="w-full min-h-[60vh] lg:min-h-[90vh] bg-attendee-surface text-charcoal-blue flex flex-col justify-center px-8 pt-32 pb-20 lg:pt-40 lg:pb-32 lg:pl-20 lg:pr-[45%] relative group cursor-default">
          {/* Subtle pattern for texture */}
          <div className="absolute inset-0 opacity-[0.03] transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `radial-gradient(circle, #0F766E 2px, transparent 2px)`, backgroundSize: '32px 32px' }} />

          <div className="relative z-10 w-full max-w-2xl mx-auto lg:mr-auto lg:ml-0 flex flex-col items-start lg:pl-4">

            <h1 className="text-6xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] mb-6 drop-shadow-sm">
              Find Your<br />
              <span className="text-muted-teal">Next Vibe.</span>
            </h1>

            <p className="text-xl text-steel-gray font-medium mb-12 leading-relaxed max-w-lg">
              Discover local meetups, epic conferences, and exclusive shows. Secure your spot in seconds and let the experience begin.
            </p>

            <Link
              href="/events"
              className="inline-flex items-center gap-4 border-2 border-charcoal-blue bg-muted-teal text-white px-10 py-5 text-base font-bold tracking-widest uppercase hover:bg-charcoal-blue hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(31,42,55,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 group/btn"
            >
              Browse Events
              <svg className="h-5 w-5 transition-transform group-hover/btn:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-muted-teal bg-white backdrop-blur-sm shadow-sm flex items-center justify-center`}>
                    <svg className="h-5 w-5 text-muted-teal/70" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-muted-teal bg-muted-teal flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  +
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-charcoal-blue leading-none">2M+</p>
                <p className="text-xs font-bold text-steel-gray uppercase tracking-widest mt-1">Tickets Sold</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:absolute lg:top-0 lg:right-0 lg:w-[45%] lg:h-full bg-organizer-surface text-charcoal-blue flex flex-col justify-center px-8 pt-32 pb-20 lg:pt-40 lg:pb-32 lg:pl-12 lg:pr-20 relative group overflow-hidden cursor-default lg:[clip-path:polygon(15%_0,100%_0,100%_100%,0%_100%)] border-t-2 lg:border-t-0 border-charcoal-blue">
          {/* Intense pattern for contrast */}
          <div className="absolute inset-0 opacity-[0.03] transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `repeating-linear-gradient(45deg, #C2410C 0, #C2410C 3px, transparent 0, transparent 50%)`, backgroundSize: '40px 40px' }} />

          <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-start lg:items-center lg:text-center text-left lg:pl-10">

            <h2 className="text-4xl lg:text-[2.75rem] font-black tracking-tight leading-[1.05] mb-6 drop-shadow-sm">
              Hosting<br className="hidden lg:block" />an Event?
            </h2>

            <p className="text-lg text-steel-gray font-medium mb-10 leading-relaxed max-w-xs mx-auto">
              Launch events instantly. Track live sales, manage check-ins, and scale effortlessly.
            </p>

            <Link
              href="/organizer/create-event"
              className="inline-flex items-center gap-3 border-2 border-charcoal-blue bg-signal-orange text-white px-6 py-4 text-xs font-bold tracking-widest uppercase hover:bg-charcoal-blue hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(31,42,55,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5"
            >
              Start Creating
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
          </div>
        </div>

      </section>

      {/*  FEATURES */}
      <section className="relative bg-gray-950 text-white py-28 overflow-hidden">

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
              Whether you're attending or hosting — we've got you covered.
            </p>
          </div>

          {/* Split Layout */}
          <div className="grid lg:grid-cols-2 gap-10">

            {/* ATTENDEES */}
            <div className="group relative border border-teal-500/30 bg-teal-500/5 p-10 hover:bg-teal-500/10 transition-all">

              <h3 className="text-3xl font-black text-teal-400 mb-8">
                For Attendees
              </h3>

              <div className="space-y-8">

                {[
                  {
                    title: "Discover Events",
                    desc: "Find curated meetups, concerts, and experiences near you."
                  },
                  {
                    title: "Instant Booking",
                    desc: "Book tickets in seconds with seamless checkout."
                  },
                  {
                    title: "Smart Entry",
                    desc: "QR-based tickets for fast and secure check-ins."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group/item">

                    <div className="w-10 h-10 flex items-center justify-center border border-teal-400 text-teal-400 font-bold">
                      {i + 1}
                    </div>

                    <div>
                      <h4 className="font-bold text-lg group-hover/item:text-teal-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                ))}

              </div>

            </div>

            {/* ORGANIZERS */}
            <div className="group relative border border-orange-500/30 bg-orange-500/5 p-10 hover:bg-orange-500/10 transition-all">

              <h3 className="text-3xl font-black text-orange-400 mb-8">
                For Organizers
              </h3>

              <div className="space-y-8">

                {[
                  {
                    title: "Launch in Minutes",
                    desc: "Create and publish events with zero friction."
                  },
                  {
                    title: "Live Analytics",
                    desc: "Track sales, attendees, and performance in real-time."
                  },
                  {
                    title: "Effortless Check-ins",
                    desc: "Scan QR codes and manage entries seamlessly."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group/item">

                    <div className="w-10 h-10 flex items-center justify-center border border-orange-400 text-orange-400 font-bold">
                      {i + 1}
                    </div>

                    <div>
                      <h4 className="font-bold text-lg group-hover/item:text-orange-300">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/*  TRENDING & FEATURED  */}
      <section className="min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-6 py-24 w-full">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-black md:text-5xl">
              Trending &amp; Featured Events
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Discover what's happening near you right now
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">

  {featuredEvents.map((event, index) => {
    const locationParts = event.location ? event.location.split('|') : ['TBD'];
    const displayLocation = locationParts[0];

    const isFeatured = index === 0;

    return (
      <div
        key={event.id}
        className={`group relative overflow-hidden border-2 border-gray-200 bg-white transition-all duration-500 
        ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}
        hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1`}
      >

        {/* IMAGE */}
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-16/10' : 'aspect-video'}`}>

          {event.image && (
            <img
              src={event.image}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

          {/* TOP BADGE */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-red-500 text-white text-xs px-3 py-1 font-bold tracking-wider">
              TRENDING
            </span>
            {isFeatured && (
              <span className="bg-yellow-400 text-black text-xs px-3 py-1 font-bold tracking-wider">
                FEATURED
              </span>
            )}
          </div>

          {/* LOCATION */}
          <div className="absolute bottom-4 left-4 text-white text-sm flex items-center gap-2">
            <span>📍</span>
            <span>{displayLocation}</span>
          </div>

        </div>

        {/* CONTENT */}
        <div className="p-6">

          <div className="mb-2 text-xs text-gray-500 uppercase tracking-wider">
            {event.category}
          </div>

          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition">
            {event.title}
          </h3>

          <div className="mt-3 flex items-center justify-between">

            <div>
              <div className="text-xs text-gray-500">Starting from</div>
              <div className="text-lg font-bold">
                {event.isFree ? 'Free' : `$${event.price}`}
              </div>
            </div>

            <Link
              href={`/event/${event.id}`}
              className="opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 text-sm font-bold border-b-2 border-black"
            >
              View →
            </Link>

          </div>

        </div>

      </div>
    );
  })}
</div>
          <div className="mt-16 text-center">
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 border-b-2 border-teal-600 pb-1 font-sans text-lg font-bold text-teal-700 tracking-widest transition-all hover:bg-teal-50 hover:px-4"
            >
              Explore All Events
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t-2 border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="text-xl font-extrabold tracking-tighter text-gray-900">EventOps</span>
            <p className="text-sm font-medium text-gray-500 tracking-wider">
              © 2026 EventOps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}