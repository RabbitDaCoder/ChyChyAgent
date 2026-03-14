import HeroSection from "../../components/shared/HeroSection";
import ListingCard from "../../components/shared/ListingCard";
import BlogCard from "../../components/shared/BlogCard";
import useListings from "../../hooks/useListings";
import useBlogs from "../../hooks/useBlogs";
import Skeleton from "../../components/ui/Skeleton";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import Button from "../../components/ui/Button";

const CALENDLY_URL =
  "https://calendly.com/edehchinedu59/phone-call?hide_event_type_details=1&hide_gdpr_banner=1";

function openCalendlyPopup() {
  if (window.Calendly) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}

export default function Home() {
  const { data: featuredListings, loading: listingsLoading } = useListings({
    featured: true,
    limit: 6,
  });
  const { data: latestBlogs, loading: blogsLoading } = useBlogs({ limit: 3 });

  return (
    <div className="space-y-16 py-10">
      <HeroSection />

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-display-lg text-text-primary">
            Featured Properties
          </h2>
          <Link to="/listings" className="text-primary text-body-md">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {listingsLoading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton className="h-72 w-full" key={idx} />
            ))}
          {!listingsLoading &&
            featuredListings?.map((listing, idx) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                priority={idx < 2}
              />
            ))}
        </div>
      </section>

      <section className="space-y-6 rounded-xl bg-surface-soft px-6 py-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-display-lg text-text-primary">
            Insights & Advice
          </h2>
          <Link to="/blog" className="text-primary text-body-md">
            Read all articles →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {blogsLoading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton className="h-64 w-full" key={idx} />
            ))}
          {!blogsLoading &&
            latestBlogs?.map((blog) => (
              <BlogCard
                key={blog._id}
                title={blog.title}
                category={blog.category}
                excerpt={blog.excerpt}
                coverImage={blog.coverImage}
                slug={blog.slug}
                readTime={blog.readTime}
                createdAt={blog.createdAt}
              />
            ))}
        </div>
      </section>

      <section className="rounded-xl bg-surface-soft px-6 py-10 space-y-6">
        <h2 className="font-display text-display-lg text-text-primary">
          Why Choose ChyChyAgent
        </h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              title: "15 Years of Verified Expertise",
              desc: "Trained at AIICO Insurance and AY Housing — two of Nigeria's most respected institutions.",
            },
            {
              title: "Dual Specialist",
              desc: "Rare expertise in both real estate and insurance means you get complete guidance in one place.",
            },
            {
              title: "Lagos Market Knowledge",
              desc: "Deep roots in the Lagos property market built through years of hands-on transactions.",
            },
            {
              title: "Personal Service",
              desc: "Maryann personally handles every client — no junior staff, no handoffs.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-surface p-4 shadow-card"
            >
              <h3 className="font-display text-xl text-text-primary">
                {item.title}
              </h3>
              <p className="text-text-muted text-body-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-display-lg text-text-primary">
          What Clients Say
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              quote: "Responsive team that made my Lagos purchase painless.",
              name: "Ada O.",
              role: "Homebuyer — via ChyChyAgent, Maryann Eloike",
            },
            {
              quote:
                "Transparent process and fair pricing. Felt supported end to end.",
              name: "Tunde A.",
              role: "Seller — via ChyChyAgent, Maryann Eloike",
            },
            {
              quote: "Seamless guidance on both insurance and property deals.",
              name: "Chiamaka N.",
              role: "Investor — via ChyChyAgent, Maryann Eloike",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="space-y-3 rounded-xl bg-primary/10 p-5"
            >
              <p className="font-display text-xl italic text-text-primary">
                “{item.quote}”
              </p>
              <p className="text-body-sm font-semibold text-text-primary">
                {item.name}
              </p>
              <p className="text-label text-text-muted">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 rounded-xl bg-surface-soft px-6 py-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Phone size={24} className="text-primary" />
          </div>
          <p className="text-label text-primary uppercase tracking-wide">
            Free Consultation
          </p>
          <h2 className="font-display text-display-lg text-text-primary">
            Book a 45-minute phone call
          </h2>
          <p className="text-body-md text-text-muted max-w-xl">
            Let's discuss your property or insurance needs — schedule a free
            call at a time that suits you.
          </p>
          <Button variant="primary" size="lg" onClick={openCalendlyPopup}>
            <Phone size={16} />
            Schedule a Call
          </Button>
        </div>
      </section>

      <section className="rounded-xl bg-primary px-6 py-8 text-white shadow-hover">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-display text-display-md">
              Ready to find your perfect property?
            </h3>
            <p className="text-body-md text-white/80">
              Explore listings or chat with Eloike for a personalised
              recommendation.
            </p>
          </div>
          <div className="flex gap-3">
            <Button as={Link} to="/listings" variant="secondary">
              Explore Listings
            </Button>
            <Button as={Link} to="/contact">
              Book a Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
