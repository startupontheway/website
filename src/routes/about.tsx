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
          <h1 className="h-display mt-3 text-5xl text-ink md:text-6xl">
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
          <div className="rounded-3xl border border-border bg-foreground px-8 py-14 text-background md:px-14">
            <h2 className="h-display text-3xl md:text-4xl">
              Let's talk about what you're building.
            </h2>
            <Link
              to="/contact"
              className="mt-6 inline-block rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground"
            >
              Book a consultation
            </Link>
          </div>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
