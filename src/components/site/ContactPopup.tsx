import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

export function ContactPopup() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isTargetPage = pathname === "/" || pathname.startsWith("/services");

  const [isOpen, setIsOpen] = useState(false);
  const [hasClosed, setHasClosed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    // Check session storage so we don't annoy users repeatedly during the same session
    const closedBefore = sessionStorage.getItem("contactPopupClosed");
    if (closedBefore) {
      setHasClosed(true);
    }
  }, []);

  useEffect(() => {
    if (!isTargetPage || hasClosed || isOpen) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [isTargetPage, hasClosed, isOpen, pathname]);

  useEffect(() => {
    if (!isOpen) return;
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from("service_categories" as any)
          .select("id, name")
          .order("created_at", { ascending: true });
        if (!error && data) {
          setCategories(data as unknown as { id: string; name: string }[]);
        }
      } catch (e) {
        console.warn("Could not load service categories", e);
      }
    }
    loadCategories();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    setHasClosed(true);
    sessionStorage.setItem("contactPopupClosed", "true");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      service: form.service || null,
      message: form.message || null,
      source: "popup",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Thanks — we'll be in touch within one business day.");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-2xl sm:p-6 md:p-8 animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Need expert help?</h2>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">Drop your details and we'll reach out within one business day.</p>
        </div>
        <form onSubmit={submit} className="space-y-3 sm:space-y-4">
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[11px] sm:text-xs font-medium text-foreground">Full name *</span>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </label>
            <label className="block">
              <span className="mb-1 block text-[11px] sm:text-xs font-medium text-foreground">Email *</span>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[11px] sm:text-xs font-medium text-foreground">Phone *</span>
            <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] sm:text-xs font-medium text-foreground">Service of interest *</span>
            <select required value={form.service} onChange={e => setForm({...form, service: e.target.value})} className="w-full truncate rounded-md border border-border bg-background px-3 py-2 text-xs sm:text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary">
              <option value="">Select a service</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={loading} className="w-full rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60">
            {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
