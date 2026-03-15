export const OWNER = {
  fullName: "Maryann Chieboam Eloike",
  displayName: "Eloike Maryann",
  title: "Real Estate & Insurance Advisor",
  tagline: "15 Years of Trust, Expertise & Results",
  location: "Lagos, Nigeria",
  email: "maryann@chychyagent.com",
  bio: {
    opening:
      "For over fifteen years, Maryann Chieboam Eloike has " +
      "been one of the most trusted names in Nigerian real " +
      "estate and insurance. Based in Lagos, she has helped " +
      "hundreds of individuals, families, and businesses " +
      "secure properties and protect what matters most.",
    middle:
      "Her career began in the insurance sector at AIICO " +
      "Insurance Company, one of Nigeria's largest and most " +
      "respected insurance firms, where she spent a decade " +
      "mastering risk assessment, policy structuring, and " +
      "client relationship management. She then brought that " +
      "deep financial discipline into real estate, spending " +
      "five formative years at AY Housing helping clients " +
      "navigate property transactions across Lagos.",
    closing:
      "Today, through ChyChyAgent, Maryann combines both " +
      "worlds — offering clients a rare dual expertise in " +
      "property and protection. Whether you are buying your " +
      "first home, expanding a portfolio, or securing your " +
      "assets, she brings the knowledge, network, and " +
      "dedication to get it right.",
  },
  quote: {
    text:
      "My work is not just about transactions. It is about " +
      "building security — the kind that lets families sleep " +
      "well at night knowing their home and their future " +
      "are protected.",
    attribution: "— Maryann Chieboam Eloike, Founder",
  },
  mission:
    "To make premium real estate and insurance services " +
    "accessible, transparent, and deeply personal for every " +
    "Nigerian client — regardless of their starting point.",
  vision:
    "A Nigeria where every family owns property and carries " +
    "the protection they deserve, guided by advisors who " +
    "genuinely care about their outcome.",
  values: [
    {
      title: "Trust",
      description:
        "Every recommendation is made with the " +
        "client's best interest — not commission — " +
        "at the centre.",
      icon: "Shield",
    },
    {
      title: "Expertise",
      description:
        "15 years across two disciplines means " +
        "advice grounded in real experience, not theory.",
      icon: "Award",
    },
    {
      title: "Accessibility",
      description:
        "Premium guidance should not be reserved " +
        "for the wealthy. Everyone deserves a trusted advisor.",
      icon: "Users",
    },
    {
      title: "Integrity",
      description:
        "Transparent pricing, honest timelines, " +
        "and clear communication — always.",
      icon: "CheckCircle",
    },
  ],
};

export const STATS = [
  {
    value: "15+",
    label: "Years of Experience",
    detail: "Across insurance and real estate",
  },
  {
    value: "10",
    label: "Years at AIICO Insurance",
    detail: "Nigeria's leading insurance firm",
  },
  {
    value: "5",
    label: "Years at AY Housing",
    detail: "Lagos property transactions",
  },
  {
    value: "500+",
    label: "Clients Served",
    detail: "Individuals, families, businesses",
    note: "Update this number when confirmed",
  },
];

export const TIMELINE = [
  {
    id: "education-secondary",
    type: "education",
    period: "Secondary Education",
    year: "Pre-2005",
    org: "Nigeria",
    role: "Secondary School",
    summary:
      "Completed secondary education in Nigeria. " +
      "Demonstrated early aptitude for business, " +
      "mathematics, and economics.",
    note: "Update school name when confirmed",
    current: false,
  },
  {
    id: "education-university",
    type: "education",
    period: "University Education",
    year: "c. 2005 – 2009",
    org: "Nigerian University",
    role: "Undergraduate Degree",
    summary:
      "Pursued a degree in a business or finance-related " +
      "discipline, building the academic foundation for a " +
      "career in financial services and property.",
    note: "Update university name and course when confirmed",
    current: false,
  },
  {
    id: "aiico",
    type: "insurance",
    period: "10 Years",
    year: "c. 2010 – 2020",
    org: "AIICO Insurance Company",
    role: "Insurance Advisor",
    summary:
      "Spent a full decade at AIICO Insurance — one of " +
      "Nigeria's largest and most established insurance " +
      "providers. Built deep expertise in life insurance, " +
      "property coverage, risk assessment, and long-term " +
      "financial planning for individuals and corporate clients. " +
      "Managed a growing portfolio of clients and developed " +
      "the relationship skills that define ChyChyAgent today.",
    highlight: "Nigeria's largest insurance company",
    current: false,
  },
  {
    id: "ayhousing",
    type: "realestate",
    period: "5 Years",
    year: "c. 2018 – 2023",
    org: "AY Housing",
    role: "Real Estate Advisor",
    summary:
      "Transitioned into real estate through AY Housing, " +
      "bringing the financial rigour and client-first approach " +
      "developed at AIICO into the property market. Facilitated " +
      "residential and commercial transactions across Lagos, " +
      "developing a network of developers, landlords, and " +
      "buyers that powers ChyChyAgent to this day.",
    highlight: "Lagos property transactions specialist",
    current: false,
  },
  {
    id: "chychyagent",
    type: "founder",
    period: "Present",
    year: "2023 – Present",
    org: "ChyChyAgent",
    role: "Founder & Principal Advisor",
    summary:
      "Founded ChyChyAgent to offer clients a unique dual " +
      "service — premium real estate and insurance under one " +
      "trusted advisor. Built on 15 years of combined industry " +
      "experience, the agency serves individuals, families, " +
      "and businesses across Lagos and beyond.",
    highlight: "Dual expertise: real estate + insurance",
    current: true,
  },
];

export const TIMELINE_TYPE_STYLES = {
  education: {
    bg: "bg-accent-soft",
    text: "text-primary-dark",
    label: "Education",
  },
  insurance: {
    bg: "bg-primary-light",
    text: "text-primary-dark",
    label: "Insurance",
  },
  realestate: {
    bg: "bg-surface-soft",
    text: "text-primary",
    label: "Real Estate",
  },
  founder: { bg: "bg-primary", text: "text-white", label: "Founder" },
};

export const CERTIFICATIONS = [
  {
    id: "aiico-cert",
    title: "AIICO Insurance Professional Certification",
    org: "AIICO Insurance Company",
    year: "Awarded during tenure",
    note: "Update certification name when confirmed",
    icon: "Award",
  },
  {
    id: "insurance-cert",
    title: "Insurance Industry Certification",
    org: "Nigerian Insurance Industry",
    year: "Confirmed during AIICO years",
    note: "Update with specific certification name",
    icon: "Shield",
  },
  {
    id: "realestate-cert",
    title: "Real Estate Certification",
    org: "AY Housing / Nigerian Property Council",
    year: "During AY Housing tenure",
    note: "Update with specific certification body",
    icon: "Home",
  },
  {
    id: "placeholder",
    title: "Additional Certifications",
    org: "To be updated",
    year: "",
    note: "Maryann to provide full list",
    icon: "Star",
  },
];

// GALLERY — polaroid carousel on the About page.
// Replace src values with real Cloudinary URLs
// when Maryann provides photos.
// Rotation values are fixed — do not randomise.
export const GALLERY = [
  {
    id: "g1",
    src: "",
    alt: "Maryann at a client property consultation in Lagos",
    caption: "Client consultation",
    rotation: -3.8,
  },
  {
    id: "g2",
    src: "",
    alt: "ChyChyAgent office Lagos — working space",
    caption: "Our Lagos office",
    rotation: 2.4,
  },
  {
    id: "g3",
    src: "",
    alt: "Maryann at a property site visit",
    caption: "Site visit",
    rotation: -1.6,
  },
  {
    id: "g4",
    src: "",
    alt: "Insurance advisory session with a client",
    caption: "Insurance session",
    rotation: 3.2,
  },
  {
    id: "g5",
    src: "",
    alt: "Maryann at a real estate industry event",
    caption: "Industry event",
    rotation: -2.5,
  },
  {
    id: "g6",
    src: "",
    alt: "Property handover ceremony with a client",
    caption: "Handover day",
    rotation: 1.8,
  },
];
