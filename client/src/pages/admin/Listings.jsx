import { useEffect, useState } from "react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { Link } from "react-router-dom";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    const res = await api.get("/listings");
    setListings(res.data.data.listings || res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const toggleFeatured = async (id) => {
    await api.patch(`/listings/${id}/feature`);
    fetchListings();
  };

  const deleteListing = async (id) => {
    await api.delete(`/listings/${id}`);
    setListings((prev) => prev.filter((l) => l._id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-text-primary">Listings</h1>
        <Link to="/admin/listings/new">
          <Button variant="primary">Add Listing</Button>
        </Link>
      </div>

      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full text-left text-body-sm">
          <thead className="bg-surface-soft text-text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3" colSpan="6">
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}
            {!loading &&
              listings.map((listing) => (
                <tr key={listing._id} className="border-t border-border">
                  <td className="px-4 py-3">{listing.title}</td>
                  <td className="px-4 py-3 capitalize">{listing.type}</td>
                  <td className="px-4 py-3">
                    {listing.price?.toLocaleString("en-NG", {
                      style: "currency",
                      currency: listing.currency || "NGN",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="px-4 py-3 capitalize">{listing.status}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleFeatured(listing._id)}
                    >
                      {listing.featured ? "Unfeature" : "Feature"}
                    </Button>
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <Link to={`/admin/listings/${listing._id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteListing(listing._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
