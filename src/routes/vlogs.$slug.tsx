import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/vlogs/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — StartUpOnTheWay` },
      { property: "og:type", content: "video.other" },
    ],
    links: [{ rel: "canonical", href: `/vlogs/${params.slug}` }],
  }),
  component: VlogSlugPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="h-display text-3xl">Couldn't load vlog</h1>
        <p className="mt-2 text-muted-foreground">{error.message}</p>
      </div>
      <Footer />
    </div>
  ),
});

function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function VlogSlugPage() {
  const { slug } = Route.useParams();
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["vlog", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vlogs")
        .select("*, categories(name, slug)")
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <article className="mx-auto max-w-5xl px-6 pt-24 pb-24 md:px-10 md:pt-32">
        <Link to="/vlogs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="h-4 w-4" /> Back to channel
        </Link>

        {isLoading ? (
          <p className="text-muted-foreground">Loading vlog details…</p>
        ) : !data ? (
          <div className="mt-10">
            <h1 className="h-display text-4xl">Vlog not found</h1>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
            {/* Left Column: Video */}
            <div className="relative aspect-[9/16] rounded-2xl bg-zinc-900 border border-border overflow-hidden shadow-card self-start max-w-sm w-full mx-auto lg:mx-0">
              {data.video_url ? (
                data.video_type === "youtube" ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(data.video_url)}?autoplay=1&rel=0`}
                    title={data.title}
                    className="h-full w-full border-0 aspect-[9/16]"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      src={data.video_url}
                      controls
                      autoPlay
                      playsInline
                      loop
                      muted={isMuted}
                      className="h-full w-full object-contain aspect-[9/16]"
                    />
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute bottom-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-all"
                    >
                      {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                )
              ) : (
                data.thumbnail_url && (
                  <img
                    src={data.thumbnail_url}
                    alt={data.title}
                    className="h-full w-full object-cover"
                  />
                )
              )}
            </div>

            {/* Right Column: Title & Content */}
            <div className="flex flex-col justify-start py-2">
              <div className="flex items-center gap-3">
                {data.categories && (
                  <span className="rounded-full bg-primary/20 px-3 py-0.5 text-xs font-semibold text-primary uppercase border border-primary/30">
                    {(data.categories as { name: string }).name}
                  </span>
                )}
                {data.published_at && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(data.published_at).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </span>
                )}
              </div>

              <h1 className="h-display mt-4 text-4xl text-ink md:text-5xl leading-tight font-extrabold">
                {data.title}
              </h1>

              {data.excerpt && (
                <p className="mt-4 text-lg text-muted-foreground border-l-2 border-primary pl-4 py-1 italic">
                  {data.excerpt}
                </p>
              )}

              <hr className="my-8 border-border" />

              <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {data.content}
              </div>
            </div>
          </div>
        )}
      </article>
      
      <Footer />
    </div>
  );
}
