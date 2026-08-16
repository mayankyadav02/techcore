export type Industry = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  focus: string[];
  relatedServiceSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export const industries: Industry[] = [
  {
    slug: "healthcare",
    title: "Healthcare",
    seoTitle: "Healthcare Industry — Technology for Care Operations",
    seoDescription:
      "Fictional TechCore healthcare industry page: coordination, access, and operational software for clinics and health service operators.",
    summary:
      "Privacy-aware platforms for clinics, networks, and health-service operators who need coordination without widening access.",
    body: "Healthcare organisations come to TechCore when scheduling, referrals, and documents live in different tools and staff compensate with inboxes. We do not operate clinical services. We build the operational layer around them: pathway status, role-limited documents, and audit that a governance team can inspect.\n\nCommon problems include duplicate entry, unclear pathway status, and access that is broader than the role. Technology responses are typically a coordination workspace, SSO, and integrations with the systems that remain the record of truth — not a replacement for clinical judgement.\n\nRelevant services include Custom Software, Cyber Security, Web Development, and UI/UX Design. If that matches a programme you are scoping, Start a Project for a written conversation. Content on this site is fictional and illustrative.",
    focus: [
      "Care coordination instead of shared inboxes",
      "Least-privilege access to documents",
      "Audit-ready operational reporting",
      "Integrations with systems of record",
    ],
    relatedServiceSlugs: [
      "custom-software",
      "cyber-security",
      "web-development",
      "ui-ux-design",
    ],
  },
  {
    slug: "education",
    title: "Education",
    seoTitle: "Education Industry — Learner and Administration Systems",
    seoDescription:
      "Fictional TechCore education industry page: enrolment, learning delivery, and progress reporting for schools, universities, and training groups.",
    summary:
      "Learner and administration systems for schools, universities, and training groups that have too many portals and not enough of a student view.",
    body: "Education providers typically ask for help when enrolment, content, and grades do not share an identity. Faculty duplicate attendance. Administrators rebuild term reports by hand. TechCore designs programme-shaped software: one login, a cohort home, and assessment workflows that match how marking actually happens.\n\nCommon problems are fragmented identity, LMS layouts that ignore programme structure, and reporting that exists only in spreadsheets. Technology solutions include a unified identity, learner dashboards, faculty workspaces, and exports operations can defend.\n\nRelevant services include Web Development, Mobile App Development, Custom Software, and UI/UX Design. Start a Project if you want a provider workspace rather than another portal. This page is fictional demonstration content.",
    focus: [
      "Enrolment and cohort administration",
      "Learning delivery with a single identity",
      "Assessment and feedback loops",
      "Progress reporting without double entry",
    ],
    relatedServiceSlugs: [
      "web-development",
      "mobile-app-development",
      "custom-software",
      "ui-ux-design",
    ],
  },
  {
    slug: "retail",
    title: "Retail",
    seoTitle: "Retail Industry — Commerce and Operations Software",
    seoDescription:
      "Fictional TechCore retail industry page: catalogue, checkout, and fulfilment software for brands that sell online and in person.",
    summary:
      "Commerce and operations software for brands that sell online and in person and have outgrown a starter storefront plus spreadsheets.",
    body: "Retail teams reach us when merchandising, stock, and customer service disagree with the live shop. Promotions are applied by memory. Fulfilment exceptions hide in email. TechCore treats catalogue and order operations as one product so the storefront is not a separate truth.\n\nCommon problems include inconsistent promotions, failed checkouts with opaque errors, and B2B pricing that cannot live in the same catalogue. Technology responses include merchandising tools, a clearer checkout, an order workspace, and connectors to warehouse or ERP systems.\n\nRelevant services include Web Development, Custom Software, AI & Machine Learning, and UI/UX Design. Request a Custom Quote — we do not publish package prices as live fees. All case names on this site are fictional.",
    focus: [
      "Catalogue and merchandising as one record",
      "Checkout journeys with honest errors",
      "Fulfilment and exception handling",
      "A path from D2C into account-based trade",
    ],
    relatedServiceSlugs: [
      "web-development",
      "custom-software",
      "ai-machine-learning",
      "ui-ux-design",
    ],
  },
  {
    slug: "finance",
    title: "Finance",
    seoTitle: "Finance Industry — Controlled Digital Products",
    seoDescription:
      "Fictional TechCore finance industry page: approvals, reporting, and evidence for firms that cannot trade accuracy for speed.",
    summary:
      "Controlled digital products for firms that cannot trade accuracy for speed — onboarding, approvals, and reporting with evidence attached.",
    body: "Finance organisations come to TechCore when approvals live in email and specialists reconstruct evidence after the fact. We design maker-checker flows, quieter interfaces, and logs that risk teams can inspect. We are a technology partner, not a regulated firm.\n\nCommon problems include re-keying between ledgers, opaque onboarding, and reports that cannot be reproduced. Technology solutions typically include workflow software, SSO, immutable activity history, and warehouse exports.\n\nRelevant services include Custom Software, Cyber Security, Cloud & DevOps, and IT Consulting. Start a Project for a scoped recommendation. Nothing on this page is a live client statistic.",
    focus: [
      "Approvals with maker-checker control",
      "Reporting that can be reproduced",
      "Evidence for internal risk review",
      "Integrations with authoritative ledgers",
    ],
    relatedServiceSlugs: [
      "custom-software",
      "cyber-security",
      "cloud-devops",
      "it-consulting",
    ],
  },
  {
    slug: "manufacturing",
    title: "Manufacturing",
    seoTitle: "Manufacturing Industry — Plant and Supply Systems",
    seoDescription:
      "Fictional TechCore manufacturing industry page: work orders, quality records, and supplier exchange between the floor and planning.",
    summary:
      "Plant and supply-side systems that connect the floor to planning and partners — work orders, quality records, and supplier exchange.",
    body: "Manufacturing teams typically ask for software when work orders, quality holds, and supplier updates live in disconnected tools. The floor knows status the office does not. TechCore builds operational systems around those records rather than a generic dashboard nobody trusts.\n\nCommon problems include paper quality packs, supplier emails as the integration, and planning that lags the line. Technology responses include work-order software, quality records with an audit trail, partner data exchange, and dashboards tied to events rather than overnight spreadsheets.\n\nRelevant services include Custom Software, Cloud & DevOps, AI & Machine Learning, and IT Consulting. Start a Project if you want a plant-shaped system, not a slogan. This industry page is fictional demonstration copy.",
    focus: [
      "Work orders the floor and office both see",
      "Quality records with an audit trail",
      "Supplier exchange without inbox glue",
      "Planning views fed by operational events",
    ],
    relatedServiceSlugs: [
      "custom-software",
      "cloud-devops",
      "ai-machine-learning",
      "it-consulting",
    ],
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    seoTitle: "Real Estate Industry — Listings, Transactions, Portals",
    seoDescription:
      "Fictional TechCore property industry page: inventory, enquiry, and document workflows for agencies and asset teams.",
    summary:
      "Inventory, enquiry, and document workflows for agencies and asset teams who currently run deals from email.",
    body: "Property businesses reach TechCore when listings, vendor documents, and enquiries do not share a record. Versions diverge. Serious buyers wait. We centralise the property record and the work around it, with permissions that match how agencies staff a deal.\n\nCommon problems include lost attachments, enquiry routing by memory, and owner updates that require a phone call. Technology solutions include listing inventory, enquiry workflows, document packs, and owner or vendor portals.\n\nRelevant services include Web Development, Custom Software, UI/UX Design, and Cloud & DevOps. Talk to us or Start a Project — this site is a fictional firm used to demonstrate delivery, not a live agency platform.",
    focus: [
      "Listings on a single property record",
      "Enquiry routing and viewing coordination",
      "Document packs with version discipline",
      "Owner and vendor portals",
    ],
    relatedServiceSlugs: [
      "web-development",
      "custom-software",
      "ui-ux-design",
      "cloud-devops",
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    seoTitle: "Logistics Industry — Visibility, Dispatch, Exceptions",
    seoDescription:
      "Fictional TechCore logistics industry page: status, exceptions, and partner data for companies that move goods.",
    summary:
      "Status, exceptions, and partner data for companies that move goods — so delay is visible before the first customer call.",
    body: "Logistics operators come to TechCore when telematics, warehouse systems, and customer email each hold a different picture. Dispatchers work three screens and a whiteboard. We assemble an exception-first operations view from events you already produce.\n\nCommon problems include late visibility of delay, partner status in unmatched formats, and customers who can only chase by phone. Technology solutions include event ingestion, a ranked exception queue, partner intake, and a limited customer tracking view.\n\nRelevant services include Custom Software, Mobile App Development, Cloud & DevOps, and AI & Machine Learning. Start a Project to scope a dispatcher workspace. Case studies named on this site are fictional.",
    focus: [
      "Visibility across fleet and warehouse events",
      "Dispatch on exceptions, not only maps",
      "Partner data exchange",
      "Customer updates without exposing internal notes",
    ],
    relatedServiceSlugs: [
      "custom-software",
      "mobile-app-development",
      "cloud-devops",
      "ai-machine-learning",
    ],
  },
  {
    slug: "startups",
    title: "Startups",
    seoTitle: "Startups — Product Engineering Without Theatre",
    seoDescription:
      "Fictional TechCore startups industry page: a serious first platform, architecture that can grow, and founder-ready reporting.",
    summary:
      "Product engineering for teams that need a serious first platform without theatre — an MVP with production standards.",
    body: "Early-stage product companies work with TechCore when they need a first release that can be operated, not a prototype that collapses under the first ten users. We help choose the smallest architecture that can grow, and we write down what was deferred.\n\nCommon problems include rebuilding after a no-code spike, unclear ownership of auth and data, and a stack hired for a demo rather than a product. Technology responses include a production-shaped MVP, documented APIs, sensible cloud setup, and reporting a founder can show without inventing metrics.\n\nRelevant services include Web Development, Mobile App Development, IT Consulting, and Cloud & DevOps. Start a Project for a scoped first platform. TechCore itself is a fictional firm; this page does not describe live venture clients.",
    focus: [
      "MVP with production standards",
      "Architecture that can grow without a rewrite",
      "Founder-ready operational reporting",
      "Handover your next hire can continue",
    ],
    relatedServiceSlugs: [
      "web-development",
      "mobile-app-development",
      "it-consulting",
      "cloud-devops",
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((item) => item.slug === slug);
}
