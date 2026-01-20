import CursorHighlight from '@/components/CursorHighlight';
const EVENTS = [
  {
    id: 1,
    title: 'Tech Conference 2026',
    category: 'Technology',
    date: 'Feb 15, 2026',
    location: 'San Francisco, CA',
    price: '$299',
    attendees: 1200
  },
  {
    id: 2,
    title: 'Design Workshop',
    category: 'Design',
    date: 'Feb 20, 2026',
    location: 'New York, NY',
    price: '$149',
    attendees: 450
  },
  {
    id: 3,
    title: 'Marketing Summit',
    category: 'Business',
    date: 'Feb 25, 2026',
    location: 'Austin, TX',
    price: '$199',
    attendees: 800
  }
];

export default function LandingPage() {
  const featuredEvents = EVENTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 font-sans text-gray-700">
      {/* Navbar*/}
      <CursorHighlight />


      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="absolute inset-0">
          <div className="absolute -left-40 top-0 h-125 w-125 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute -right-40 top-40 h-150 w-150 rounded-full bg-blue-900/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-3">

            {/* LEFT — Content (2/3) */}
            <div className="lg:col-span-2">
              <h1 className="mb-6 bg-linear-to-r from-gray-900 via-blue-900 to-teal-700 bg-clip-text text-5xl font-extrabold leading-tight text-transparent md:text-6xl">
                Discover & Manage<br />Events Effortlessly
              </h1>

              <p className="mb-10 max-w-2xl text-xl leading-relaxed text-gray-600">
                From local meetups to large conferences — browse, book tickets, or
                create your own event with real-time analytics, QR check-in, and
                seamless ticketing.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/events"
                  className="rounded-xl bg-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-xl transition hover:bg-teal-700"
                >
                  Browse Events
                </a>
                <a
                  href="/create-event"
                  className="rounded-xl border-2 border-gray-900 px-8 py-4 text-lg font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
                >
                  Create Your Event
                </a>
              </div>

              {/* Stats */}
              <div className="mt-14 grid max-w-xl grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">2M+</div>
                  <div className="text-sm text-gray-600">Tickets</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* RIGHT — Visual (1/3) */}
            <div className="relative hidden lg:block">

              {/* Brand label */}
              <span className="mb-4 inline-block rounded-full border border-gray-200 px-4 py-1 text-sm font-bold text-gray-900">
                EventOps
              </span>


              <div className="relative rounded-3xl border border-gray-200 bg-white shadow-2xl">
                {/* Fake dashboard header */}
                <div className="flex items-center gap-2 border-b border-gray-100 p-4">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>

                {/* Fake dashboard body */}
                <div className="space-y-4 p-6">
                  <div className="h-4 w-3/4 rounded bg-gray-200" />
                  <div className="h-24 rounded-xl bg-linear-to-br from-teal-100 to-teal-200" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 rounded-xl bg-gray-100" />
                    <div className="h-20 rounded-xl bg-gray-100" />
                  </div>
                </div>
              </div>

              {/* Floating stat card */}
              <div className="absolute -bottom-10 -left-10 rounded-2xl bg-gray-900 px-6 py-4 text-white shadow-xl">
                <div className="text-xs opacity-80">Live Attendees</div>
                <div className="text-2xl font-bold">1,248</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/*Organizer section*/}
      <section className="bg-gray-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Built for Organizers & Attendees
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-300">
              One platform. End-to-end event management.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: 'Ticket',
                title: 'Easy Ticketing',
                description: 'Sell tickets, generate QR codes, simulate payments — all in one place.'
              },
              {
                icon: 'Chart',
                title: 'Real-time Analytics',
                description: 'Live dashboard with attendee count, revenue, and check-in stats via WebSockets.'
              },
              {
                icon: 'Check',
                title: 'Secure Check-in',
                description: 'Mobile-friendly QR scanner for staff. Instant validation & entry updates.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition hover:bg-white/10"
              >
                <h3 className="mb-4 text-2xl font-bold">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending & Featured Events*/}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Trending & Featured Events
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Discover what's happening near you right now
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event, index) => (
              <div
                key={event.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-teal-600/50 hover:shadow-2xl hover:shadow-teal-600/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative aspect-video overflow-hidden bg-linear-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      <span className="text-sm font-medium">{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {event.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                      </svg>
                      {event.attendees}
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900 transition group-hover:text-teal-700">
                    {event.title}
                  </h3>

                  <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <div className="text-xs text-gray-500">Starting from</div>
                      <div className="text-2xl font-bold text-gray-900">{event.price}</div>
                    </div>
                    <a
                      href={`/event/${event.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      View Details
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="/events"
              className="group inline-flex items-center gap-2 text-lg font-semibold text-teal-700 hover:text-teal-800"
            >
              Explore All Events
              <svg className="h-6 w-6 transition group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="text-xl font-bold text-gray-900">EventOps</span>
            <p className="text-sm text-gray-600">
              © 2026 EventOps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}