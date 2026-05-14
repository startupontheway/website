import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "Blog — StartUpOnTheWay" },
      { name: "description", content: "Editorial guides on startup incorporation, compliance and legal documentation." },
      { property: "og:title", content: "Blog — StartUpOnTheWay" },
      { property: "og:description", content: "Editorial guides for founders." },
    ],
    links: [{ rel: "canonical", href: "/blogs" }],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["blogs", "list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("id, title, slug, excerpt, thumbnail_url, published_at, categories(name, slug)")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (data ?? []).filter((b) =>
    q ? (b.title + " " + (b.excerpt ?? "")).toLowerCase().includes(q.toLowerCase()) : true,
  );
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-10 md:px-10 md:pt-28">
        <Reveal>
          <p className="eyebrow">Journal</p>
          <h1 className="h-display mt-3 max-w-3xl text-5xl text-ink md:text-6xl">
            Editorial guides for modern founders.
          </h1>
          <div className="mt-8 max-w-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <h2 className="h-display text-2xl">No articles yet</h2>
            <p className="mt-2 text-muted-foreground">Check back soon — we're publishing weekly.</p>
          </div>
        ) : (
          <>
            {featured && (
              <Reveal>
                <Link
                  to="/blogs/$slug"
                  params={{ slug: featured.slug }}
                  className="group grid gap-8 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card md:grid-cols-2 md:p-8"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                    {featured.thumbnail_url && (
                      <img src={featured.thumbnail_url} alt={featured.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="eyebrow">Featured</p>
                    <h2 className="h-display mt-3 text-3xl md:text-4xl">{featured.title}</h2>
                    {featured.excerpt && <p className="mt-4 text-muted-foreground">{featured.excerpt}</p>}
                    <span className="mt-6 text-sm font-medium text-primary">Read article →</span>
                  </div>
                </Link>
              </Reveal>
            )}

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((b, i) => (
                <Reveal key={b.id} delay={i * 0.04}>
                  <Link
                    to="/blogs/$slug"
                    params={{ slug: b.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {b.thumbnail_url && (
                        <img src={b.thumbnail_url} alt={b.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {b.categories && <p className="eyebrow">{(b.categories as { name: string }).name}</p>}
                      <h3 className="h-display mt-2 text-xl">{b.title}</h3>
                      {b.excerpt && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{b.excerpt}</p>}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
