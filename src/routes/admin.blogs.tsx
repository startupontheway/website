import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Pencil, Plus, Upload } from "lucide-react";

export const Route = createFileRoute("/admin/blogs")({
  component: AdminBlogs,
});

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);

interface BlogForm {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  category_id: string | null;
  status: "draft" | "published";
  seo_title: string;
  seo_description: string;
}

const empty: BlogForm = {
  title: "", slug: "", excerpt: "", content: "", thumbnail_url: "",
  category_id: null, status: "draft", seo_title: "", seo_description: "",
};

function AdminBlogs() {
  const qc = useQueryClient();
  const [form, setForm] = useState<BlogForm | null>(null);

  const { data: blogs } = useQuery({
    queryKey: ["admin", "blogs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blogs").select("*, categories(name)").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: cats } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => (await supabase.from("categories").select("id, name").order("name")).data ?? [],
  });

  const save = async () => {
    if (!form) return;
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || null,
      content: form.content,
      thumbnail_url: form.thumbnail_url || null,
      category_id: form.category_id,
      status: form.status,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      published_at: form.status === "published" ? new Date().toISOString() : null,
    };
    const { error } = form.id
      ? await supabase.from("blogs").update(payload).eq("id", form.id)
      : await supabase.from("blogs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setForm(null);
    qc.invalidateQueries({ queryKey: ["admin", "blogs"] });
  };

  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "blogs"] });
  };

  const upload = async (file: File) => {
    if (!form) return;
    const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage.from("blog-images").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    setForm({ ...form, thumbnail_url: data.publicUrl });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h-display text-3xl">Blogs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your articles.</p>
        </div>
        <button
          onClick={() => setForm({ ...empty })}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New post
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(blogs ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">No posts yet.</td></tr>
            )}
            {(blogs ?? []).map((b) => (
              <tr key={b.id} className="border-t border-border">
                <td className="px-5 py-3 font-medium">{b.title}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${b.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{(b.categories as { name: string } | null)?.name ?? "—"}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => setForm({
                    id: b.id, title: b.title, slug: b.slug, excerpt: b.excerpt ?? "", content: b.content,
                    thumbnail_url: b.thumbnail_url ?? "", category_id: b.category_id, status: b.status as "draft" | "published",
                    seo_title: b.seo_title ?? "", seo_description: b.seo_description ?? "",
                  })} className="mr-2 inline-flex items-center gap-1 text-xs text-foreground/70 hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => del(b.id)} className="inline-flex items-center gap-1 text-xs text-destructive">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
          <div className="my-10 w-full max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-elevated">
            <div className="flex items-center justify-between">
              <h2 className="h-display text-2xl">{form.id ? "Edit post" : "New post"}</h2>
              <button onClick={() => setForm(null)} className="text-sm text-muted-foreground">Close</button>
            </div>
            <div className="mt-6 grid gap-4">
              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v, slug: form.slug || slugify(v) })} />
              <Input label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
              <Input label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} />
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">Content (markdown / plain text)</span>
                <textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium">Status</span>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium">Category</span>
                  <select value={form.category_id ?? ""} onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                    <option value="">None</option>
                    {(cats ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium">Thumbnail</span>
                <div className="flex items-center gap-3">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs hover:bg-muted">
                    <Upload className="h-3.5 w-3.5" /> Upload
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
                  </label>
                  {form.thumbnail_url && <img src={form.thumbnail_url} alt="" className="h-12 w-20 rounded-md object-cover" />}
                </div>
              </label>
              <Input label="SEO title" value={form.seo_title} onChange={(v) => setForm({ ...form, seo_title: v })} />
              <Input label="SEO description" value={form.seo_description} onChange={(v) => setForm({ ...form, seo_description: v })} />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setForm(null)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
    </label>
  );
}
