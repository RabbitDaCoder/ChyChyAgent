import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../utils/api";
import toast from "react-hot-toast";

export default function CreateListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "sale",
    price: "",
    city: "",
    state: "",
    bedrooms: "",
    bathrooms: "",
    sqm: "",
  });
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFiles = (e) => setFiles(Array.from(e.target.files || []));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
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

      await api.post("/listings", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Listing created successfully!");
      navigate("/admin/listings");
    } catch {
      toast.error("Failed to create listing");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="font-display text-2xl text-text-primary">
        Create Listing
      </h1>
      <form className="space-y-3" onSubmit={submit}>
        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
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
        <Input
          label="Price (NGN)"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <Input
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Bedrooms"
            name="bedrooms"
            value={form.bedrooms}
            onChange={handleChange}
          />
          <Input
            label="Bathrooms"
            name="bathrooms"
            value={form.bathrooms}
            onChange={handleChange}
          />
          <Input
            label="Area (sqm)"
            name="sqm"
            value={form.sqm}
            onChange={handleChange}
          />
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
          {submitting ? "Saving..." : "Save Listing"}
        </Button>
      </form>
    </div>
  );
}
