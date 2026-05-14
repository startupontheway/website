import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — StartUpOnTheWay` },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `/blogs/${params.slug}` }],
  }),
  component: BlogPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="h-display text-3xl">Couldn't load article</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
      <Footer />
    </div>
  ),
});

function BlogPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <article className="mx-auto max-w-3xl px-6 pt-20 pb-24 md:px-10 md:pt-28">
        <Link to="/blogs" className="text-sm text-muted-foreground hover:text-foreground">← All articles</Link>
        {isLoading ? (
          <p className="mt-10 text-muted-foreground">Loading…</p>
        ) : !data ? (
          <div className="mt-10">
            <h1 className="h-display text-4xl">Article not found</h1>
          </div>
        ) : (
          <>
            {data.categories && <p className="eyebrow mt-8">{(data.categories as { name: string }).name}</p>}
            <h1 className="h-display mt-3 text-5xl text-ink md:text-6xl">{data.title}</h1>
            {data.excerpt && <p className="mt-5 text-lg text-muted-foreground">{data.excerpt}</p>}
            {data.thumbnail_url && (
              <img src={data.thumbnail_url} alt={data.title} loading="lazy" className="mt-10 w-full rounded-2xl border border-border" />
            )}
            <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed">
              {data.content}
            </div>
          </>
        )}
      </article>
      <Footer />
    </div>
  );
}
