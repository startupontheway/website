import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { services } from "@/lib/services";
import servicePreview from "@/assets/service-preview.jpg";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.service.name} — StartUpOnTheWay` },
          { name: "description", content: loaderData.service.description },
          { property: "og:title", content: loaderData.service.name },
          { property: "og:description", content: loaderData.service.description },
        ]
      : [],
    links: loaderData ? [{ rel: "canonical", href: `/services/${loaderData.service.slug}` }] : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="h-display text-4xl">Service not found</h1>
        <Link to="/services" className="mt-6 inline-block text-primary">Back to services</Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="h-display text-3xl">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
      <Footer />
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const { service } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-12 md:px-10 md:pt-24">
        <Reveal>
          <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground">
            ← Services
          </Link>
          <h1 className="h-display mt-4 max-w-3xl text-5xl text-ink md:text-6xl">{service.name}</h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">{service.description}</p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-24 md:grid-cols-[1fr_400px] md:px-10">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-border shadow-card">
            <img src={servicePreview} alt={service.name} loading="lazy" className="h-[420px] w-full object-cover" />
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-card md:p-10">
            <p className="eyebrow">Our process</p>
            <ol className="mt-5 space-y-4">
              {service.process.map((p, i) => (
                <li key={p} className="flex items-start gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground text-xs text-background">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-foreground/85">{p}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="sticky top-24 rounded-2xl border border-border bg-card p-7 shadow-card">
            <p className="eyebrow">What you get</p>
            <ul className="mt-5 space-y-3 text-sm">
              {["Senior advisor assigned", "Document templates", "Government filing", "Status visibility", "Post-completion support"].map(
                (b) => (
                  <li key={b} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ),
              )}
            </ul>
            <Link
              to="/contact"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Talk to an expert <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}
