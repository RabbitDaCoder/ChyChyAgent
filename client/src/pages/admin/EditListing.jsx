import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../utils/api";

export default function EditListing() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/listings");
      const match = res.data.data.listings?.find((l) => l._id === id);
      if (match) {
        setForm({
          title: match.title,
          description: match.description,
          type: match.type,
          price: match.price,
          city: match.location?.city || "",
          state: match.location?.state || "",
          bedrooms: match.features?.bedrooms || "",
          bathrooms: match.features?.bathrooms || "",
          sqm: match.features?.sqm || "",
        });
      }
    };
    load();
  }, [id]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFiles = (e) => setFiles(Array.from(e.target.files || []));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("type", form.type);
    data.append("price", form.price);
    data.append("location[city]", form.city);
    data.append("location[state]", form.state);
    data.append("features[bedrooms]", form.bedrooms);
    data.append("features[bathrooms]", form.bathrooms);
    data.append("features[sqm]", form.sqm);
    files.forEach((file) => data.append("images", file));

    await api.put(`/listings/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setSubmitting(false);
  };

  if (!form) return <p>Loading listing...</p>;

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="font-display text-2xl text-text-primary">Edit Listing</h1>
      <form className="space-y-3" onSubmit={submit}>
        <Input label="Title" name="title" value={form.title} onChange={handleChange} required />
        <label className="flex flex-col gap-2 text-label text-text-muted">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            className="rounded-md border border-border bg-surface px-3 py-3 text-body-md outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-label text-text-muted">
          Type
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-md border border-border bg-surface px-3 py-3 text-body-md"
          >
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
        </label>
        <Input label="Price (NGN)" name="price" value={form.price} onChange={handleChange} required />
        <div className="grid grid-cols-2 gap-3">
          <Input label="City" name="city" value={form.city} onChange={handleChange} />
          <Input label="State" name="state" value={form.state} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input label="Bedrooms" name="bedrooms" value={form.bedrooms} onChange={handleChange} />
          <Input label="Bathrooms" name="bathrooms" value={form.bathrooms} onChange={handleChange} />
          <Input label="Area (sqm)" name="sqm" value={form.sqm} onChange={handleChange} />
        </div>
        <label className="flex flex-col gap-2 text-label text-text-muted">
          Images (Cloudinary)
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiles}
            className="rounded-md border border-border bg-surface px-3 py-2"
          />
        </label>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
