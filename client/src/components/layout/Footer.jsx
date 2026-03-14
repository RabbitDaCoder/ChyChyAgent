import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle } from "lucide-react";

const linkClass =
  "text-text-light hover:text-primary transition-colors text-body-sm";

export default function Footer() {
  return (
    <footer className="mt-16 bg-text-primary text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-2xl">
            <span className="font-display font-semibold text-primary-light">
              ChyChy
            </span>
            <span className="font-sans text-white/70">Agent</span>
            <span className="text-primary-light text-xl">•</span>
          </div>
          <p className="text-white/70 text-body-sm leading-relaxed">
            Your trusted partner for real estate and insurance in Lagos.
          </p>
          <p className="mt-2 text-white/50 text-body-sm">
            Founded by Maryann Chieboam Eloike — 15 years of industry expertise.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary-light">
            Quick Links
          </h4>
          <div className="flex flex-col gap-3">
            <Link className={linkClass} to="/listings">
              Listings
            </Link>
            <Link className={linkClass} to="/insurance">
              Insurance
            </Link>
            <Link className={linkClass} to="/blog">
              Blog
            </Link>
            <Link className={linkClass} to="/about">
              About
            </Link>
            <Link className={linkClass} to="/contact">
              Contact
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary-light">
            Services
          </h4>
          <div className="flex flex-col gap-3">
            <span className={linkClass}>Property sales & rentals</span>
            <span className={linkClass}>Buyer representation</span>
            <span className={linkClass}>Home & auto insurance</span>
            <span className={linkClass}>Business coverage</span>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg mb-4 text-primary-light">
            Contact
          </h4>
          <div className="flex flex-col gap-2 text-body-sm text-white/80">
            <span>Lagos, Nigeria</span>
            <span>hello@chychyagent.com</span>
            <span>+234 (0) 812-000-0000</span>
          </div>
          <div className="mt-4 flex gap-4 text-white">
            <Link to="#" aria-label="Instagram">
              <Instagram size={20} />
            </Link>
            <Link to="#" aria-label="Facebook">
              <Facebook size={20} />
            </Link>
            <Link to="#" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-text-primary py-4 text-center text-white/60 text-body-sm">
        © {new Date().getFullYear()} ChyChyAgent. Founded by Maryann Chieboam
        Eloike. Lagos, Nigeria.
      </div>
    </footer>
  );
}
