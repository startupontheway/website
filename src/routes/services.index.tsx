import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { services } from "@/lib/services";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — StartUpOnTheWay" },
      { name: "description", content: "Registration, compliance, taxation and legal documentation services for startups." },
      { property: "og:title", content: "Services — StartUpOnTheWay" },
      { property: "og:description", content: "Premium startup and legal-tech services." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:px-10 md:pt-24">
        <Reveal>
          <p className="eyebrow">Services</p>
          <h1 className="h-display mt-3 max-w-3xl text-5xl text-ink md:text-6xl">
            Everything you need to launch and run a serious business.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            From incorporation and licensing to ongoing compliance and legal documentation — handled by senior advisors,
            with transparent pricing.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04}>
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <h3 className="h-display text-2xl">{s.name}</h3>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.short}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
