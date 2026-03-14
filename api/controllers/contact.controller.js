import Contact from "../models/Contact.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    throw new AppError("Name, email, and message are required", 400, "VALIDATION_ERROR");
  }
  const contact = await Contact.create(req.body);
  return apiResponse.success(res, contact, 201);
});

export const listContacts = asyncHandler(async (req, res) => {
  const { read, limit = 20, page = 1 } = req.query;
  const filter = {};
  if (read !== undefined) filter.read = read === "true";
  const skip = (Number(page) - 1) * Number(limit);
  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  const total = await Contact.countDocuments(filter);
  return apiResponse.success(res, { contacts, total, page: Number(page) });
});

export const markRead = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new AppError("Contact not found", 404, "NOT_FOUND");
  contact.read = true;
  await contact.save();
  return apiResponse.success(res, contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const deleted = await Contact.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Contact not found", 404, "NOT_FOUND");
  return apiResponse.success(res, { deleted: true });
});
