import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Sparkles, ShieldCheck, Users } from "lucide-react";
import { useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { services } from "@/lib/services";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import servicePreview from "@/assets/service-preview.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StartUpOnTheWay — Launch Your Business The Right Way" },
      {
        name: "description",
        content:
          "Premium startup registration, compliance, taxation and legal documentation. Professionally managed from start to finish.",
      },
      { property: "og:title", content: "StartUpOnTheWay — Launch Your Business The Right Way" },
      { property: "og:description", content: "Premium startup registration, compliance and legal advisory." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const trusted = ["Quotient", "Sisyphus", "Hourglass", "Capsule", "Spherule"];

const features = [
  { icon: Clock, title: "Fast Processing", body: "Most filings cleared in days, not weeks. Real timelines, no surprises." },
  { icon: Sparkles, title: "Startup Friendly", body: "Built for founders — clear scopes, plain language, founder-first pricing." },
  { icon: ShieldCheck, title: "Affordable Pricing", body: "Transparent fees, no hidden retainers. You always know what you pay for." },
  { icon: Users, title: "Expert Guidance", body: "Senior CAs, CSs and lawyers — not call-center scripts." },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <TrustedRow />
      <About />
      <ServicesShowcase />
      <FeatureGrid />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Startup registration & legal advisory
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="h-display mt-6 text-5xl text-ink md:text-6xl lg:text-[68px]"
          >
            Launch Your Business <br className="hidden md:block" /> The Right Way
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg"
          >
            Helping startups and businesses with registrations, compliance, taxation and legal documentation —
            professionally managed from start to finish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Contact Us
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2"><Users className="h-4 w-4" /> Founders</span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Scaling Companies</span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Enterprise</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-4"
        >
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <img
              src={hero1}
              alt="Startup founder presenting strategy"
              width={896}
              height={704}
              className="h-[320px] w-full object-cover md:h-[380px]"
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <img
              src={hero2}
              alt="Team meeting"
              width={896}
              height={576}
              loading="lazy"
              className="h-[220px] w-full object-cover md:h-[260px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustedRow() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-8 md:px-10">
        {trusted.map((t) => (
          <span key={t} className="font-display text-xl text-muted-foreground/70">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <h2 className="h-display mx-auto max-w-3xl text-center text-4xl text-ink md:text-5xl">
          Comprehensive Startup & Legal Solutions Tailored To Your Needs
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-muted-foreground">
          With a focus on individual attention, we deliver customized strategies — empowering founders and scaling
          companies toward sustainable growth and operational excellence.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal>
          <article className="rounded-2xl border border-border bg-card p-8 shadow-card md:p-10">
            <p className="eyebrow">Our Approach</p>
            <h3 className="h-display mt-3 text-2xl md:text-3xl">A studio model for legal & compliance.</h3>
            <p className="mt-5 text-muted-foreground">
              We pair every client with a senior advisor and a delivery team. No call-center handoffs, no template
              answers — just clear scopes, real timelines, and visibility at every step.
            </p>
            <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              See more <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </Reveal>
        <Reveal delay={0.1}>
          <article className="rounded-2xl border border-border bg-card p-8 shadow-card md:p-10">
            <p className="eyebrow">Why founders choose us</p>
            <h3 className="h-display mt-3 text-2xl md:text-3xl">Built for the way modern teams actually work.</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Senior CA, CS and legal experts on every engagement",
                "Transparent fixed pricing — no hidden retainers",
                "Document repository and compliance calendar included",
                "Status updates over WhatsApp / email, not portals",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground/85">{b}</span>
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesShowcase() {
  const [active, setActive] = useState(services[0].slug);
  const current = services.find((s) => s.slug === active) ?? services[0];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
      <Reveal>
        <p className="eyebrow text-center">What we deliver</p>
        <h2 className="h-display mx-auto mt-3 max-w-3xl text-center text-4xl text-ink md:text-5xl">
          Professional Services To Elevate Your Business
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
        <Reveal>
          <div className="rounded-2xl border border-border bg-card p-2 shadow-card">
            {services.map((s) => {
              const isActive = s.slug === active;
              return (
                <button
                  key={s.slug}
                  onClick={() => setActive(s.slug)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                    isActive ? "bg-foreground text-background" : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">{s.name}</span>
                  <ArrowRight className={`h-4 w-4 transition-transform ${isActive ? "translate-x-0.5" : "opacity-40"}`} />
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <motion.article
            key={current.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
          >
            <div className="overflow-hidden border-b border-border">
              <img
                src={servicePreview}
                alt={current.name}
                width={1024}
                height={704}
                loading="lazy"
                className="h-[260px] w-full object-cover md:h-[320px]"
              />
            </div>
            <div className="p-8 md:p-10">
              <h3 className="h-display text-2xl md:text-3xl">{current.name}</h3>
              <p className="mt-3 max-w-2xl text-muted-foreground">{current.description}</p>

              <p className="eyebrow mt-8">Process</p>
              <ol className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                {current.process.map((p, i) => (
                  <li key={p} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-border text-[10px] text-muted-foreground">
                      {i + 1}
                    </span>
                    {p}
                  </li>
                ))}
              </ol>

              <Link
                to="/services/$slug"
                params={{ slug: current.slug }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.article>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="h-display max-w-2xl text-3xl text-ink md:text-4xl">
            Everything you'd expect from a premium advisory — without the friction.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                <f.icon className="h-5 w-5 text-primary" />
                <h3 className="mt-5 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const testimonials = [
  {
    quote: "They incorporated our Pvt Ltd, set up GST, and drafted our founders' agreement in under three weeks. Best decision we made before launch.",
    author: "Aarav Mehta",
    role: "Founder, Lumen Labs",
  },
  {
    quote: "The compliance calendar alone is worth it. We finally stopped missing ROC deadlines and our auditor loves the books.",
    author: "Priya Nair",
    role: "COO, Northwind",
  },
  {
    quote: "Felt like working with a senior law firm at startup pricing. Pragmatic, fast, no jargon.",
    author: "Rohit Verma",
    role: "CEO, Frame.io clone",
  },
];

function Testimonials() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <Reveal>
        <p className="eyebrow text-center">Loved by founders</p>
        <h2 className="h-display mx-auto mt-3 max-w-2xl text-center text-3xl text-ink md:text-4xl">
          Trusted by teams shipping serious work.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.author} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card">
              <blockquote className="font-display text-xl leading-snug text-ink">"{t.quote}"</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4 text-sm">
                <div className="font-medium text-foreground">{t.author}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-border bg-foreground px-8 py-16 text-center text-background md:px-16 md:py-24">
          <p className="eyebrow text-background/60">Ready when you are</p>
          <h2 className="h-display mx-auto mt-4 max-w-2xl text-4xl md:text-5xl">
            Ready To Launch Your Business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-background/70">
            Tell us where you're at — incorporation, compliance, or legal documentation. We'll map out the next steps in
            a free 30-minute call.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-medium text-foreground hover:opacity-90"
            >
              Talk To Expert <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-full border border-background/20 px-5 py-3 text-sm font-medium text-background hover:bg-background/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
