import Listing from "../models/Listing.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../libs/cloudinary.js";

const uploadFiles = async (files = []) => {
  if (!files.length) return [];
  const uploads = files.map(
    (file) =>
      new Promise((resolve, reject) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
        cloudinary.uploader
          .upload(base64, { folder: "chychy_listings" })
          .then((res) => resolve(res.secure_url))
          .catch(reject);
      })
  );
  return Promise.all(uploads);
};

export const getListings = asyncHandler(async (req, res) => {
  const {
    type,
    city,
    minPrice,
    maxPrice,
    bedrooms,
    featured,
    limit = 12,
    page = 1,
    exclude,
    furnished,
  } = req.query;

  const filter = { status: "available" };
  if (type) filter.type = type;
  if (city) filter["location.city"] = city;
  if (featured !== undefined) filter.featured = featured === "true";
  if (exclude) filter._id = { $ne: exclude };
  if (bedrooms) filter["features.bedrooms"] = { $gte: Number(bedrooms) };
  if (furnished !== undefined && furnished !== "") {
    const isFurnished = furnished === "true" || furnished === true;
    filter["features.furnished"] = isFurnished;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const listings = await Listing.find(filter, {
    title: 1,
    slug: 1,
    type: 1,
    price: 1,
    location: 1,
    features: 1,
    coverImage: 1,
    featured: 1,
    status: 1,
    images: 1,
    createdAt: 1,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Listing.countDocuments(filter);

  return apiResponse.success(res, { listings, total, page: Number(page) });
});

export const getFeaturedListings = asyncHandler(async (_req, res) => {
  const listings = await Listing.find({ featured: true }).limit(6).lean();
  return apiResponse.success(res, listings);
});

export const getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({ slug: req.params.slug });
  if (!listing) throw new AppError("Listing not found", 404, "NOT_FOUND");
  return apiResponse.success(res, listing);
});

export const createListing = asyncHandler(async (req, res) => {
  const data = req.body;
  const uploadedImages = await uploadFiles(req.files || []);
  const images = uploadedImages.length ? uploadedImages : data.images || [];
  const listing = await Listing.create({
    ...data,
    images,
    coverImage: data.coverImage || images[0],
  });
  return apiResponse.success(res, listing, 201);
});

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404, "NOT_FOUND");
  const uploadedImages = await uploadFiles(req.files || []);
  const images = uploadedImages.length ? uploadedImages : listing.images;

  listing.set({ ...req.body, images, coverImage: req.body.coverImage || images[0] });
  await listing.save();
  return apiResponse.success(res, listing);
});

export const deleteListing = asyncHandler(async (req, res) => {
  const deleted = await Listing.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Listing not found", 404, "NOT_FOUND");
  return apiResponse.success(res, { deleted: true });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404, "NOT_FOUND");
  listing.status = status;
  await listing.save();
  return apiResponse.success(res, listing);
});

export const toggleFeaturedListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404, "NOT_FOUND");
  listing.featured = !listing.featured;
  await listing.save();
  return apiResponse.success(res, listing);
});
