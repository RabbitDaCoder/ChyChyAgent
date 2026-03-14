import Button from "../ui/Button";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="grid items-center gap-10 py-16 md:grid-cols-2">
      <div className="space-y-6">
        <p className="text-label text-primary font-mono uppercase">
          Nigeria&apos;s Trusted Property Advisor
        </p>
        <h1 className="font-display text-display-2xl text-text-primary leading-[1.05]">
          Find Your Dream
          <br />
          <span className="italic text-primary-dark">
            Home &amp; Protection
          </span>
        </h1>
        <p className="text-body-lg text-text-muted max-w-xl">
          Expert real estate and insurance services tailored to your lifestyle
          and goals.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button as="a" href="/listings">
            Explore Listings
          </Button>
          <Button variant="secondary" as="a" href="/insurance">
            Our Insurance Plans
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-label text-text-muted">
          <span>15+ Years Experience</span>
          <span className="text-primary">•</span>
          <span>AIICO Insurance Alumni</span>
          <span className="text-primary">•</span>
          <span>AY Housing Alumni</span>
          <span className="text-primary">•</span>
          <span>500+ Clients Served</span>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-4">
        <motion.div
          className="col-span-2 h-64 rounded-lg shadow-card overflow-hidden"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
            alt="Featured home"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80"
          alt="Interior"
          className="h-48 rounded-lg shadow-card object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80"
          alt="City"
          className="h-48 rounded-lg shadow-card object-cover"
        />
        <div className="absolute -bottom-6 right-4 w-48 rounded-lg bg-surface shadow-hover p-4 border border-border">
          <p className="text-label text-text-muted">Latest Listing</p>
          <p className="font-semibold text-text-primary">
            Lekki Phase 1 Duplex
          </p>
          <p className="text-primary text-body-sm">₦120,000,000</p>
        </div>
      </div>
    </section>
  );
}
