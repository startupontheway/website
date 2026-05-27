import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — StartUpOnTheWay" },
      {
        name: "description",
        content: "We're a studio of senior CAs, CSs and lawyers helping founders launch and scale.",
      },
      { property: "og:title", content: "About — StartUpOnTheWay" },
      { property: "og:description", content: "Our story, our team, our principles." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const principles = [
  {
    title: "Founder-first",
    body: "Plain language, real timelines, transparent pricing — built for the people doing the building.",
  },
  {
    title: "Senior on every file",
    body: "No call-center handoffs. A senior advisor owns your engagement from day one.",
  },
  {
    title: "Built to scale with you",
    body: "Compliance calendars, document repositories and review cycles as you grow.",
  },
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 md:px-10 md:pt-32">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="h-display mt-3 text-3xl sm:text-5xl text-ink md:text-6xl">
            A studio for startup registration, compliance and legal advisory.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            We started StartUpOnTheWay because founders deserve better than templated portals and
            call-center scripts. We pair every client with senior CAs, CSs and lawyers — and we
            deliver work the way modern teams actually work: fast, transparent, and beautifully
            organized.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-card p-7 shadow-card">
                <p className="eyebrow">0{i + 1}</p>
                <h3 className="h-display mt-3 text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32 md:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/50 to-surface px-8 py-14 text-foreground md:px-14 shadow-2xl backdrop-blur-sm">
            {/* Dynamic ambient inner glow portals */}
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/15 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/15 blur-[60px] pointer-events-none" />

            <p className="eyebrow text-primary font-medium tracking-wider">Ready when you are</p>
            <h2 className="h-display mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Let's talk about what you're building.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed text-sm">
              Share your startup vision or compliance needs. We'll map out a custom launch roadmap
              in a free 30-minute consultation.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/15 transition-transform duration-300 hover:scale-[1.02]"
              >
                Book a consultation
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center rounded-full border border-border bg-background/50 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-muted/80"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
