import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/vlogs", label: "Vlogs" },
  { to: "/wealth-creation", label: "Wealth Creation" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Sync theme on mount (Default to Light Mode)
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const isDark = savedTheme === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      setTheme("dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleTheme = () => {
    if (theme === "dark") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all ${
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-background/0"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/media/logo.png"
              alt="Logo"
              className="h-32 sm:h-36 md:h-30 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-300 mr-1"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform duration-500 hover:rotate-45" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-700 transition-transform duration-500 hover:-rotate-12" />
              )}
            </button>
            <Link
              to="/contact"
              className="hidden rounded-full bg-gradient-to-r from-primary to-purple-600 px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10 transition-transform hover:scale-[1.02] md:inline-block"
            >
              Book Consultation
            </Link>
            <button
              className="rounded-md p-2 md:hidden hover:bg-muted transition-colors"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Dim Overlay Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[9999] w-[300px] max-w-[85vw] bg-background border-l border-border px-6 py-5 shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header with Logo and Close X Button */}
        <div className="flex items-center justify-between pb-5 border-b border-border/60">
          <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <img src="/media/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors border border-border/80"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 mt-6 flex-1 overflow-y-auto">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-xl px-4 py-3 text-sm font-semibold text-foreground/80 hover:bg-muted/80 hover:text-primary transition-all flex items-center justify-between group"
              activeProps={{ className: "bg-primary/10 text-primary font-bold" }}
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
            >
              <span>{l.label}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Book Consultation Button in Drawer Footer */}
        <div className="pt-5 border-t border-border/60 mt-auto">
          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-600 px-5 py-3.5 text-center text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 active:scale-95"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </>
  );
}
