import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Calendar, BookOpen } from "lucide-react";

export const Route = createFileRoute("/news/$id")({
  head: () => ({
    meta: [{ title: "News Article Details — StartUpOnTheWay" }],
  }),
  component: NewsDetailPage,
});

function linkify(text: string) {
  if (!text) return "";
  // Check if text already contains HTML anchors/paragraphs to prevent overriding
  if (/<(p|a|ul|li|strong|br|div)\b[^>]*>/i.test(text)) {
    return text;
  }
  const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  return text
    .replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-semibold break-all">${url}</a>`;
    })
    .replace(/\n/g, "<br />");
}

function NewsDetailPage() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["news-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news" as any)
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data || null;
    },
  });

  const article = data as any;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-3xl px-6 py-24 md:py-32 w-full">
        {/* Back Link */}
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to all news</span>
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading story details...</p>
          </div>
        ) : !data ? (
          <div className="text-center py-20 border border-border rounded-3xl bg-card/40">
            <BookOpen className="h-12 w-12 text-muted-foreground/60 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground">News Article Not Found</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              The article you are looking for does not exist or has been deleted.
            </p>
            <Link
              to="/news"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Back to News
            </Link>
          </div>
        ) : (
          <article className="space-y-8 animate-fade-in">
            {/* Banner Image on Top */}
            <div className="w-full aspect-[21/9] rounded-2xl bg-muted overflow-hidden border border-border/80 relative">
              {article.image_url ? (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 to-purple-600/15 text-primary">
                  <BookOpen className="h-10 w-10 animate-pulse" />
                </div>
              )}
            </div>

            {/* Title & Metadata */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.created_at).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <h1 className="h-display text-xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-foreground">
                {article.title}
              </h1>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/80 w-full" />

            {/* Content Area with dangerouslySetInnerHTML supporting formatted links */}
            <div
              className="prose prose-neutral dark:prose-invert max-w-none text-foreground/80 leading-relaxed space-y-4 text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: linkify(article.content) }}
            />
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
