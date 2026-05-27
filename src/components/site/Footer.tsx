import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-12 sm:mt-20 md:mt-32 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-10 text-xs md:grid-cols-4 md:gap-12 md:px-10 md:py-16 md:text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2">
            <img
              src="/media/logo.png"
              alt="Logo"
              className="h-32 sm:h-36 md:h-30 w-auto object-contain"
            />
          </div>
          <p className="mt-3 max-w-xs text-xs md:text-sm text-muted-foreground leading-relaxed">
            Premium startup registration, compliance, and legal advisory — built for founders who
            care about getting things right.
          </p>
        </div>

        <div className="col-span-1">
          <p className="eyebrow mb-3 md:mb-4">Services</p>
          <ul className="space-y-2 text-xs md:text-sm">
            {[
              "Private Limited",
              "LLP Registration",
              "GST Registration",
              "Trademark",
              "FSSAI Licence",
            ].map((s) => (
              <li key={s}>
                <Link to="/services" className="text-foreground/80 hover:text-foreground">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-1">
          <p className="eyebrow mb-3 md:mb-4">Company</p>
          <ul className="space-y-2 text-xs md:text-sm">
            <li>
              <Link to="/about" className="text-foreground/80 hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/vlogs" className="text-foreground/80 hover:text-foreground">
                Vlog
              </Link>
            </li>
            <li>
              <Link to="/wealth-creation" className="text-foreground/80 hover:text-foreground">
                Wealth Creation
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-foreground/80 hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="eyebrow mb-3 md:mb-4">Contact</p>
          <ul className="space-y-2 text-xs md:text-sm text-foreground/80">
            <li>
              <a
                href="mailto:startupontheway@gmail.com"
                className="hover:text-foreground transition-colors break-all"
              >
                startupontheway@gmail.com
              </a>
            </li>
            <li>
              <a href="tel:+919711880271" className="hover:text-foreground transition-colors">
                +91 97118 80271
              </a>
            </li>
            <li className="max-w-[280px] md:max-w-[220px] leading-relaxed">
              Sector 88 RPS Palm Drive 12 A first floor, Faridabad - 121002
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-[10px] md:text-xs text-muted-foreground md:flex-row md:px-10">
          <p>© {new Date().getFullYear()}. All rights reserved.</p>
          <p>Built with care for founders.</p>
        </div>
      </div>
    </footer>
  );
}
