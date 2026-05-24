import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, Sparkles, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { services, ServiceItem } from "@/lib/services";
import servicePreview from "@/assets/service-preview.jpg";
import { supabase } from "@/integrations/supabase/client";

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
      {
        property: "og:description",
        content: "Premium startup registration, compliance and legal advisory.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const trusted = ["Quotient", "Sisyphus", "Hourglass", "Capsule", "Spherule"];

const features = [
  {
    icon: Clock,
    title: "Fast Processing",
    body: "Most filings cleared in days, not weeks. Real timelines, no surprises.",
  },
  {
    icon: Sparkles,
    title: "Startup Friendly",
    body: "Built for founders — clear scopes, plain language, founder-first pricing.",
  },
  {
    icon: ShieldCheck,
    title: "Affordable Pricing",
    body: "Transparent fees, no hidden retainers. You always know what you pay for.",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    body: "Senior CAs, CSs and lawyers — not call-center scripts.",
  },
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
    <section className="relative overflow-hidden mx-auto max-w-7xl px-6 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-10 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[80px]" />
      <div className="absolute top-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-[100px]" />

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Startup registration & legal advisory
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="h-display mt-6 text-5xl font-semibold md:font-bold tracking-tight text-foreground md:text-6xl lg:text-[64px]"
          >
            Launch Your Business <br className="hidden md:block" /> The Right Way
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg leading-relaxed"
          >
            Helping startups and businesses with registrations, compliance, taxation and legal
            documentation — professionally managed from start to finish.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-wrap items-center gap-3.5"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 hover:scale-[1.02] hover:opacity-95"
            >
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-6 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-sm px-5 py-4 text-sm text-muted-foreground"
          >
            <span className="flex items-center gap-2 font-medium">
              <Users className="h-4 w-4 text-primary" /> Founders
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="h-4 w-4 text-primary" /> Scaling Companies
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-primary" /> Enterprise
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex flex-col justify-center"
        >
          <HeroWidget />
        </motion.div>
      </div>
    </section>
  );
}

interface EstimatorService {
  key: string;
  name: string;
  description: string;
  price: number;
}

const DEFAULT_SERVICES: EstimatorService[] = [
  {
    key: "pvtLtd",
    name: "Pvt Ltd Incorporation",
    description: "Digital Signature, DIN, MoA/AoA, PAN/TAN",
    price: 5999,
  },
  {
    key: "gst",
    name: "GST Registration",
    description: "Government GSTIN registration & certificate",
    price: 1499,
  },
  {
    key: "trademark",
    name: "Trademark Application",
    description: "Brand name, logo & legal class filing",
    price: 4999,
  },
  {
    key: "audit",
    name: "ROC & Audit Compliance",
    description: "Annual returns calendar & dedicated auditor",
    price: 3999,
  },
];

function HeroWidget() {
  const [tab, setTab] = useState<"estimator" | "roadmap">("estimator");
  const [servicesList, setServicesList] = useState<EstimatorService[]>(DEFAULT_SERVICES);
  const [checkedKeys, setCheckedKeys] = useState<Record<string, boolean>>({
    pvtLtd: true,
    gst: true,
    trademark: false,
    audit: false,
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase.from("estimator_services" as "leads").select("*");
        if (!error && data && data.length > 0) {
          const typedData = data as unknown as EstimatorService[];
          // Sort to match default keys order
          const keysOrder = ["pvtLtd", "gst", "trademark", "audit"];
          const sorted = [...typedData].sort(
            (a, b) => keysOrder.indexOf(a.key) - keysOrder.indexOf(b.key),
          );
          setServicesList(sorted);
        }
      } catch (e) {
        console.warn("Could not fetch estimator services, using static local fallbacks.", e);
      }
    };
    loadServices();
  }, []);

  const calculateTotal = () => {
    return servicesList.reduce((total, service) => {
      if (checkedKeys[service.key]) {
        return total + Number(service.price);
      }
      return total;
    }, 0);
  };

  const toggleService = (key: string) => {
    setCheckedKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-6 shadow-card hover:border-primary/25 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-5">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("estimator")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${tab === "estimator"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            Cost Estimator
          </button>
          <button
            onClick={() => setTab("roadmap")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${tab === "roadmap"
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            Launch Roadmap
          </button>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Interactive
        </span>
      </div>

      {tab === "estimator" ? (
        <div>
          <div className="space-y-3">
            {servicesList.map((service) => (
              <label
                key={service.key}
                className="flex items-center justify-between rounded-xl border border-border/80 bg-background/40 p-3 cursor-pointer hover:border-primary/30 hover:bg-muted/30 transition-all animate-fade-in"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!checkedKeys[service.key]}
                    onChange={() => toggleService(service.key)}
                    className="mt-0.5 accent-primary h-4 w-4 rounded border-border bg-transparent"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">
                  ₹{Number(service.price).toLocaleString("en-IN")}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Estimated Fee
              </p>
              <p className="text-2xl font-bold text-foreground">
                ₹{calculateTotal().toLocaleString("en-IN")}
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-transform duration-300 hover:scale-[1.02]"
            >
              Start Registration <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative border-l-2 border-primary/20 pl-5 ml-2.5 space-y-5">
            <div className="relative">
              <div className="absolute -left-[27px] mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              </div>
              <h5 className="text-sm font-semibold text-foreground">Step 1: Document Upload</h5>
              <p className="text-xs text-muted-foreground">
                Upload PAN, Aadhaar, address proof & NOC online (Takes 1 day)
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[27px] mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <h5 className="text-sm font-semibold text-foreground">Step 2: DSC & Name Approval</h5>
              <p className="text-xs text-muted-foreground">
                Obtain Digital Signatures & get name approved by ROC (Takes 2-3 days)
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[27px] mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-border bg-background flex items-center justify-center" />
              <h5 className="text-sm font-semibold text-muted-foreground">
                Step 3: Spice+ Incorporation
              </h5>
              <p className="text-xs text-muted-foreground/70">
                Drafting AoA/MoA, and final incorporation certificate delivery (Takes 4-5 days)
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-border/60 pt-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Total Incorporation time: 7-9 working days
            </span>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-transform duration-300 hover:translate-x-1"
            >
              See all services <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function TrustedRow() {
  const [marqueeNews, setMarqueeNews] = useState<any[]>([]);

  useEffect(() => {
    async function loadMarqueeNews() {
      try {
        const { data, error } = await supabase
          .from("news" as any)
          .select("id, title")
          .eq("is_marquee", true)
          .order("created_at", { ascending: false });
        if (!error && data) {
          setMarqueeNews(data);
        }
      } catch (e) {
        console.warn("Error fetching marquee news:", e);
      }
    }
    loadMarqueeNews();
  }, []);

  // If no marquee articles are set yet, we show a default placeholder strip
  const itemsToRender = marqueeNews.length > 0 
    ? marqueeNews 
    : [
        { id: "welcome", title: "Welcome to StartUpOnTheWay! Check back for latest regulatory updates." },
        { id: "compliance", title: "Incorporations, tax filings, and legal templates built for modern founders." }
      ];

  return (
    <section className="border-y border-border bg-card/60 backdrop-blur-md overflow-hidden py-3.5 relative flex items-center h-12">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee-custom {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-custom:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      {/* Badge Overlay */}
      <div className="absolute left-0 z-10 bg-primary px-4 h-full text-xs font-extrabold text-primary-foreground uppercase tracking-widest flex items-center shadow-lg border-r border-primary/25 select-none font-sans">
        <span className="hidden sm:inline">Latest &nbsp;</span> Updates
      </div>

      <div className="w-full overflow-hidden whitespace-nowrap pl-40 sm:pl-48">
        <div className="animate-marquee-custom flex items-center gap-24 pr-24">
          {/* Loop three times to ensure continuous marquee text on large screens */}
          {Array.from({ length: 3 }).flatMap(() => itemsToRender).map((item, idx) => {
            const isPlaceholder = item.id === "welcome" || item.id === "compliance";
            return isPlaceholder ? (
              <span
                key={`${item.id}-${idx}`}
                className="inline-flex items-center gap-3.5 text-xs sm:text-sm font-semibold text-muted-foreground/90 select-none"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{item.title}</span>
              </span>
            ) : (
              <Link
                key={`${item.id}-${idx}`}
                to="/news/$id"
                params={{ id: item.id }}
                className="inline-flex items-center gap-3.5 text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors cursor-pointer group"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="group-hover:underline">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      {/* Dynamic side glow */}
      <div className="absolute top-1/2 left-0 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-[80px]" />

      <Reveal>
        <h2 className="h-display mx-auto max-w-3xl text-center text-4xl font-semibold md:font-bold text-foreground md:text-5xl">
          Comprehensive Startup & Legal Solutions Tailored To Your Needs
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-muted-foreground leading-relaxed">
          With a focus on individual attention, we deliver customized strategies — empowering
          founders and scaling companies toward sustainable growth and operational excellence.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal>
          <article className="group rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 shadow-card md:p-10 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <p className="eyebrow text-primary/80 font-medium tracking-wider">Our Approach</p>
            <h3 className="h-display mt-3 text-2xl font-semibold md:font-bold md:text-3xl text-foreground group-hover:text-primary transition-colors duration-300">
              A studio model for legal & compliance.
            </h3>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              We pair every client with a senior advisor and a delivery team. No call-center
              handoffs, no template answers — just clear scopes, real timelines, and visibility at
              every step.
            </p>
            <Link
              to="/services"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-transform duration-300 hover:translate-x-1"
            >
              See more <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </Reveal>
        <Reveal delay={0.1}>
          <article className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 shadow-card md:p-10 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
            <p className="eyebrow text-primary/80 font-medium tracking-wider">
              Why founders choose us
            </p>
            <h3 className="h-display mt-3 text-2xl font-semibold md:font-bold md:text-3xl text-foreground">
              Built for the way modern teams actually work.
            </h3>
            <ul className="mt-6 space-y-4 text-sm">
              {[
                "Senior CA, CS and legal experts on every engagement",
                "Transparent fixed pricing — no hidden retainers",
                "Document repository and compliance calendar included",
                "Status updates over WhatsApp / email, not portals",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-foreground/80 leading-normal">{b}</span>
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
  const [servicesList, setServicesList] = useState<ServiceItem[]>(services);
  const [active, setActive] = useState(services[0].slug);

  useEffect(() => {
    async function loadServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("created_at", { ascending: true });
        if (!error && data && data.length > 0) {
          const formatted = data as unknown as ServiceItem[];
          setServicesList(formatted);
          setActive(formatted[0].slug);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic services for showcase", err);
      }
    }
    loadServices();
  }, []);

  const current = servicesList.find((s) => s.slug === active) ?? servicesList[0];

  return (
    <section className="relative mx-auto max-w-7xl px-6 pb-24 md:px-10 md:pb-32">
      {/* Background glow */}
      <div className="absolute bottom-10 right-0 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-[80px]" />

      <Reveal>
        <p className="eyebrow text-center text-primary/80 font-medium tracking-wider">
          What we deliver
        </p>
        <h2 className="h-display mx-auto mt-3 max-w-3xl text-center text-4xl font-semibold md:font-bold text-foreground md:text-5xl">
          Professional Services To Elevate Your Business
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[320px_1fr]">
        <Reveal>
          <div className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-2.5 shadow-card space-y-1">
            {servicesList.map((s) => {
              const isActive = s.slug === active;
              return (
                <button
                  key={s.slug}
                  onClick={() => setActive(s.slug)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-md shadow-primary/20 font-medium scale-[1.01]"
                    : "hover:bg-muted/80 text-foreground/80 hover:text-foreground"
                    }`}
                >
                  <span>{s.name}</span>
                  <ArrowRight
                    className={`h-4 w-4 transition-transform ${isActive ? "translate-x-1" : "opacity-40 group-hover:opacity-100"}`}
                  />
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
            className="overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm shadow-card hover:border-primary/20 transition-all duration-300"
          >
            <div className="p-8 md:p-10">
              <h3 className="h-display text-2xl font-semibold md:text-3xl text-foreground">
                {current.name}
              </h3>
              {current.description.includes("<") || current.description.includes("\n") ? (
                <div
                  className="mt-3 max-w-2xl text-muted-foreground leading-relaxed whitespace-pre-wrap text-sm"
                  dangerouslySetInnerHTML={{ __html: current.description }}
                />
              ) : (
                <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed text-sm">
                  {current.description}
                </p>
              )}

              <p className="eyebrow mt-8 text-primary/80 font-medium tracking-wider">Process</p>
              <ol className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                {current.process && current.process.length > 0 ? (
                  current.process.map((p, i) => (
                    <li key={p} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-medium text-primary">
                        {i + 1}
                      </span>
                      <span className="text-foreground/80 leading-normal">{p}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground text-sm">No custom steps listed. Contact us to learn more.</li>
                )}
              </ol>

              <Link
                to="/services/$slug"
                params={{ slug: current.slug }}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-6 py-3 text-sm font-medium text-primary-foreground shadow-md shadow-primary/15 transition-transform duration-300 hover:scale-[1.02]"
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
    <section className="relative border-y border-border bg-surface-2/40 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <h2 className="h-display max-w-2xl text-3xl font-semibold md:font-bold text-foreground md:text-4xl">
            Everything you'd expect from a premium advisory — without the friction.
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <div className="group h-full rounded-2xl border border-border/80 bg-card/70 backdrop-blur-sm p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-elevated">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
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
    quote:
      "They incorporated our Pvt Ltd, set up GST, and drafted our founders' agreement in under three weeks. Best decision we made before launch.",
    author: "Aarav Mehta",
    role: "Founder, Lumen Labs",
  },
  {
    quote:
      "The compliance calendar alone is worth it. We finally stopped missing ROC deadlines and our auditor loves the books.",
    author: "Priya Nair",
    role: "COO, Northwind",
  },
  {
    quote:
      "Felt like working with a senior law firm at startup pricing. Pragmatic, fast, no jargon.",
    author: "Rohit Verma",
    role: "CEO, Frame.io clone",
  },
];

function Testimonials() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      {/* Background glow */}
      <div className="absolute top-1/3 left-10 -z-10 h-80 w-80 rounded-full bg-purple-500/5 blur-[80px]" />

      <Reveal>
        <p className="eyebrow text-center text-primary/80 font-medium tracking-wider">
          Loved by founders
        </p>
        <h2 className="h-display mx-auto mt-3 max-w-2xl text-center text-3xl font-semibold md:font-bold text-foreground md:text-4xl">
          Trusted by teams shipping serious work.
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.author} delay={i * 0.08}>
            <figure className="flex h-full flex-col rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm p-7 shadow-card transition-all duration-300 hover:border-primary/25 hover:shadow-elevated hover:-translate-y-0.5">
              <blockquote className="font-display text-xl font-medium leading-snug text-foreground flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 border-t border-border/60 pt-4 text-sm">
                <div className="font-semibold text-foreground">{t.author}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
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
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/50 to-surface px-8 py-16 text-center text-foreground md:px-16 md:py-24 shadow-2xl backdrop-blur-sm">
          {/* Dynamic ambient inner glow portals */}
          <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/15 blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/15 blur-[60px] pointer-events-none" />

          <p className="eyebrow text-primary font-medium tracking-wider">Ready when you are</p>
          <h2 className="h-display mx-auto mt-4 max-w-2xl text-4xl font-extrabold text-foreground md:text-5xl tracking-tight leading-tight">
            Ready To Launch Your Business?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground leading-relaxed text-sm md:text-base">
            Tell us where you're at — incorporation, compliance, or legal documentation. We'll map
            out the next steps in a free 30-minute call.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/15 transition-transform duration-300 hover:scale-[1.02]"
            >
              Talk To Expert <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-full border border-border bg-background/50 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-muted/80"
            >
              Get Started
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
