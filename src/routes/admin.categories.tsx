import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

function AdminCategories() {
  const qc = useQueryClient();
  const [name, setName] = useState("");

  const { data } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("name")).data ?? [],
  });

  const add = async () => {
    if (!name.trim()) return;
    const { error } = await supabase.from("categories").insert({ name, slug: slugify(name) });
    if (error) return toast.error(error.message);
    setName("");
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  return (
    <div>
      <h1 className="h-display text-3xl">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">Organize your content.</p>

      <div className="mt-8 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button onClick={add} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Slug</th><th></th></tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 && <tr><td colSpan={3} className="px-5 py-10 text-center text-muted-foreground">No categories.</td></tr>}
            {(data ?? []).map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => del(c.id)} className="text-xs text-destructive inline-flex items-center gap-1">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
