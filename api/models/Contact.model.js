import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  service: { type: String },
  message: { type: String, required: true },
  listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
