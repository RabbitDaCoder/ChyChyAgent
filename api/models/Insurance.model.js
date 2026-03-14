import mongoose from "mongoose";

const insuranceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String },
  features: [{ type: String }],
  category: {
    type: String,
    enum: ["life", "health", "property", "auto", "business"],
  },
  popular: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  image: { type: String },
});

const Insurance = mongoose.model("Insurance", insuranceSchema);
export default Insurance;
