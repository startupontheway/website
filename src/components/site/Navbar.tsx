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
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-border bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-background/0"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10">
        <Link to="/" className="flex items-center gap-2">
          <img src="/media/logo.png" alt="Logo" className="h-30 w-auto object-contain" />
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
            className="rounded-md p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-muted"
                activeProps={{ className: "bg-primary/10 text-primary" }}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gradient-to-r from-primary to-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-md shadow-primary/10"
            >
              Book Consultation
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
