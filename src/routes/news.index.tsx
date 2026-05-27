import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Search, ArrowRight, BookOpen } from "lucide-react";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "Latest News & Updates — StartUpOnTheWay" },
      {
        name: "description",
        content:
          "Stay updated with the latest news, financial insights, regulatory updates, and startup announcements.",
      },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsIndexPage,
});

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

function NewsIndexPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from("news" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setNews(data as unknown as NewsItem[]);
      } else {
        setNews([]);
      }
    } catch (e) {
      console.warn("Could not fetch news from DB.", e);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const filteredNews = news.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stripHtml(item.content).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-5xl px-6 py-24 md:py-32 w-full">
        {/* Header Hero Section */}
        <div className="text-center space-y-4 mb-16">
          <Reveal>
            <span className="rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary uppercase border border-primary/20 tracking-wider">
              Press & Updates
            </span>
          </Reveal>
          <Reveal>
            <h1 className="h-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink leading-tight">
              Company News & Insights
            </h1>
          </Reveal>
          <Reveal>
            <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
              Stay informed with regulatory changes, company releases, tax advisories, and strategic
              growth advice.
            </p>
          </Reveal>

          {/* Search bar */}
          <Reveal>
            <div className="max-w-md mx-auto mt-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-card/60 px-11 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </Reveal>
        </div>

        {/* News Feed Grid (Horizontal Wide Cards) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading latest updates...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl bg-card/30">
            <BookOpen className="h-10 w-10 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No news articles found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((item, idx) => {
              const plainText = stripHtml(item.content);
              const excerpt = plainText.length > 180 ? plainText.slice(0, 180) + "..." : plainText;

              return (
                <Reveal key={item.id} delay={idx * 0.05}>
                  <Link
                    to="/news/$id"
                    params={{ id: item.id }}
                    className="flex flex-col sm:flex-row items-stretch gap-6 p-5 rounded-2xl border border-border/80 bg-card/40 backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-lg group cursor-pointer"
                  >
                    {/* Thumbnail Left (Square shape) */}
                    <div className="w-full sm:w-32 h-32 shrink-0 rounded-xl bg-muted overflow-hidden border border-border relative self-center">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-purple-600/10 text-primary">
                          <BookOpen className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    {/* Metadata & Title/Content Right */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h2>
                        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-primary tracking-wide uppercase mt-4 group-hover:gap-2 transition-all">
                        <span>Read Full Story</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
