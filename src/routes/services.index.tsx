import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { services as staticServices, ServiceItem, ServiceCategory } from "@/lib/services";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — StartUpOnTheWay" },
      {
        name: "description",
        content:
          "Registration, compliance, taxation and legal documentation services for startups.",
      },
      { property: "og:title", content: "Services — StartUpOnTheWay" },
      { property: "og:description", content: "Premium startup and legal-tech services." },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(staticServices);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [servRes, catRes] = await Promise.all([
          supabase.from("services").select("*").order("created_at", { ascending: true }),
          supabase.from("service_categories" as any).select("*").order("order_index", { ascending: true }),
        ]);

        if (!servRes.error && servRes.data && servRes.data.length > 0) {
          setServicesList(servRes.data as unknown as ServiceItem[]);
        }
        
        if (!catRes.error && catRes.data && catRes.data.length > 0) {
          const cats = catRes.data as unknown as ServiceCategory[];
          setCategories(cats);
          if (cats.length > 0) {
            setActiveCategoryId(cats[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dynamic services", err);
      }
    }
    loadData();
  }, []);

  const filteredServices = servicesList.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.short.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (searchQuery) return matchesSearch;
    
    if (categories.length === 0) return true; 
    return service.category_id === activeCategoryId;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-8 md:px-10 md:pt-24">
        <Reveal>
          <p className="eyebrow">Services</p>
          <h1 className="h-display mt-3 max-w-3xl text-3xl sm:text-5xl text-ink md:text-6xl">
            Everything you need to launch and run a serious business.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            From incorporation and licensing to ongoing compliance and legal documentation — handled
            by senior advisors, with transparent pricing.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 relative max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-card/60 backdrop-blur-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors duration-300 outline-none text-foreground sm:text-sm"
              placeholder="Search services by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-24 md:px-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          {!searchQuery && categories.length > 0 && (
            <div className="w-full md:w-64 shrink-0">
              <div className="sticky top-24 flex flex-col gap-1 rounded-2xl border border-border/60 bg-card/30 p-2 shadow-sm">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                      activeCategoryId === cat.id
                        ? "bg-gradient-to-r from-primary to-purple-600 text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                        : "text-foreground hover:bg-muted hover:text-primary"
                    }`}
                  >
                    {cat.name}
                    <ChevronRight className={`h-4 w-4 transition-transform ${activeCategoryId === cat.id ? "opacity-100 translate-x-0.5" : "opacity-0 -translate-x-2"}`} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1">
            {filteredServices.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((s, i) => (
                  <Reveal key={s.slug} delay={i * 0.04}>
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated hover:border-primary/30"
                    >
                      <h3 className="font-display text-lg sm:text-xl font-bold text-foreground leading-snug">{s.name}</h3>
                      <p className="mt-3 flex-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{s.short}</p>
                      <span className="mt-5 sm:mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary group-hover:underline">
                        Learn more{" "}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            ) : (
              <Reveal>
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-border/60 bg-card/30">
                  <Search className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium text-foreground">No services found</h3>
                  <p className="text-sm text-muted-foreground mt-1">We couldn't find any services matching "{searchQuery}".</p>
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm font-medium text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
