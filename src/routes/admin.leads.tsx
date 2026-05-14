import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Download } from "lucide-react";

export const Route = createFileRoute("/admin/leads")({
  component: AdminLeads,
});

function AdminLeads() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const del = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin", "leads"] });
  };

  const exportCsv = () => {
    if (!data?.length) return;
    const cols = ["created_at", "name", "email", "phone", "service", "message", "source", "status"] as const;
    const csv = [cols.join(",")].concat(
      data.map((r) =>
        cols
          .map((c) => `"${String((r as Record<string, unknown>)[c] ?? "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = `leads-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h-display text-3xl">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">Inquiries from your website.</p>
        </div>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Message</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No leads yet.</td></tr>}
            {(data ?? []).map((l) => (
              <tr key={l.id} className="border-t border-border align-top">
                <td className="px-5 py-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
                <td className="px-5 py-3 font-medium">{l.name}</td>
                <td className="px-5 py-3"><a className="text-primary" href={`mailto:${l.email}`}>{l.email}</a></td>
                <td className="px-5 py-3 text-muted-foreground">{l.service ?? "—"}</td>
                <td className="px-5 py-3 max-w-sm text-muted-foreground">{l.message ?? "—"}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => del(l.id)} className="text-xs text-destructive inline-flex items-center gap-1">
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
