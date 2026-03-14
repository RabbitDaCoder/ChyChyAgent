import mongoose from "mongoose";
import slugify from "slugify";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  type: { type: String, enum: ["sale", "rent"], required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: "NGN" },
  location: {
    address: String,
    city: String,
    state: String,
  },
  features: {
    bedrooms: Number,
    bathrooms: Number,
    sqm: Number,
    parking: Boolean,
    furnished: Boolean,
  },
  images: [{ type: String }],
  coverImage: { type: String },
  featured: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["available", "sold", "rented"],
    default: "available",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

listingSchema.pre("validate", function (next) {
  if (!this.slug || this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  this.updatedAt = Date.now();
  next();
});

listingSchema.index({ status: 1, type: 1 });
listingSchema.index({ "location.city": 1 });
listingSchema.index({ featured: 1 });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
