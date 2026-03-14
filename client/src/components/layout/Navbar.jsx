import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

const CALENDLY_URL =
  "https://calendly.com/edehchinedu59/phone-call?hide_event_type_details=1&hide_gdpr_banner=1";

const links = [
  { to: "/", label: "Home" },
  { to: "/listings", label: "Listings" },
  { to: "/insurance", label: "Insurance" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Logo = () => (
  <Link to="/" className="flex items-center gap-1 text-2xl">
    <span className="font-display font-semibold tracking-wide text-primary">
      ChyChy
    </span>
    <span className="font-sans text-text-muted">Agent</span>
    <span className="text-primary text-xl">•</span>
  </Link>
);

function openCalendlyPopup() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const navLinkClass = ({ isActive }) =>
    `px-2 py-1 text-body-md font-medium transition-colors ${
      isActive ? "text-primary" : "text-text-muted hover:text-primary"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b border-border bg-surface/90 transition-all ${
        scrolled ? "shadow-card" : ""
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-4 lg:px-6">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              <span className="relative">
                {link.label}
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button size="md" variant="primary" onClick={openCalendlyPopup}>
            <Phone size={16} />
            Book a Consultation
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="relative z-50 md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-text-primary hover:bg-surface-soft transition-colors"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {mobileOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute left-0 right-0 top-full z-50 border-b border-border bg-surface shadow-lg md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <nav className="px-4 py-4">
              <ul className="space-y-1">
                {links.map((link, idx) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between rounded-lg px-4 py-3 text-body-md font-medium transition-colors ${
                          isActive
                            ? "text-primary"
                            : "text-text-primary hover:text-primary"
                        }`
                      }
                    >
                      {link.label}
                      <ArrowRight
                        size={14}
                        className={`text-text-light transition-transform`}
                      />
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-border px-4 py-4 space-y-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  setMobileOpen(false);
                  openCalendlyPopup();
                }}
              >
                <Phone size={16} />
                Book a Consultation
              </Button>
              <p className="text-center text-label text-text-muted">
                Free 45-min phone call
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
