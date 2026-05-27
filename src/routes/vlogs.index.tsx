import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { Play, X, ChevronLeft, ChevronRight, Volume2, VolumeX, Maximize2 } from "lucide-react";

export const Route = createFileRoute("/vlogs/")({
  head: () => ({
    meta: [
      { title: "Vlog — StartUpOnTheWay" },
      {
        name: "description",
        content:
          "Watch our reels and videos on startup incorporation, compliance, and legal documentation.",
      },
      { property: "og:title", content: "Vlog — StartUpOnTheWay" },
      { property: "og:description", content: "Expert startup video guides and reels." },
    ],
    links: [{ rel: "canonical", href: "/vlogs" }],
  }),
  component: VlogsPage,
});

// Helper to extract YouTube ID
function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function VlogsPage() {
  const [q, setQ] = useState("");
  const [activeReelIndex, setActiveReelIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["vlogs", "list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vlogs")
        .select(
          "id, title, slug, excerpt, content, thumbnail_url, published_at, video_url, video_type, categories(name, slug)",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = (data ?? []).filter((v) =>
    q ? (v.title + " " + (v.excerpt ?? "")).toLowerCase().includes(q.toLowerCase()) : true,
  );

  const currentReel = activeReelIndex !== null ? filtered[activeReelIndex] : null;

  // Handle auto-play of HTML5 video inside modal when active index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => console.log("Autoplay failed:", err));
    }
  }, [activeReelIndex]);

  const handleNextReel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeReelIndex !== null && activeReelIndex < filtered.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
    }
  };

  const handlePrevReel = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (activeReelIndex !== null && activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />

      {/* Header section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-10 md:px-10 md:pt-28">
        <Reveal>
          <p className="eyebrow">Vlog Channel</p>
          <h1 className="h-display mt-3 max-w-3xl text-3xl sm:text-5xl text-ink md:text-6xl">
            Founder Guides & Startup Shorts
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            Bite-sized, portrait video guides on incorporation, taxation, trademarks, and ROC
            filings.
          </p>
          <div className="mt-8 max-w-md">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search vlogs & reels…"
              className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary transition-all"
            />
          </div>
        </Reveal>
      </section>

      {/* Reels Grid (4 in a row on desktop) */}
      <section className="mx-auto max-w-7xl px-6 pb-24 md:px-10">
        {isLoading ? (
          <p className="text-muted-foreground">Loading vlogs…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <h2 className="h-display text-2xl">No vlogs yet</h2>
            <p className="mt-2 text-muted-foreground">
              Check back soon — we're uploading new reels regularly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filtered.map((v, i) => {
              const ytId = getYouTubeId(v.video_url || "");
              const defaultThumb = ytId
                ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
                : "/placeholder.svg";
              const thumbnail = v.thumbnail_url || defaultThumb;

              return (
                <Reveal key={v.id} delay={i * 0.04}>
                  <div
                    onClick={() => setActiveReelIndex(i)}
                    className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={thumbnail}
                      alt={v.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      onError={(e) => {
                        // fallback to a lower res YT thumbnail if maxres is unavailable
                        if (ytId && e.currentTarget.src.includes("maxresdefault")) {
                          e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/0.jpg`;
                        }
                      }}
                    />

                    {/* Dark gradient overlay for bottom details */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-primary shadow-elevated transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Content Details Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 flex flex-col justify-end text-white">
                      {v.categories && (
                        <span className="self-start rounded-full bg-primary/20 backdrop-blur-md px-1.5 py-0.5 sm:px-2.5 text-[8px] sm:text-[10px] font-semibold tracking-wider text-primary border border-primary/30 uppercase">
                          {(v.categories as { name: string }).name}
                        </span>
                      )}
                      <h3 className="font-display mt-1 sm:mt-2 text-xs xs:text-sm sm:text-lg font-bold leading-tight line-clamp-2 text-shadow">
                        {v.title}
                      </h3>
                      {v.excerpt && (
                        <p className="mt-1 text-[10px] sm:text-xs text-white/80 line-clamp-1 sm:line-clamp-2 leading-relaxed hidden xs:block">
                          {v.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* Immersive Reel Player Modal */}
      {activeReelIndex !== null && currentReel && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-6 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveReelIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all cursor-pointer"
            onClick={() => setActiveReelIndex(null)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Modal Container */}
          <div
            className="relative flex h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl md:flex-row flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Video Player */}
            <div className="relative flex flex-1 items-center justify-center bg-black/40 aspect-[9/16] md:aspect-auto">
              {currentReel.video_type === "youtube" ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(currentReel.video_url || "")}?autoplay=1&rel=0&modestbranding=1&loop=1`}
                  title={currentReel.title}
                  className="h-full w-full border-0 aspect-[9/16]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src={currentReel.video_url || ""}
                    controls
                    playsInline
                    loop
                    muted={isMuted}
                    className="h-full max-w-full object-contain aspect-[9/16]"
                  />
                  {/* Sound Toggle Overlay */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute bottom-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-all"
                  >
                    {isMuted ? (
                      <VolumeX className="h-4.5 w-4.5" />
                    ) : (
                      <Volume2 className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              )}

              {/* Navigation Controls (Floating Inside Video Area) */}
              {activeReelIndex > 0 && (
                <button
                  onClick={handlePrevReel}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-all z-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {activeReelIndex < filtered.length - 1 && (
                <button
                  onClick={handleNextReel}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-all z-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </div>

            {/* Right: Info Sidebar */}
            <div className="flex w-full flex-col p-6 md:w-96 border-t md:border-t-0 md:border-l border-zinc-800 shrink-0 justify-between bg-zinc-950 overflow-y-auto max-h-[40vh] md:max-h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {currentReel.categories && (
                    <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-primary border border-primary/30 uppercase">
                      {(currentReel.categories as { name: string }).name}
                    </span>
                  )}
                  {currentReel.published_at && (
                    <span className="text-xs text-zinc-500">
                      {new Date(currentReel.published_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>

                <h2 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
                  {currentReel.title}
                </h2>

                {currentReel.excerpt && (
                  <p className="text-sm text-zinc-400 font-medium border-l-2 border-primary pl-3">
                    {currentReel.excerpt}
                  </p>
                )}

                <div className="prose prose-invert prose-sm text-zinc-300 max-w-none pt-2 whitespace-pre-wrap leading-relaxed">
                  {currentReel.content}
                </div>
              </div>

              {/* Bottom detail action links */}
              <div className="mt-8 border-t border-zinc-800 pt-4 flex items-center justify-between">
                <Link
                  to="/vlogs/$slug"
                  params={{ slug: currentReel.slug }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  View Details Page <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Reel {activeReelIndex + 1} of {filtered.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
