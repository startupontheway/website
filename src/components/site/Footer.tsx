import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background text-[11px] font-semibold">
              S
            </span>
            <span className="font-display text-lg tracking-tight">StartUpOnTheWay</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Premium startup registration, compliance, and legal advisory — built for founders who care about getting things right.
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Services</p>
          <ul className="space-y-2.5 text-sm">
            {["Private Limited", "LLP Registration", "GST Registration", "Trademark", "FSSAI Licence"].map((s) => (
              <li key={s}>
                <Link to="/services" className="text-foreground/80 hover:text-foreground">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Company</p>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="text-foreground/80 hover:text-foreground">About</Link></li>
            <li><Link to="/blogs" className="text-foreground/80 hover:text-foreground">Blog</Link></li>
            <li><Link to="/contact" className="text-foreground/80 hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm text-foreground/80">
            <li>hello@startupontheway.com</li>
            <li>+91 90000 00000</li>
            <li>Bengaluru · Mumbai · Delhi</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:px-10">
          <p>© {new Date().getFullYear()} StartUpOnTheWay. All rights reserved.</p>
          <p>Built with care for founders.</p>
        </div>
      </div>
    </footer>
  );
}
