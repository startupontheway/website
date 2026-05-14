export interface ServiceItem {
  slug: string;
  name: string;
  short: string;
  description: string;
  process: string[];
}

export const services: ServiceItem[] = [
  {
    slug: "private-limited-registration",
    name: "Private Limited Registration",
    short: "Incorporate a Pvt Ltd company end-to-end.",
    description:
      "From name reservation to certificate of incorporation — we manage the entire MCA process so you can focus on building.",
    process: ["Name reservation (RUN)", "DSC & DIN", "MoA & AoA drafting", "SPICe+ filing", "Incorporation certificate"],
  },
  {
    slug: "llp-registration",
    name: "LLP Registration",
    short: "Limited Liability Partnership setup.",
    description: "A flexible structure with the protection of limited liability — ideal for service-led founding teams.",
    process: ["Name approval", "DPIN allotment", "LLP agreement drafting", "MCA filing", "PAN & TAN"],
  },
  {
    slug: "gst-registration",
    name: "GST Registration",
    short: "Get your GSTIN issued in days.",
    description: "End-to-end GST registration with compliance review and ongoing filing support.",
    process: ["Eligibility review", "Document collation", "ARN generation", "Officer follow-up", "GSTIN issued"],
  },
  {
    slug: "trademark-registration",
    name: "Trademark Registration",
    short: "Protect your brand identity.",
    description: "Comprehensive search, class advisory, and filing with the trademark registry.",
    process: ["Brand search", "Class selection", "TM-A filing", "Examination response", "Registration"],
  },
  {
    slug: "fssai-licence",
    name: "FSSAI Licence",
    short: "Food business compliance.",
    description: "Basic, State, or Central — we identify the right licence and handle filing.",
    process: ["Category review", "Form selection", "Documentation", "Application filing", "Licence issued"],
  },
  {
    slug: "roc-compliance",
    name: "ROC Compliance",
    short: "Annual filings, board minutes, registers.",
    description: "Stay compliant with the Companies Act — we handle annual returns, board resolutions, and statutory registers.",
    process: ["Compliance calendar", "Board minutes", "Annual return", "Financial statements", "Director KYC"],
  },
  {
    slug: "startup-india-registration",
    name: "Startup India Registration",
    short: "DPIIT recognition + tax benefits.",
    description: "Unlock tax exemptions, IPR fast-tracks, and government tenders with DPIIT recognition.",
    process: ["Eligibility check", "Pitch deck prep", "DPIIT application", "Recognition certificate", "Tax exemption (80-IAC)"],
  },
  {
    slug: "accounting-taxation",
    name: "Accounting & Taxation",
    short: "Bookkeeping, returns, advisory.",
    description: "Founder-friendly accounting that scales — monthly books, GST returns, and tax planning.",
    process: ["Monthly bookkeeping", "GST returns", "TDS filings", "Income tax", "Advisory calls"],
  },
  {
    slug: "legal-documentation",
    name: "Legal Documentation",
    short: "Contracts, NDAs, founders' agreements.",
    description: "Production-ready contracts drafted by lawyers — founders' agreements, NDAs, employment, vendor contracts.",
    process: ["Requirement intake", "Drafting", "Review cycles", "Final execution", "Repository setup"],
  },
];
