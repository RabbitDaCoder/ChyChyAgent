import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, SlidersHorizontal, X, Filter } from "lucide-react";
import useListings from "../../hooks/useListings";
import ListingCard from "../../components/shared/ListingCard";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Skeleton from "../../components/ui/Skeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import SEO from "../../components/shared/SEO";
import { buildOrgSchema } from "../../utils/schema";

const defaultFilters = {
  type: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  furnished: "",
};

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => parseParams(searchParams));
  const [cityInput, setCityInput] = useState(
    () => searchParams.get("city") || "",
  );
  const [page, setPage] = useState(() => Number(searchParams.get("page")) || 1);
  const [items, setItems] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Ref to avoid calling syncSearch during render/effect loops
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const queryParams = useMemo(() => {
    const params = { page, limit: 9 };
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.minPrice) params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
    if (filters.bedrooms)
      params.bedrooms =
        filters.bedrooms === "4+" ? 4 : Number(filters.bedrooms);
    if (filters.furnished) params.furnished = filters.furnished === "true";
    return params;
  }, [filters, page]);

  const { data, total, loading, isFetching } = useListings(queryParams);

  useEffect(() => {
    if (!data || data.length === 0) {
      if (page === 1) setItems([]);
      return;
    }
    if (page === 1) {
      setItems(data);
    } else {
      setItems((prev) => {
        // Avoid duplicates when appending
        const existingIds = new Set(prev.map((item) => item._id));
        const newItems = data.filter((item) => !existingIds.has(item._id));
        return newItems.length > 0 ? [...prev, ...newItems] : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // debounce city input
  useEffect(() => {
    const t = setTimeout(() => updateFilter("city", cityInput), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityInput]);

  const activeCount = Object.values(filters).filter(Boolean).length;
  const hasMore = items.length < total;

  const syncSearch = useCallback(
    (nextFilters, nextPage = 1) => {
      const params = new URLSearchParams();
      Object.entries(nextFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      if (nextPage > 1) params.set("page", String(nextPage));
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  function updateFilter(key, value) {
    const next = { ...filtersRef.current, [key]: value || "" };
    setFilters(next);
    setPage(1);
    setItems([]);
    syncSearch(next, 1);
  }

  function clearFilters() {
    setFilters(defaultFilters);
    setCityInput("");
    setPage(1);
    setItems([]);
    syncSearch(defaultFilters, 1);
  }

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    syncSearch(filters, nextPage);
  };

  return (
    <section className="py-10 space-y-8">
      <SEO
        title="Properties For Sale & Rent in Nigeria"
        description="Browse verified real estate listings across Nigeria. Houses, apartments, and land for sale or rent in Lagos, Abuja, Port Harcourt and more. Contact us on WhatsApp."
        url="/listings"
        schema={buildOrgSchema()}
      />

      <div className="space-y-3">
        <Breadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Properties", href: "/listings" },
          ]}
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-display-xl text-text-primary leading-tight">
            Properties in Nigeria
          </h1>
          <p className="text-body-lg text-text-muted">
            Verified listings. Direct WhatsApp enquiries. No middlemen.
          </p>
          <span className="inline-flex w-fit items-center gap-2 rounded-pill bg-accent-soft px-3 py-1 text-label font-mono uppercase text-primary">
            {total} properties available
          </span>
        </div>
      </div>

      <div className="sticky top-20 z-40 space-y-3 rounded-lg border border-border bg-surface/95 px-4 py-3 backdrop-blur">
        <div className="hidden flex-wrap items-center justify-between gap-3 md:flex">
          <TypeTabs
            current={filters.type}
            onChange={(val) => updateFilter("type", val)}
          />
          <div className="flex flex-1 flex-wrap items-center gap-3 md:justify-end">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-light" />
              <Input
                name="city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                placeholder="City or location"
                className="pl-9 md:w-48"
              />
            </div>
            <Input
              name="minPrice"
              placeholder="$0"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="md:w-32"
            />
            <Input
              name="maxPrice"
              placeholder="$500,000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="md:w-32"
            />
            <Bedrooms
              value={filters.bedrooms}
              onChange={(val) => updateFilter("bedrooms", val)}
            />
            <FurnishedToggle
              value={filters.furnished}
              onChange={(val) => updateFilter("furnished", val)}
            />
            {activeCount > 0 && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between md:hidden">
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 rounded-pill bg-primary px-4 py-2 text-white"
          >
            <Filter size={16} />
            Filters{" "}
            {activeCount > 0 && (
              <span className="rounded-pill bg-white/20 px-2 py-0.5 text-label">
                {activeCount}
              </span>
            )}
          </button>
          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-body-sm text-primary underline"
            >
              Clear
            </button>
          )}
        </div>

        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute bottom-[-5em] left-0 right-0 max-h-[70vh] overflow-y-auto rounded-t-2xl bg-surface p-4 shadow-hover"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-lg text-text-primary">
                    Filters
                  </h3>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X />
                  </button>
                </div>
                <div className="space-y-3">
                  <TypeTabs
                    current={filters.type}
                    onChange={(val) => updateFilter("type", val)}
                  />
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-light" />
                    <Input
                      name="city"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="City or location"
                      className="pl-9"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      name="minPrice"
                      placeholder="$0"
                      value={filters.minPrice}
                      onChange={(e) => updateFilter("minPrice", e.target.value)}
                    />
                    <Input
                      name="maxPrice"
                      placeholder="$500,000"
                      value={filters.maxPrice}
                      onChange={(e) => updateFilter("maxPrice", e.target.value)}
                    />
                  </div>
                  <Bedrooms
                    value={filters.bedrooms}
                    onChange={(val) => updateFilter("bedrooms", val)}
                  />
                  <FurnishedToggle
                    value={filters.furnished}
                    onChange={(val) => updateFilter("furnished", val)}
                  />
                </div>
                <div className="mt-4 flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => setShowMobileFilters(false)}
                  >
                    Apply
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1"
                    onClick={clearFilters}
                  >
                    Reset
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          page === 1 &&
          Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-80 w-full" />
          ))}

        {!loading &&
          items.length > 0 &&
          items.map((listing, idx) => (
            <motion.div
              key={listing._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.03 }}
            >
              <ListingCard listing={listing} priority={idx < 2} />
            </motion.div>
          ))}
      </div>

      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-surface-soft p-10 text-center">
          <div className="h-16 w-16 rounded-full bg-surface flex items-center justify-center text-primary">
            <SlidersHorizontal />
          </div>
          <h3 className="font-display text-2xl text-text-primary">
            No properties found
          </h3>
          <p className="text-body-md text-text-muted">
            Try adjusting your filters or browse all listings.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={loadMore} disabled={isFetching}>
            {isFetching ? "Loading..." : "Load More Properties"}
          </Button>
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-body-sm text-text-muted">
          Showing all {total} properties
        </p>
      )}
    </section>
  );
}

function TypeTabs({ current, onChange }) {
  const tabs = [
    { label: "All", value: "" },
    { label: "For Sale", value: "sale" },
    { label: "For Rent", value: "rent" },
  ];
  return (
    <div className="flex items-center gap-2 rounded-full bg-surface-soft px-2 py-1">
      <AnimatePresence>
        {tabs.map((tab) => (
          <motion.button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`relative rounded-pill px-4 py-2 text-body-sm font-medium transition ${
              current === tab.value ? "text-white" : "text-text-muted"
            }`}
          >
            {current === tab.value && (
              <motion.span
                layoutId="activeTab"
                className="absolute inset-0 rounded-pill bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Bedrooms({ value, onChange }) {
  const options = ["1", "2", "3", "4+"];
  return (
    <div className="flex items-center gap-2">
      {options.map((opt) => (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(value === opt ? "" : opt)}
          className={`rounded-pill border px-3 py-1 text-label transition ${
            value === opt
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-text-muted"
          }`}
        >
          {opt} bed
        </button>
      ))}
    </div>
  );
}

function FurnishedToggle({ value, onChange }) {
  const active = value === "true";
  return (
    <button
      type="button"
      onClick={() => onChange(active ? "" : "true")}
      className={`flex items-center gap-2 rounded-pill border px-3 py-2 text-label transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-text-muted"
      }`}
    >
      <SlidersHorizontal size={14} />
      Furnished
    </button>
  );
}

function parseParams(params) {
  return {
    type: params.get("type") || "",
    city: params.get("city") || "",
    minPrice: params.get("minPrice") || "",
    maxPrice: params.get("maxPrice") || "",
    bedrooms: params.get("bedrooms") || "",
    furnished: params.get("furnished") || "",
  };
}
