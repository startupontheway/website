import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/lib/services";
import { Mail, Phone, MapPin } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — StartUpOnTheWay" },
      { name: "description", content: "Book a free 30-minute consultation with our advisors." },
      { property: "og:title", content: "Contact — StartUpOnTheWay" },
      { property: "og:description", content: "Get in touch with senior advisors." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("leads").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      service: form.service || null,
      message: form.message || null,
      source: "contact",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Thanks — we'll be in touch within one business day.");
    setForm({ name: "", email: "", phone: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-12 md:px-10 md:pt-28">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="h-display mt-3 max-w-3xl text-5xl text-ink md:text-6xl">
            Let's talk about your business.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground">
            Tell us where you're at. We'll map out the next steps in a free 30-minute call.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-24 md:grid-cols-[1fr_360px] md:px-10">
        <Reveal>
          <form
            onSubmit={submit}
            className="rounded-2xl border border-border bg-card p-8 shadow-card md:p-10"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>
              <Field label="Phone" required>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>
              <Field label="Service of interest" required>
                <select
                  required
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  <option value="">Select a service</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <Field label="How can we help?" required>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </Field>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-7 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send message"}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <aside className="rounded-2xl border border-border bg-card p-8 shadow-card">
            <p className="eyebrow">Reach us</p>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-primary" /> hello@startupontheway.com
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-primary" /> +91 90000 00000
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" /> Bengaluru · Mumbai · Delhi
              </li>
            </ul>
            <div className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
              We respond within one business day. For urgent compliance matters, call directly.
            </div>
          </aside>
        </Reveal>
      </section>
      <Footer />
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}
