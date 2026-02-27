import CursorHighlight from '@/components/CursorHighlight';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

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
    <div className="min-h-screen bg-off-white font-sans text-charcoal-blue overflow-x-hidden">
      <CursorHighlight />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full bg-muted-teal/10 blur-[120px] mix-blend-multiply" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[80%] rounded-full bg-signal-orange/10 blur-[150px] mix-blend-multiply" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[50%] rounded-full bg-charcoal-blue/5 blur-[100px] mix-blend-multiply" />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(31,42,55,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(31,42,55,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_20%,transparent_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
            {/* Left Column Component */}
            <div className="flex-1 text-center lg:text-left pt-12 lg:pt-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-slate/50 border border-soft-slate mb-8 w-fit mx-auto lg:mx-0">
                <span className="flex h-2 w-2 rounded-full bg-muted-teal">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-muted-teal opacity-75"></span>
                </span>
                <span className="text-xs font-semibold tracking-wide text-steel-gray uppercase">
                  Next-Gen Event Management
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-charcoal-blue mb-6 leading-[1.1]">
                Orchestrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-muted-teal to-charcoal-blue">unforgettable</span> experiences.
              </h1>

              <p className="text-lg lg:text-xl text-steel-gray mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                The all-in-one platform for modern organizers. Sell tickets, engage attendees, and analyze performance with powerful, intuitive tools.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/organizer/create-event"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-charcoal-blue text-white font-bold rounded-xl overflow-hidden shadow-lg shadow-charcoal-blue/20 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] skew-x-[-15deg] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></div>
                  <span className="relative flex items-center gap-2">
                    Create Event
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/events"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white border-2 border-soft-slate text-charcoal-blue font-bold rounded-xl transition-all hover:border-charcoal-blue hover:bg-off-white"
                >
                  Explore Events
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 border-t border-soft-slate pt-8">
                <div>
                  <div className="text-3xl font-extrabold text-charcoal-blue">50k+</div>
                  <div className="text-sm text-steel-gray font-medium">Events Hosted</div>
                </div>
                <div className="w-px h-10 bg-soft-slate"></div>
                <div>
                  <div className="text-3xl font-extrabold text-charcoal-blue">2M+</div>
                  <div className="text-sm text-steel-gray font-medium">Happy Attendees</div>
                </div>
                <div className="w-px h-10 bg-soft-slate"></div>
                <div>
                  <div className="text-3xl font-extrabold text-charcoal-blue">99%</div>
                  <div className="text-sm text-steel-gray font-medium">Uptime</div>
                </div>
              </div>
            </div>

            {/* Right Column Component (Visual) */}
            <div className="flex-1 relative hidden md:block w-full max-w-lg mx-auto lg:max-w-none">
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] bg-gradient-to-br from-soft-slate/40 to-white/10 border border-white/40 shadow-2xl overflow-hidden backdrop-blur-xl group">
                {/* Floating "Dashboard UI" */}
                <div className="absolute inset-4 rounded-[1.75rem] border border-white/50 bg-white/60 shadow-inner overflow-hidden flex flex-col backdrop-blur-md">
                  <div className="h-14 border-b border-soft-slate/50 bg-white/40 flex items-center px-4 gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="ml-4 h-6 px-4 rounded-md bg-white/60 border border-soft-slate/50 text-xs font-medium text-steel-gray flex items-center shadow-xs">
                      app.eventops.com
                    </div>
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-6 relative">
                    <div className="flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="h-4 w-24 rounded-full bg-soft-slate"></div>
                        <div className="h-8 w-32 rounded-lg bg-charcoal-blue"></div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-muted-teal/20 flex items-center justify-center">
                        <div className="h-5 w-5 rounded-sm bg-muted-teal"></div>
                      </div>
                    </div>
                    {/* Simulated Graph */}
                    <div className="flex-1 border border-soft-slate/50 rounded-xl bg-white/40 relative overflow-hidden group-hover:bg-white/60 transition-colors duration-500">
                      <svg className="absolute bottom-0 w-full h-full preserve-3d" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0,100 L0,50 Q25,30 50,60 T100,40 L100,100 Z" className="fill-muted-teal/10 animate-pulse" />
                        <path d="M0,50 Q25,30 50,60 T100,40" className="fill-none stroke-muted-teal stroke-2 vector-effect-non-scaling-stroke" />
                      </svg>
                    </div>
                    {/* Floating Ticket Element */}
                    <div className="absolute -bottom-8 -right-8 w-48 bg-white p-4 rounded-xl shadow-2xl border border-soft-slate hover:-translate-y-2 transition-transform duration-500 delay-100 rotate-[-5deg]">
                      <div className="flex justify-between items-center mb-3">
                        <div className="h-3 w-16 bg-signal-orange/20 rounded-full"></div>
                        <div className="text-[10px] font-bold text-signal-orange border border-signal-orange/30 px-2 py-0.5 rounded">VIP</div>
                      </div>
                      <div className="h-4 w-24 bg-charcoal-blue/80 rounded mb-2"></div>
                      <div className="h-3 w-32 bg-soft-slate rounded mb-4"></div>
                      <div className="border-t border-dashed border-soft-slate pt-3 flex items-center justify-between">
                        <div className="font-mono text-xs font-bold text-charcoal-blue">Scan to Check-in</div>
                        <div className="h-6 w-6 bg-charcoal-blue rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="relative py-24 bg-charcoal-blue text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnPmZpbGw9IiNmZmYiPjxwYXRoIGQ9Ik0zNiAzNHYtNGgtMnY0aC00djJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTR2Mmg0djRoMnYtNGg0VjRoLTR6bS0yMCAyMHYtNGgtMnY0SC0ydjJoNHY0aDJ2LTRoNHYtMmgtNHptMC0zMFYwaC0ydjRoLTF2MmgxdjRoMnYtNGg0VjRoLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Everything you need to run <span className="text-signal-orange">successful events</span>
            </h2>
            <p className="text-lg text-soft-slate/80">
              Powerful tools built specifically for modern event organizers. From robust analytics to seamless check-ins.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                ),
                title: "Smart Ticketing",
                desc: "Create multiple ticket tiers, custom checkout questions, and automate receipt delivery securely."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Live Insights",
                desc: "Monitor ticket sales, page views, and revenue in real-time with comprehensive dashboards."
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                ),
                title: "QR Check-in",
                desc: "Lightning-fast entry with mobile QR scanning. Prevent fraud and keep queues moving."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group relative bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-20 transition-all duration-500">
                  {feature.icon}
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center text-signal-orange mb-6 border border-white/5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-soft-slate/70 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-charcoal-blue mb-4">
                Discover Featured Events
              </h2>
              <p className="text-lg text-steel-gray">
                Secure your spot at the most anticipated gatherings this season.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-muted-teal font-bold hover:gap-3 transition-all border-b-2 border-transparent hover:border-muted-teal pb-1"
            >
              View All Events
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => {
              const locationParts = event.location ? event.location.split('|') : ['TBD'];
              const displayLocation = locationParts[0];

              return (
                <Link
                  href={`/event/${event.id}`}
                  key={event.id}
                  className="group flex flex-col bg-off-white border border-soft-slate rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(31,42,55,0.1)] transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-soft-slate">
                    {event.image && event.image !== '/placeholder-1.jpg' ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-muted-teal/20 to-charcoal-blue/20" />
                    )}

                    {/* Category Label */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-charcoal-blue rounded-full shadow-sm">
                        {event.category || 'General'}
                      </span>
                    </div>

                    {/* Price Label */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1.5 text-xs font-bold bg-charcoal-blue text-white rounded-full shadow-lg">
                        {event.isFree ? 'FREE' : `$${event.price}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-6">
                    <div className="flex items-center gap-4 text-sm text-steel-gray font-medium mb-3">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-muted-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate max-w-[120px]">{displayLocation}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-charcoal-blue mb-4 group-hover:text-muted-teal transition-colors line-clamp-2 leading-snug">
                      {event.title}
                    </h3>

                    <div className="mt-auto pt-4 border-t border-soft-slate flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {Array.from({ length: Math.min(event.participants.length || 0, 3) }).map((_, i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-soft-slate border-2 border-white flex items-center justify-center overflow-hidden">
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                          </div>
                        ))}
                        {event.participants.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-charcoal-blue border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">
                            +{event.participants.length - 3}
                          </div>
                        )}
                        {event.participants.length === 0 && (
                          <span className="text-xs text-steel-gray font-medium">Be the first to join</span>
                        )}
                      </div>

                      <div className="text-charcoal-blue font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Details
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {featuredEvents.length === 0 && (
            <div className="py-12 text-center text-steel-gray bg-off-white rounded-2xl border border-soft-slate border-dashed">
              <svg className="w-12 h-12 mx-auto mb-4 text-soft-slate" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
              </svg>
              No upcoming events right now. Why not create one?
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 m-6 mb-12 rounded-[2.5rem] bg-muted-teal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-charcoal-blue/50 to-transparent mix-blend-multiply pointer-events-none"></div>
        <div className="absolute -right-20 -top-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 text-center mx-auto max-w-3xl px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to host your next big event?</h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Join thousands of organizers creating seamless experiences. Setup takes less than 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/organizer/create-event"
              className="px-8 py-4 bg-white text-charcoal-blue font-bold rounded-xl shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              Get Started for Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-charcoal-blue/20 backdrop-blur-md outline outline-2 outline-white/20 outline-offset-[-2px] text-white font-bold rounded-xl hover:bg-charcoal-blue/30 transition-all font-sans"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-soft-slate bg-white pt-16 pb-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-charcoal-blue">
              EventOps
            </Link>
            <div className="flex items-center gap-6 text-sm font-semibold text-steel-gray">
              <Link href="/events" className="hover:text-muted-teal transition-colors">Browse</Link>
              <Link href="/organizer/dashboard" className="hover:text-muted-teal transition-colors">Organizer</Link>
              <Link href="/attendee/dashboard" className="hover:text-muted-teal transition-colors">Tickets</Link>
            </div>
            <div className="flex items-center gap-4 text-steel-gray">
              {/* Dummy social icons */}
              <a href="#" className="hover:text-charcoal-blue transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a href="#" className="hover:text-charcoal-blue transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
            </div>
          </div>

          <div className="pt-8 border-t border-soft-slate text-center flex flex-col items-center">
            <p className="text-sm font-medium text-steel-gray mb-2">
              © 2026 EventOps. All rights reserved.
            </p>
            <p className="text-xs text-soft-slate/80">
              Designed to make modern event management effortless.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}