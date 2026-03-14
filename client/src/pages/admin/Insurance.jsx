import { useEffect, useState } from "react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import InsurancePlanCard from "../../components/shared/InsurancePlanCard";
import Skeleton from "../../components/ui/Skeleton";
import Input from "../../components/ui/Input";
import { LiaTimesSolid } from "react-icons/lia";

export default function Insurance() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchPlans = async () => {
    setLoading(true);
    const res = await api.get("/insurance");
    setPlans(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const deletePlan = async (id) => {
    await api.delete(`/insurance/${id}`);
    setPlans((prev) => prev.filter((p) => p._id !== id));
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFile = (e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }));

  const addPlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append(
      "features",
      JSON.stringify(form.features.split(",").map((f) => f.trim()).filter(Boolean))
    );
    if (form.image) data.append("image", form.image);

    await api.post("/insurance", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setSubmitting(false);
    setForm({ name: "", description: "", price: "", features: "", image: null });
    fetchPlans();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-text-primary">Insurance Plans</h1>
        <Button variant="primary">Add Plan</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {loading &&
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-64 w-full" />
          ))}
        {!loading &&
          plans.map((plan) => (
            <div key={plan._id} className="relative">
              <InsurancePlanCard plan={plan} />
              <div className="absolute right-3 top-3 space-x-2">
                <Button variant="ghost" size="sm" onClick={() => deletePlan(plan._id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
      </div>
      <form className="rounded-lg border border-border p-4 space-y-3 max-w-xl" onSubmit={addPlan}>
        <h3 className="font-display text-lg text-text-primary">Add Plan</h3>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
        <Input label="Description" name="description" value={form.description} onChange={handleChange} required />
        <Input label="Price" name="price" value={form.price} onChange={handleChange} />
        <Input
          label="Features (comma separated)"
          name="features"
          value={form.features}
          onChange={handleChange}
        />
        <label className="flex flex-col gap-2 text-label text-text-muted">
          Image (optional)
          <input type="file" accept="image/*" onChange={handleFile} />
          {form.image && (
            <span className="flex items-center gap-2 text-body-sm text-text-muted">
              {form.image.name}
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, image: null }))}
                className="text-error"
              >
                <LiaTimesSolid />
              </button>
            </span>
          )}
        </label>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Plan"}
        </Button>
      </form>
    </div>
  );
}
