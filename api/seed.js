import dotenv from "dotenv";
import { connectDB } from "./libs/db.js";
import User from "./models/User.model.js";
import Listing from "./models/Listing.model.js";
import Insurance from "./models/Insurance.model.js";
import Blog from "./models/Blog.model.js";

dotenv.config();

/* ───────────────────── SUPER ADMIN ───────────────────── */
const adminData = {
  name: "Edeh Chinedu",
  email: "edehchinedu59@gmail.com",
  password: "Goodfave22@",
  role: "superadmin",
};

/* ───────────────────── LISTINGS ───────────────────── */
const listings = [
  {
    title: "Modern 3-Bedroom Apartment in Lekki Phase 1",
    description:
      "Beautifully finished 3-bedroom flat with en-suite bathrooms, fitted kitchen, and 24-hour power supply. Located in a serene estate in Lekki Phase 1 with excellent road access.",
    type: "sale",
    price: 85000000,
    location: { address: "12 Admiralty Way", city: "Lekki", state: "Lagos" },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      sqm: 150,
      parking: true,
      furnished: true,
    },
    coverImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    featured: true,
    status: "available",
  },
  {
    title: "Luxury 5-Bedroom Duplex in Ikoyi",
    description:
      "Exquisite 5-bedroom fully detached duplex with swimming pool, gym, BQ, and smart home features. Premium finishing throughout, situated in the heart of Ikoyi.",
    type: "sale",
    price: 350000000,
    location: { address: "7 Bourdillon Road", city: "Ikoyi", state: "Lagos" },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      sqm: 450,
      parking: true,
      furnished: true,
    },
    coverImage:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    featured: true,
    status: "available",
  },
  {
    title: "Affordable 2-Bedroom Flat in Festac Town",
    description:
      "Well-maintained 2-bedroom apartment in a gated estate within Festac Town. Close to schools, markets and major transport links. Perfect for young families.",
    type: "rent",
    price: 1500000,
    location: { address: "22 2nd Avenue", city: "Festac Town", state: "Lagos" },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      sqm: 90,
      parking: true,
      furnished: false,
    },
    coverImage:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    featured: false,
    status: "available",
  },
  {
    title: "4-Bedroom Semi-Detached House in Ajah",
    description:
      "Spacious 4-bedroom semi-detached house in a secure estate in Ajah. Features include all rooms en-suite, spacious living area, modern kitchen, and ample parking space.",
    type: "sale",
    price: 55000000,
    location: {
      address: "Plot 15 Abraham Adesanya",
      city: "Ajah",
      state: "Lagos",
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      sqm: 220,
      parking: true,
      furnished: false,
    },
    coverImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
    ],
    featured: true,
    status: "available",
  },
  {
    title: "Studio Apartment in Victoria Island",
    description:
      "Chic furnished studio apartment in Victoria Island. Ideal for professionals and expatriates. 24/7 security, power, and water. Walking distance to Eko Atlantic.",
    type: "rent",
    price: 3500000,
    location: {
      address: "5 Adeola Odeku Street",
      city: "Victoria Island",
      state: "Lagos",
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      sqm: 45,
      parking: false,
      furnished: true,
    },
    coverImage:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
    featured: false,
    status: "available",
  },
  {
    title: "Commercial Office Space in Ikeja GRA",
    description:
      "Premium open-plan office space in Ikeja GRA. 200sqm with reception, conference room, and 10 dedicated parking slots. Suitable for corporate organisations.",
    type: "rent",
    price: 8000000,
    location: { address: "30 Opebi Road", city: "Ikeja", state: "Lagos" },
    features: {
      bedrooms: 0,
      bathrooms: 2,
      sqm: 200,
      parking: true,
      furnished: false,
    },
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
    ],
    featured: false,
    status: "available",
  },
];

/* ───────────────────── INSURANCE PLANS ───────────────────── */
const insurancePlans = [
  {
    name: "Home Shield Basic",
    description:
      "Essential coverage for your home against fire, flood, and theft. Affordable protection for homeowners and tenants across Nigeria.",
    price: "₦25,000/yr",
    features: [
      "Fire & flood protection",
      "Theft coverage",
      "Third-party liability",
      "24/7 claims support",
    ],
    category: "property",
    popular: false,
    order: 1,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
  },
  {
    name: "Home Shield Premium",
    description:
      "Comprehensive property insurance covering structural damage, contents, personal liability, and temporary accommodation during repairs.",
    price: "₦75,000/yr",
    features: [
      "All Basic features",
      "Content coverage up to ₦10M",
      "Temporary accommodation",
      "Legal liability cover",
      "Rent default insurance",
    ],
    category: "property",
    popular: true,
    order: 2,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
  },
  {
    name: "Motor Vehicle Comprehensive",
    description:
      "Full coverage for your vehicle including accident damage, theft, third-party injury, and fire. Compliant with Nigerian insurance regulations.",
    price: "₦45,000/yr",
    features: [
      "Accident damage repair",
      "Vehicle theft protection",
      "Third-party liability",
      "Fire damage",
      "Free towing up to 50km",
    ],
    category: "auto",
    popular: true,
    order: 3,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
  },
  {
    name: "Life Assurance Plan",
    description:
      "Secure your family's future with our life assurance plan. Guaranteed payout to beneficiaries, with optional critical illness rider.",
    price: "From ₦50,000/yr",
    features: [
      "Death benefit up to ₦50M",
      "Critical illness rider",
      "Accidental death cover",
      "Premium waiver on disability",
      "Flexible payment terms",
    ],
    category: "life",
    popular: false,
    order: 4,
    image: "https://images.unsplash.com/photo-1516733968668-dbdce39c0651?w=800",
  },
  {
    name: "Health Guard Family",
    description:
      "Comprehensive health insurance for your family covering hospital visits, surgeries, maternity, dental, and optical care across Nigeria.",
    price: "₦120,000/yr",
    features: [
      "In-patient & out-patient cover",
      "Maternity care",
      "Dental & optical",
      "Access to 500+ hospitals",
      "Annual health check-up",
    ],
    category: "health",
    popular: true,
    order: 5,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
  },
  {
    name: "Business All-Risk",
    description:
      "Protect your business premises, stock, equipment, and employees with our all-risk business insurance package.",
    price: "From ₦150,000/yr",
    features: [
      "Premises & content cover",
      "Stock-in-trade",
      "Employee liability",
      "Business interruption",
      "Money-in-transit cover",
    ],
    category: "business",
    popular: false,
    order: 6,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
  },
];

/* ───────────────────── BLOG POSTS ───────────────────── */
const makeBlog = (
  title,
  category,
  excerpt,
  content,
  status,
  featured = false,
) => ({
  title,
  category,
  excerpt,
  content,
  status,
  featured,
  author: "Eloike Maryann",
  coverImage: "",
  tags: [],
});

const blogs = [
  makeBlog(
    "5 Things to Check Before Buying Land in Lagos",
    "Real Estate",
    "Buying land in Lagos can be tricky. Here are 5 essential checks every buyer should make before parting with their money.",
    `<h2>1. Verify the Title Document</h2><p>Always request and verify the Certificate of Occupancy (C of O), Governor's Consent, or registered survey plan. A property without proper documentation is a red flag. Visit the Lagos State Land Registry to confirm authenticity.</p><h2>2. Conduct a Physical Inspection</h2><p>Never buy land you haven't physically inspected. Check for encroachments, swampy terrain, power line proximity, and access roads. Visit at different times of the day and during rainy season if possible.</p><h2>3. Investigate the Seller's Identity</h2><p>Confirm that the seller is the rightful owner. Request means of identification, utility bills, and cross-reference with the land documents. Beware of family land disputes — engage a lawyer familiar with Lagos property law.</p><h2>4. Check for Government Acquisition</h2><p>Some lands in Lagos are under government acquisition or excision. Confirm with the Lagos State Physical Planning Permit Authority (LASPPPA) and check the gazette for any acquisition notices in that area.</p><h2>5. Engage a Professional</h2><p>Always use a qualified real estate agent (like ChyChyAgent) and a property lawyer. The cost of professional guidance is always less than the cost of buying a disputed property.</p>`,
    "published",
    true,
  ),
  makeBlog(
    "Understanding Home Insurance in Nigeria: A Complete Guide",
    "Insurance",
    "Home insurance is often overlooked in Nigeria. This guide explains what it covers, why you need it, and how to choose the right plan.",
    `<h2>What is Home Insurance?</h2><p>Home insurance (also called homeowner's insurance) is a policy that covers losses and damage to your house, its contents, and in some cases liability for accidents that happen on your property.</p><h2>Why Do You Need It?</h2><p>In Nigeria, natural disasters like flooding are increasingly common. Fire outbreaks in densely populated areas, theft, and vandalism are also major risks. Home insurance provides financial protection when the unexpected happens.</p><h2>Types of Cover Available</h2><ul><li><strong>Building insurance:</strong> Covers the physical structure — walls, roof, floors, fixtures</li><li><strong>Contents insurance:</strong> Covers belongings inside the home — electronics, furniture, jewellery</li><li><strong>Combined policy:</strong> Covers both building and contents</li></ul><h2>How to Choose the Right Plan</h2><p>Consider the value of your property, the area you live in (flood risk, crime rate), and your budget. At ChyChyAgent, we help you compare plans from top Nigerian insurers to find the best fit for your needs and pocket.</p>`,
    "published",
    true,
  ),
  makeBlog(
    "Top 5 Neighbourhoods for Families in Lagos",
    "Real Estate",
    "Looking for the best place to raise a family in Lagos? We rank the top 5 neighbourhoods based on safety, schools, amenities, and value.",
    `<h2>1. Lekki Phase 1</h2><p>Excellent schools, growing infrastructure, and a mix of affordable to luxury housing. Close to shopping malls, hospitals, and beaches. The traffic can be challenging during rush hours but new road projects are improving this.</p><h2>2. Magodo GRA</h2><p>One of the most serene residential estates in Lagos. Low crime rate, good road network, and proximity to Ikeja and the mainland. Great for families who value peace and quiet.</p><h2>3. Festac Town</h2><p>An established residential area with a strong community feel. Affordable compared to Island properties, with schools, hospitals, and markets within walking distance. The infrastructure is being upgraded as part of Lagos development plans.</p><h2>4. Ikoyi</h2><p>The premium residential area of Lagos. High security, world-class amenities, and excellent international schools. Property prices are high but the quality of life is unmatched.</p><h2>5. Ajah / Sangotedo</h2><p>Rapidly developing with new estates offering modern amenities at relatively affordable prices. The Lekki-Epe Expressway expansion is improving connectivity. A great option for young families looking to invest early.</p>`,
    "published",
    false,
  ),
  makeBlog(
    "How Motor Vehicle Insurance Works in Nigeria",
    "Insurance",
    "Motor vehicle insurance is mandatory in Nigeria, yet many drivers don't understand their coverage. Here's what you need to know.",
    `<h2>Is Car Insurance Mandatory?</h2><p>Yes. Under the Insurance Act 2003 and the Motor Vehicles (Third Party Insurance) Act, every vehicle on Nigerian roads must have at minimum a third-party insurance policy. Driving without insurance attracts fines and penalties.</p><h2>Types of Motor Insurance</h2><ul><li><strong>Third-Party Only:</strong> The minimum legal requirement. Covers damage or injury you cause to others, not your own vehicle.</li><li><strong>Third-Party, Fire & Theft:</strong> Adds coverage for fire damage and theft of your vehicle on top of third-party cover.</li><li><strong>Comprehensive:</strong> Full coverage including damage to your own vehicle from accidents, fire, theft, flood, and vandalism.</li></ul><h2>How Claims Work</h2><p>Report incidents to your insurer within 24-48 hours. Provide photos, police reports, and any relevant documents. Most reputable insurers process claims within 2-4 weeks. At ChyChyAgent, we guide you through the entire claims process.</p>`,
    "published",
    false,
  ),
  makeBlog(
    "Estate Investment Tips for First-Time Buyers",
    "Real Estate",
    "First-time property investor? Avoid common mistakes with these practical tips tailored for the Nigerian real estate market.",
    `<h2>Start with Research</h2><p>Understand the areas you are considering. Look at price trends, infrastructure development plans, and demand for rental properties. Lagos, Abuja, and Port Harcourt remain the strongest markets but emerging cities like Ibadan and Enugu offer opportunities.</p><h2>Budget Beyond the Purchase Price</h2><p>Factor in legal fees (typically 5-10% of property value), agency fees, survey costs, and renovation expenses. Many first-time buyers underestimate these costs and end up financially strained.</p><h2>Consider Off-Plan Purchases</h2><p>Buying off-plan (before construction is complete) can save you 20-30% compared to buying completed units. However, only buy from developers with a proven track record. Request to see their previous projects.</p><h2>Think Long-Term</h2><p>Real estate in Nigeria appreciates over time, especially in developing areas with good infrastructure plans. Look for areas with new roads, malls, schools, and hospitals being built. Patience is your greatest asset as a property investor.</p>`,
    "draft",
    false,
  ),
  makeBlog(
    "Why Every Nigerian Homeowner Needs Life Insurance",
    "Insurance",
    "Life insurance protects your family if something happens to you. Here's why it's especially important for Nigerian homeowners with mortgages.",
    `<h2>The Mortgage Protection Gap</h2><p>If you die while still paying a mortgage, your family could lose the home. Life insurance ensures the remaining mortgage balance is covered, allowing your family to keep their home without financial burden.</p><h2>Beyond Mortgages</h2><p>Life insurance provides a safety net for your dependents. It can cover children's education, daily living expenses, and outstanding debts. In a country where social safety nets are limited, personal insurance fills a critical gap.</p><h2>Types to Consider</h2><ul><li><strong>Term life:</strong> Covers you for a specific period (10, 20, 30 years). Affordable and straightforward.</li><li><strong>Whole life:</strong> Covers you for your entire lifetime with a savings component.</li><li><strong>Mortgage protection:</strong> Specifically designed to decrease in value as your mortgage balance reduces.</li></ul><h2>Getting Started</h2><p>Speak with a licensed insurance advisor to assess your needs. At ChyChyAgent, we partner with leading Nigerian insurers to help you find the right coverage at competitive rates.</p>`,
    "draft",
    false,
  ),
];

/* ───────────────────── SEED RUNNER ───────────────────── */
async function seed() {
  try {
    await connectDB();
    console.log("Connected to database\n");

    // 1. Seed super admin
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      existing.role = "superadmin";
      await existing.save();
      console.log("✓ Existing user promoted to superadmin");
    } else {
      await User.create(adminData);
      console.log("✓ Super admin created");
    }

    // Get admin for blog author reference
    const admin = await User.findOne({ email: adminData.email });

    // 2. Seed listings
    const existingListings = await Listing.countDocuments();
    if (existingListings === 0) {
      for (const listing of listings) {
        const doc = new Listing(listing);
        await doc.save(); // .save() triggers pre-save hooks for slug generation
      }
      console.log(`✓ ${listings.length} listings seeded`);
    } else {
      console.log(`⊘ Listings already exist (${existingListings}), skipping`);
    }

    // 3. Seed insurance plans
    const existingPlans = await Insurance.countDocuments();
    if (existingPlans === 0) {
      await Insurance.insertMany(insurancePlans);
      console.log(`✓ ${insurancePlans.length} insurance plans seeded`);
    } else {
      console.log(
        `⊘ Insurance plans already exist (${existingPlans}), skipping`,
      );
    }

    // 4. Seed blogs
    const existingBlogs = await Blog.countDocuments();
    if (existingBlogs === 0) {
      const blogsWithAuthor = blogs.map((b) => ({ ...b, author: admin._id }));
      await Blog.create(blogsWithAuthor); // .create() to trigger pre-save hooks (slug, readTime)
      const published = blogs.filter((b) => b.status === "published").length;
      const drafts = blogs.filter((b) => b.status === "draft").length;
      console.log(
        `✓ ${blogs.length} blogs seeded (${published} published, ${drafts} drafts)`,
      );
    } else {
      console.log(`⊘ Blogs already exist (${existingBlogs}), skipping`);
    }

    console.log("\n✅ Seed complete");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seed();
