import { useEffect, useState } from "react";
import api from "../../utils/api";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import Input from "../../components/ui/Input";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Shield,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["life", "health", "property", "auto", "business"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  features: "",
  category: "",
  popular: false,
  order: 0,
  image: null,
};

export default function Insurance() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingPlan(null);
    setShowForm(false);
  };

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/insurance");
      setPlans(res.data.data || []);
    } catch {
      toast.error("Failed to load insurance plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const deletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    setDeleting(id);
    try {
      await api.delete(`/insurance/${id}`);
      setPlans((prev) => prev.filter((p) => p._id !== id));
      toast.success("Plan deleted");
    } catch {
      toast.error("Failed to delete plan");
    } finally {
      setDeleting(null);
    }
  };

  const startEdit = (plan) => {
    setEditingPlan(plan._id);
    setForm({
      name: plan.name || "",
      description: plan.description || "",
      price: plan.price || "",
      features: (plan.features || []).join(", "),
      category: plan.category || "",
      popular: plan.popular || false,
      order: plan.order || 0,
      image: null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleFile = (e) =>
    setForm((p) => ({ ...p, image: e.target.files?.[0] || null }));

  const savePlan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append(
        "features",
        JSON.stringify(
          form.features
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean),
        ),
      );
      if (form.category) data.append("category", form.category);
      data.append("popular", form.popular);
      data.append("order", form.order);
      if (form.image) data.append("image", form.image);

      if (editingPlan) {
        await api.put(`/insurance/${editingPlan}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Plan updated!");
      } else {
        await api.post("/insurance", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Plan created!");
      }
      resetForm();
      fetchPlans();
    } catch {
      toast.error(
        editingPlan ? "Failed to update plan" : "Failed to create plan",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Insurance Plans
          </h1>
          <p className="text-body-sm text-text-muted">
            {plans.length} plan{plans.length !== 1 && "s"}
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-1.5" />
            Add Plan
          </Button>
        )}
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <form
          className="rounded-xl border border-border bg-surface p-5 shadow-card space-y-4"
          onSubmit={savePlan}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-text-primary">
              {editingPlan ? "Edit Plan" : "New Plan"}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-md p-1 text-text-muted hover:bg-surface-soft hover:text-text-primary"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Plan Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="e.g. Premium Health Cover"
            />
            <div className="flex flex-col gap-1">
              <label className="text-label font-medium text-text-muted">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-body-sm text-text-primary focus:border-primary focus:outline-none"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            placeholder="Brief description of plan benefits"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Price"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. ₦50,000/year"
            />
            <Input
              label="Display Order"
              name="order"
              type="number"
              value={form.order}
              onChange={handleChange}
            />
            <div className="flex items-end pb-1">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  name="popular"
                  checked={form.popular}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="flex items-center gap-1 text-body-sm text-text-primary">
                  <Star size={14} className="text-amber-500" /> Mark as Popular
                </span>
              </label>
            </div>
          </div>

          <Input
            label="Features (comma separated)"
            name="features"
            value={form.features}
            onChange={handleChange}
            placeholder="24/7 Support, Free consultation, ..."
          />

          <div className="flex flex-col gap-2">
            <label className="text-label font-medium text-text-muted">
              Image (optional)
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-4 py-3 text-body-sm text-text-muted hover:border-primary hover:text-primary">
              <ImageIcon size={16} />
              {form.image ? form.image.name : "Choose an image…"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="sr-only"
              />
            </label>
            {form.image && (
              <button
                type="button"
                onClick={() => setForm((p) => ({ ...p, image: null }))}
                className="self-start text-[12px] text-error hover:underline"
              >
                Remove file
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving…"
                : editingPlan
                  ? "Update Plan"
                  : "Create Plan"}
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Plans table / grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <Shield size={40} className="mb-3 text-text-muted/40" />
          <p className="text-text-muted">No insurance plans yet</p>
          <Button className="mt-4" size="sm" onClick={() => setShowForm(true)}>
            <Plus size={14} className="mr-1" /> Add your first plan
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-body-sm">
            <thead className="border-b border-border bg-surface-soft">
              <tr>
                <th className="px-4 py-3 font-medium text-text-muted">#</th>
                <th className="px-4 py-3 font-medium text-text-muted">Plan</th>
                <th className="hidden px-4 py-3 font-medium text-text-muted md:table-cell">
                  Category
                </th>
                <th className="hidden px-4 py-3 font-medium text-text-muted sm:table-cell">
                  Price
                </th>
                <th className="hidden px-4 py-3 font-medium text-text-muted lg:table-cell">
                  Features
                </th>
                <th className="px-4 py-3 text-right font-medium text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {plans.map((plan, idx) => (
                <tr
                  key={plan._id}
                  className="transition-colors hover:bg-surface-soft/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-text-muted">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {plan.image ? (
                        <img
                          src={plan.image}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Shield size={16} className="text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-text-primary">
                          {plan.name}
                          {plan.popular && (
                            <Star
                              size={12}
                              className="ml-1.5 inline text-amber-500"
                              fill="currentColor"
                            />
                          )}
                        </p>
                        <p className="line-clamp-1 text-[12px] text-text-muted">
                          {plan.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 md:table-cell">
                    {plan.category && (
                      <span className="rounded-pill bg-accent-soft px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        {plan.category}
                      </span>
                    )}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 font-medium text-text-primary sm:table-cell">
                    {plan.price || "—"}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <span className="text-text-muted">
                      {plan.features?.length || 0} feature
                      {plan.features?.length !== 1 && "s"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(plan)}
                        className="rounded-md p-1.5 text-text-muted hover:bg-primary/10 hover:text-primary"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePlan(plan._id)}
                        disabled={deleting === plan._id}
                        className="rounded-md p-1.5 text-text-muted hover:bg-error/10 hover:text-error disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
