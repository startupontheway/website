import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Tag, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [blogs, published, leads, categories] = await Promise.all([
        supabase.from("blogs").select("id", { count: "exact", head: true }),
        supabase.from("blogs").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
      ]);
      return {
        blogs: blogs.count ?? 0,
        published: published.count ?? 0,
        leads: leads.count ?? 0,
        categories: categories.count ?? 0,
      };
    },
  });

  const stats = [
    { label: "Total blogs", value: data?.blogs ?? "—", icon: FileText },
    { label: "Published", value: data?.published ?? "—", icon: Eye },
    { label: "Leads", value: data?.leads ?? "—", icon: Users },
    { label: "Categories", value: data?.categories ?? "—", icon: Tag },
  ];

  return (
    <div>
      <h1 className="h-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your content and leads.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-3 font-display text-4xl">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
