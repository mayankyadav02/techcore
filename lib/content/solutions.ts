export type Solution = {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  approach: string;
  implementation?: string;
  features: string[];
  technology: string[];
  benefits: string[];
  seoTitle?: string;
  seoDescription?: string;
};

export const solutions: Solution[] = [
  {
    slug: "healthcare",
    title: "Healthcare",
    seoTitle: "Healthcare Software Solutions",
    seoDescription:
      "Fictional TechCore healthcare solution: care coordination, access control, and operational platforms that respect privacy and audit.",
    summary:
      "Clinical-adjacent and operational platforms that respect privacy, workflow, and audit — not a claim to practise medicine.",
    problem:
      "Healthcare organisations often run scheduling, records, billing, and referral tracking as disconnected tools. Staff compensate with paper, shared inboxes, and workarounds. Status is unclear, access is broader than the role requires, and coordination slows when a pathway crosses teams.",
    approach:
      "We design around administrative and care-coordination journeys first, then integrate with the systems that must remain the record of truth. Access, consent, and audit are designed in. The product is an operations surface: pathways, tasks, documents, and a status view that does not require opening every file.",
    implementation:
      "Discovery maps roles, systems of record, and the exceptions coordinators already handle. We ship a narrow first release — typically a pathway board and document access — then add integrations. Training and an audit export are part of handover. Start a Project if you want a written recommendation for a fictional-style programme scoped to your constraints.",
    features: [
      "Role-based clinical-adjacent and admin workspaces",
      "Appointment and pathway coordination",
      "Document and results handling with least privilege",
      "Audit-ready activity history",
      "Task assignment, notes, and SLA cues",
    ],
    technology: [
      "Next.js",
      "HL7/FHIR-aware integrations",
      "Encrypted storage patterns",
      "SSO",
    ],
    benefits: [
      "Fewer duplicate data entries between teams",
      "Clearer accountability on who accessed what",
      "A platform that can take on new pathways without a new inbox",
    ],
  },
  {
    slug: "education",
    title: "Education",
    seoTitle: "Education Technology Solutions",
    seoDescription:
      "Fictional TechCore education solution: enrolment, learning delivery, assessment, and a single learner view for institutions and providers.",
    summary:
      "Learning, administration, and reporting systems for institutions and training providers that have outgrown a maze of portals.",
    problem:
      "Institutions accumulate separate tools for enrolment, content, attendance, and assessment. Faculty and administrators spend time reconciling records. Learners hold more than one login. Term-end reporting becomes a manual extract from systems that never shared a student view.",
    approach:
      "We unify the journeys that matter — enrolment, learning delivery, and progress — behind a coherent identity and a modest set of well-owned modules. Programme structure drives the home screen, not a generic LMS layout. Assessment workflows are designed around how faculty actually mark work.",
    implementation:
      "We inventory current portals and the records that must remain authoritative. A first release usually covers identity, a programme home, and one assessment loop. Connectors follow. Administrators get exports they can defend. Use Start a Project to scope a provider-shaped workspace rather than another portal.",
    features: [
      "Programme and cohort administration",
      "Learner dashboards with a single identity",
      "Assignment, feedback, and marking workspaces",
      "Parent or partner access where the model requires it",
      "Progress exports for academic operations",
    ],
    technology: [
      "Next.js",
      "LMS integrations",
      "Role-based access",
      "Analytics events",
    ],
    benefits: [
      "One identity across learning tools",
      "Less manual reporting at term end",
      "Room to add programmes without a new portal",
    ],
  },
  {
    slug: "e-commerce",
    title: "E-Commerce",
    seoTitle: "E-Commerce and Digital Retail Solutions",
    seoDescription:
      "Fictional TechCore e-commerce solution: catalogue, checkout, merchandising, and order operations on one product — not a plugin pile.",
    summary:
      "Catalogue, checkout, and operations software for digital retail teams that have outgrown a starter storefront.",
    problem:
      "Retail teams outgrow a starter shop: merchandising, fulfilment, B2B pricing, and customer service start to live in spreadsheets beside the storefront. Promotions apply inconsistently. Stock and order status disagree depending on which tool you open.",
    approach:
      "We treat storefront and operations as one product. Catalogue rules, checkout, and warehouse or partner flows are designed together so growth does not mean another bolt-on. The storefront consumes the same catalogue and order record that operations use.",
    implementation:
      "We map merchandising, checkout failure modes, and fulfilment exceptions before choosing a commerce engine or a custom module. A first release typically covers catalogue truth, checkout error states, and an order workspace. Payments and ERP connectors follow the contract. Request a Custom Quote for a programme shaped around your catalogue — not a catalogue price.",
    features: [
      "Catalogue and merchandising tools",
      "Checkout with clear error states",
      "Order operations workspace",
      "B2B pricing and account logic",
      "Promotion rules with preview before publish",
    ],
    technology: [
      "Next.js",
      "Payment provider APIs",
      "Search",
      "ERP connectors",
    ],
    benefits: [
      "Fewer failed checkouts from unclear errors",
      "Operations that match the live catalogue",
      "A path from direct-to-consumer into account-based trade",
    ],
  },
  {
    slug: "finance",
    title: "Finance",
    seoTitle: "Finance Operations Software Solutions",
    seoDescription:
      "Fictional TechCore finance solution: onboarding, approvals, reporting, and evidence — speed without losing control.",
    summary:
      "Controlled digital products for onboarding, approvals, reporting, and internal operations where accuracy cannot be traded for speed.",
    problem:
      "Finance teams need speed without losing control. Manual reconciliations, opaque approvals, and re-keying between systems create delay and audit findings. Specialists spend time reconstructing evidence instead of completing the work.",
    approach:
      "We design for maker-checker flows, evidence, and integrations with the ledgers that remain authoritative. The interface stays quiet so specialists can work accurately. Activity is logged in a form risk teams can inspect.",
    implementation:
      "Workshops name the approvals, systems of record, and the reports that currently live in email. The first release is usually a controlled workflow plus an immutable activity log. Warehouse exports and SSO follow. Start a Project for a written scope — this site does not publish live client results.",
    features: [
      "Onboarding and KYC-ready journeys",
      "Maker-checker approval workflows",
      "Operational reporting",
      "Immutable activity logs",
      "Exports aligned to internal risk review",
    ],
    technology: ["TypeScript", "Event logs", "SSO", "Warehouse exports"],
    benefits: [
      "Shorter cycle times with retained control",
      "Evidence that risk teams can inspect",
      "Less re-keying between systems",
    ],
  },
  {
    slug: "real-estate",
    title: "Real Estate",
    seoTitle: "Real Estate Listing and Transaction Solutions",
    seoDescription:
      "Fictional TechCore property solution: listings, enquiries, document packs, and owner or vendor portals on a single property record.",
    summary:
      "Listing, transaction, and asset operations for agencies and property teams tired of email as the system of record.",
    problem:
      "Agencies and asset managers juggle listings, documents, and vendor communication across email and disconnected CRMs. Versions diverge. Serious enquiries wait because nobody owns the property record end to end.",
    approach:
      "We centralise the property record and the work around it — enquiries, viewings, documents — with permissions that match how agencies actually staff deals. Search and inventory stay honest because they share one source.",
    implementation:
      "We map listing lifecycle, enquiry routing, and document packs with the people who close deals. A first release is typically inventory plus enquiry routing. Portals and CRM connectors come next. Talk to us if you want a property workspace rather than another brochure site.",
    features: [
      "Listing and inventory management",
      "Enquiry routing and viewing coordination",
      "Document packs with version discipline",
      "Owner and vendor portals",
      "Search over a single property record",
    ],
    technology: ["Next.js", "Search", "Document storage", "CRM integrations"],
    benefits: [
      "A single property record",
      "Faster response to serious enquiries",
      "Fewer lost attachments and conflicting versions",
    ],
  },
  {
    slug: "logistics",
    title: "Logistics",
    seoTitle: "Logistics Visibility and Operations Solutions",
    seoDescription:
      "Fictional TechCore logistics solution: fleet and shipment status, exception queues, partner exchange, and customer tracking.",
    summary:
      "Visibility and control for fleet, warehouse, and partner networks — exception-first, not another dashboard nobody opens.",
    problem:
      "Movement data lives in vehicle devices, warehouse tools, and customer emails. Delay is visible only after a customer calls. Dispatchers switch between vendor screens and a whiteboard. Partners send status in formats nobody agreed.",
    approach:
      "We build an operations picture from the events you already have, then add the exception workflows dispatchers and customers actually need. Internal notes stay internal. Customer tracking is a limited view of the same timeline.",
    implementation:
      "We inventory telematics, warehouse, and partner feeds before designing UI. The first release is usually an exception queue and a shipment timeline. Partner intake and a customer link follow. Start a Project to scope a dispatcher workspace around your existing events.",
    features: [
      "Shipment and fleet status views",
      "Ranked exception queues",
      "Partner data exchange",
      "Customer tracking where appropriate",
      "A single timeline instead of three vendor screens",
    ],
    technology: [
      "Event ingestion",
      "Maps APIs",
      "Node.js",
      "Time-series friendly stores",
    ],
    benefits: [
      "Earlier visibility of delay",
      "Less status chasing by phone",
      "A foundation for customer self-serve",
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((item) => item.slug === slug);
}
