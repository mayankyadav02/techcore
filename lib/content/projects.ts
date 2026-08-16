export type ProjectKind =
  | "Demo Project"
  | "Concept Project"
  | "Fictional Case Study";

export type ProjectTimelinePhase = {
  label: string;
  window: string;
  detail: string;
};

export type Project = {
  slug: string;
  title: string;
  sector: string;
  summary: string;
  overview: string;
  challenge: string;
  solution: string;
  approach?: string;
  features: string[];
  technology: string[];
  results: string[];
  metrics?: { label: string; value: string }[];
  mockups?: string[];
  mockupLayout?: "browser" | "device" | "split";
  kind?: ProjectKind;
  pitch?: string;
  timeline?: ProjectTimelinePhase[];
  industrySlug?: string;
  solutionSlug?: string;
  serviceSlugs?: string[];
  seoTitle?: string;
  seoDescription?: string;
};

const typicalTimelineNote =
  "Typical engagement shape for a programme like this. Illustrative only — not a real client schedule.";

export const projects: Project[] = [
  {
    slug: "shopflow",
    title: "ShopFlow",
    kind: "Demo Project",
    mockupLayout: "browser",
    sector: "Retail operations",
    industrySlug: "retail",
    solutionSlug: "e-commerce",
    serviceSlugs: ["web-development", "custom-software", "ui-ux-design"],
    seoTitle: "ShopFlow — Fictional Retail Operations Case",
    seoDescription:
      "Fictional TechCore case: a merchandising and order-operations workspace for a multi-brand retailer. Demo outcomes only.",
    pitch:
      "Inventory, catalogue, promotions, and order operations on one merchandising surface.",
    summary:
      "A merchandising and order-operations workspace for a multi-brand retailer — fictional programme, not a live client brand.",
    overview:
      "ShopFlow is a fictional programme showing how TechCore would replace a patchwork of storefront plugins and spreadsheets with one operations surface. It covers inventory position, catalogue merchandising, promotion preview, and a customer-service order timeline. These screens are demonstration artefacts, not production captures from a named retailer.",
    challenge:
      "Buying, warehouse, and customer-service teams each had a different view of stock and orders. Promotions were applied inconsistently, and exception handling depended on a few experienced staff. Inventory counts lagged the storefront, so oversell and surprise stock-outs were routine.",
    approach:
      "Start with a shared catalogue and inventory record, then give buying, warehouse, and customer-service role-specific workspaces on that record. Prove promotion preview and exception queues before widening checkout integrations. The storefront consumes the same source of truth rather than maintaining a parallel catalogue.",
    solution:
      "We designed a single catalogue and order record, with role-specific workspaces and a promotion engine operations could reason about. The storefront consumed the same source of truth. Fulfilment exceptions landed in a queue instead of a shared inbox.",
    features: [
      "Shared catalogue and inventory position",
      "Promotion rules with preview before publish",
      "Exception queue for failed fulfilments",
      "Customer-service order timeline",
    ],
    technology: ["Next.js", "TypeScript", "PostgreSQL", "Search", "Payment APIs"],
    results: [
      "Demo outcome: streamlined inventory workflow across buying and warehouse views.",
      "Demo outcome: promotion preview before publish, reducing inconsistent offers.",
      "Demo outcome: a single order timeline for customer-service follow-up.",
      "These are scenario outcomes for a fictional programme — not results from a named client.",
    ],
    metrics: [
      { label: "Demo outcome", value: "Shared catalogue truth" },
      { label: "Programme type", value: "Fictional retail ops" },
    ],
    mockups: [
      "Catalogue and inventory workspace",
      "Promotion preview before publish",
      "Customer-service order timeline",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–2",
        detail: `Map buying, warehouse, and CS journeys against the live catalogue. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 3–5",
        detail: "Role workspaces, promotion preview, and the inventory record operators will trust.",
      },
      {
        label: "Build",
        window: "Weeks 6–12",
        detail: "Catalogue, stock position, order timeline, and storefront consumption of the same records.",
      },
      {
        label: "Launch",
        window: "Weeks 13–14",
        detail: "Staging, operator training, and a documented handover. Not a live retailer go-live date.",
      },
    ],
  },
  {
    slug: "careplus",
    title: "CarePlus",
    kind: "Concept Project",
    mockupLayout: "browser",
    sector: "Healthcare operations",
    industrySlug: "healthcare",
    solutionSlug: "healthcare",
    serviceSlugs: ["custom-software", "cyber-security", "ui-ux-design"],
    seoTitle: "CarePlus — Fictional Healthcare Coordination Case",
    seoDescription:
      "Fictional TechCore case: outpatient pathway coordination with least-privilege document access. Demo outcomes only.",
    pitch:
      "Appointment booking, patient pathways, and administrative documents with least-privilege access.",
    summary:
      "A coordination platform for outpatient pathways and administrative staff. Fictional reference case — not a live health provider.",
    overview:
      "CarePlus is a reference case for privacy-aware workflow software. It is fictional and used to show how TechCore structures clinical-adjacent operations tools: appointment booking, pathway boards with SLA cues, a role-limited document drawer, and an exportable activity history. TechCore does not operate clinical services.",
    challenge:
      "Pathway coordinators tracked referrals in shared inboxes. Appointment status was unclear, and access to documents was broader than the role required. Staff reconstructed a patient’s administrative journey by searching mail threads.",
    approach:
      "Model the pathway as a first-class record — appointments, tasks, and documents — then apply least-privilege access and an audit trail a governance team can inspect. Keep clinical systems of record where they belong; this product is the coordination layer around them.",
    solution:
      "We modelled the pathway as a first-class record with tasks, documents, and least-privilege access. Status became visible without opening every file. Appointment slots and SLA cues sat on the same board coordinators already used for referrals.",
    features: [
      "Pathway board with SLA cues",
      "Appointment and clinic-session views",
      "Role-limited document access",
      "Exportable activity history",
    ],
    technology: ["Next.js", "SSO", "Encrypted object storage", "Audit log"],
    results: [
      "Demo outcome: pathway status visible without opening every file.",
      "Demo outcome: narrower document access by role.",
      "Demo outcome: activity history suitable for an access review.",
      "Not a claim about a real health provider.",
    ],
    metrics: [
      { label: "Demo outcome", value: "Visible pathway status" },
      { label: "Programme type", value: "Fictional care ops" },
    ],
    mockups: [
      "Pathway and appointment board",
      "Role-limited document drawer",
      "Activity history for access review",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–3",
        detail: `Roles, systems of record, and the exceptions coordinators already handle. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 4–6",
        detail: "Pathway model, appointment states, and access rules written before build.",
      },
      {
        label: "Build",
        window: "Weeks 7–13",
        detail: "Board, document drawer, SSO, and an audit export — not a clinical records replacement.",
      },
      {
        label: "Launch",
        window: "Weeks 14–15",
        detail: "Training, access review, and handover. Illustrative sequence only.",
      },
    ],
  },
  {
    slug: "fleetpro",
    title: "FleetPro",
    kind: "Demo Project",
    mockupLayout: "split",
    sector: "Logistics",
    industrySlug: "logistics",
    solutionSlug: "logistics",
    serviceSlugs: ["custom-software", "cloud-devops", "mobile-app-development"],
    seoTitle: "FleetPro — Fictional Logistics Operations Case",
    seoDescription:
      "Fictional TechCore case: exception-first dispatch from existing telematics and warehouse events. Demo outcomes only.",
    pitch:
      "Exception-first dispatch, shipment timelines, and limited customer tracking from existing telematics.",
    summary:
      "An exception-first operations view for a regional distribution network. Fictional — not a live fleet contract.",
    overview:
      "FleetPro demonstrates how TechCore would assemble existing telematics and warehouse events into a dispatcher workspace. Mockup refs: a ranked exception queue, a shipment timeline, a map-led operations view, and a limited customer tracking page that omits internal notes.",
    challenge:
      "Delay was visible only after a customer called. Dispatchers switched between three vendor tools and a whiteboard. Partner status arrived as emails that never joined the shipment record.",
    approach:
      "Ingest status events into one timeline, rank exceptions before they become customer calls, and expose a tracking view that cannot leak dispatcher notes. Keep vendor telematics as sensors; the product is the operations layer on top.",
    solution:
      "We ingested status events into one timeline, ranked exceptions, and gave customers a limited tracking view that did not expose internal notes. Dispatchers worked a single queue instead of three vendor screens.",
    features: [
      "Live exception queue",
      "Shipment timeline",
      "Partner status intake",
      "Customer tracking link",
    ],
    technology: ["Node.js", "Event bus", "Maps APIs", "Time-indexed queries"],
    results: [
      "Demo outcome: exceptions surfaced before the first customer call.",
      "Demo outcome: one primary queue instead of three vendor screens.",
      "Demo outcome: customer tracking without exposing dispatcher notes.",
      "Scenario only — not a live fleet contract.",
    ],
    metrics: [
      { label: "Demo outcome", value: "Exception-first dispatch" },
      { label: "Programme type", value: "Fictional logistics" },
    ],
    mockups: [
      "Dispatcher exception queue",
      "Shipment timeline and map view",
      "Limited customer tracking",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–2",
        detail: `Event sources, exception types, and what customers are allowed to see. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 3–4",
        detail: "Queue ranking, timeline model, and the customer tracking boundary.",
      },
      {
        label: "Build",
        window: "Weeks 5–11",
        detail: "Ingestion, dispatcher workspace, mobile status, and a public tracking page.",
      },
      {
        label: "Launch",
        window: "Weeks 12–13",
        detail: "Shadow-run against historic events, then handover. Not a live fleet cutover date.",
      },
    ],
  },
  {
    slug: "learnhub",
    title: "LearnHub",
    kind: "Fictional Case Study",
    mockupLayout: "browser",
    sector: "Education",
    industrySlug: "education",
    solutionSlug: "education",
    serviceSlugs: ["web-development", "custom-software", "ui-ux-design"],
    seoTitle: "LearnHub — Fictional Education Product Case",
    seoDescription:
      "Fictional TechCore case: a learner and faculty workspace with one identity. Demo outcomes only. Not affiliated with a real institution.",
    pitch:
      "A learning platform with one identity for enrolment, content, assessment, and faculty marking.",
    summary:
      "A learner and faculty workspace for a professional education provider. Fictional product — not affiliated with a real institution.",
    overview:
      "LearnHub is a fictional education product used to show how TechCore unifies enrolment, content access, and assessment without a maze of portals. Mockup refs: a programme home for a cohort, a faculty marking workspace, and an administrator progress export.",
    challenge:
      "Learners had one login for content and another for grades. Faculty duplicated attendance in a spreadsheet because the LMS did not match the programme structure. Administrators rebuilt term reports by hand.",
    approach:
      "Introduce a single identity, a programme-shaped home, and assessment workflows that match how faculty actually mark work. Treat progress reporting as a first-class extract from the same records — not a side spreadsheet.",
    solution:
      "We introduced a single identity, a programme-shaped home, and assessment workflows that matched how faculty actually mark work. Administrators exported term progress from the same records learners already used.",
    features: [
      "Programme home for each cohort",
      "Assignment and feedback loop",
      "Faculty marking workspace",
      "Progress exports for administrators",
    ],
    technology: [
      "Next.js",
      "LMS connectors",
      "Role-based access",
      "Reporting extracts",
    ],
    results: [
      "Demo outcome: one learner login across content and grades.",
      "Demo outcome: faculty marking without double entry.",
      "Demo outcome: term progress export from the same records.",
      "Not affiliated with a real institution.",
    ],
    metrics: [
      { label: "Demo outcome", value: "Single learner identity" },
      { label: "Programme type", value: "Fictional education" },
    ],
    mockups: [
      "Cohort programme home",
      "Faculty marking workspace",
      "Administrator progress export",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–2",
        detail: `Programme structure, identity sources, and how marking actually happens. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 3–5",
        detail: "Cohort home, assignment loop, and role boundaries for faculty and administrators.",
      },
      {
        label: "Build",
        window: "Weeks 6–12",
        detail: "Identity, content access, marking workspace, and progress extracts.",
      },
      {
        label: "Launch",
        window: "Weeks 13–14",
        detail: "Faculty rehearsal, learner staging, handover. Not a real institution calendar.",
      },
    ],
  },
  {
    slug: "estatepro",
    title: "EstatePro",
    kind: "Concept Project",
    mockupLayout: "browser",
    sector: "Real estate",
    industrySlug: "real-estate",
    solutionSlug: "real-estate",
    serviceSlugs: ["web-development", "custom-software", "ui-ux-design"],
    seoTitle: "EstatePro — Fictional Property Operations Case",
    seoDescription:
      "Fictional TechCore case: listings, enquiries, and document packs on one property record. Demo outcomes only.",
    pitch:
      "Listings, enquiries, viewings, and versioned document packs on a single property record.",
    summary:
      "A listing, enquiry, and document workspace for a regional agency group. Fictional programme — not a live agency platform.",
    overview:
      "EstatePro shows how TechCore would replace email-as-CRM with a single property record. Mockup refs: an inventory board, an enquiry inbox with routing rules, and a versioned document pack for vendors and owners.",
    challenge:
      "Listings, viewing notes, and vendor contracts lived in shared drives and personal inboxes. Serious enquiries waited while staff searched for the current brochure. Owners could not see a trustworthy status without a phone call.",
    approach:
      "Treat the property as the system of record. Route enquiries by listing and geography, attach document packs with explicit versions and permissions, and give owners a portal that does not expose internal negotiation notes.",
    solution:
      "We modelled the property as the system of record, routed enquiries by listing and geography, and attached document packs with explicit versions and permissions. Viewing notes sat on the listing instead of in a personal inbox.",
    features: [
      "Listing inventory with status",
      "Enquiry routing and viewing notes",
      "Versioned document packs",
      "Owner and vendor portal access",
    ],
    technology: ["Next.js", "Search", "Document storage", "CRM integrations"],
    results: [
      "Demo outcome: a single property record for listings and documents.",
      "Demo outcome: enquiry routing without a shared inbox.",
      "Demo outcome: fewer conflicting brochure versions.",
      "Fictional agency scenario — not a named client result.",
    ],
    metrics: [
      { label: "Demo outcome", value: "One property record" },
      { label: "Programme type", value: "Fictional real estate" },
    ],
    mockups: [
      "Listing inventory board",
      "Enquiry inbox with routing",
      "Versioned document pack",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–2",
        detail: `Listing states, enquiry sources, and who may see vendor documents. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 3–5",
        detail: "Property record, routing rules, and portal permissions.",
      },
      {
        label: "Build",
        window: "Weeks 6–12",
        detail: "Inventory, enquiry workspace, document versions, and owner access.",
      },
      {
        label: "Launch",
        window: "Weeks 13–14",
        detail: "Staff rehearsal and handover. Not a live agency migration date.",
      },
    ],
  },
  {
    slug: "finserve",
    title: "FinServe",
    kind: "Fictional Case Study",
    mockupLayout: "browser",
    sector: "Finance operations",
    industrySlug: "finance",
    solutionSlug: "finance",
    serviceSlugs: ["custom-software", "cyber-security", "cloud-devops"],
    seoTitle: "FinServe — Fictional Finance Workflow Case",
    seoDescription:
      "Fictional TechCore case: maker-checker onboarding and approvals with inspectable evidence. Demo outcomes only.",
    pitch:
      "A customer portal for onboarding, maker-checker approvals, and evidence a risk team can inspect.",
    summary:
      "A controlled onboarding and approvals workspace for a mid-size finance operations team. Fictional — not a regulated product or live client.",
    overview:
      "FinServe is a fictional operations product: a customer portal, maker-checker flows, evidence attached to each decision, and exports a risk team can inspect. Mockup refs: an onboarding queue, an approval timeline, and an activity log view. TechCore is not a financial institution.",
    challenge:
      "Onboarding and payment approvals moved through email. Specialists reconstructed evidence after the fact. Cycle time and control pulled in opposite directions. Customers could not see where a request sat without calling operations.",
    approach:
      "Design quiet queues with explicit states, dual control on sensitive actions, and an immutable activity log. Integrate with the ledgers that remain authoritative. The portal shows status without exposing maker-checker commentary.",
    solution:
      "We designed quiet queues with explicit states, dual control on sensitive actions, and an immutable activity log integrated with the ledgers that remained authoritative. Customers received a portal status view without internal notes.",
    features: [
      "Customer portal with request status",
      "Onboarding queue with KYC-ready document checks",
      "Maker-checker approvals",
      "Immutable activity history",
    ],
    technology: ["TypeScript", "Event logs", "SSO", "Warehouse exports"],
    results: [
      "Demo outcome: approvals with evidence attached to the record.",
      "Demo outcome: dual control on sensitive actions.",
      "Demo outcome: exports a risk reviewer can reproduce.",
      "Scenario only — not a live finance contract or performance claim.",
    ],
    metrics: [
      { label: "Demo outcome", value: "Maker-checker control" },
      { label: "Programme type", value: "Fictional finance ops" },
    ],
    mockups: [
      "Customer portal status",
      "Onboarding and approval queue",
      "Inspectable activity log",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–3",
        detail: `Control points, evidence types, and portal boundaries. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 4–6",
        detail: "Queue states, maker-checker, and the customer-visible status model.",
      },
      {
        label: "Build",
        window: "Weeks 7–14",
        detail: "Portal, queues, SSO, activity log, and warehouse exports.",
      },
      {
        label: "Launch",
        window: "Weeks 15–16",
        detail: "Control rehearsal and handover. Not a regulated go-live or live KPI.",
      },
    ],
  },
  {
    slug: "gymcore",
    title: "GymCore",
    kind: "Demo Project",
    mockupLayout: "device",
    sector: "Consumer operations",
    industrySlug: "startups",
    solutionSlug: "e-commerce",
    serviceSlugs: [
      "mobile-app-development",
      "web-development",
      "custom-software",
    ],
    seoTitle: "GymCore — Fictional Membership and Booking Case",
    seoDescription:
      "Fictional TechCore case: membership, class booking, and staff operations for a multi-site fitness group. Demo outcomes only.",
    pitch:
      "Membership, class booking, and staff check-in on one access record — web desk and member app.",
    summary:
      "Membership, class booking, and staff operations for a multi-site fitness group. Fictional product — not a live gym brand.",
    overview:
      "GymCore illustrates a consumer operations build: member apps, a staff desk, and billing states that match the floor. Mockup refs: a class booking grid, a staff check-in desk, and a membership status view. Demo artefacts only.",
    challenge:
      "Bookings, access, and membership status lived in three tools. Front-of-house staff could not see whether a member was in good standing without a phone call to billing. Members booked classes in one app and managed passes in another.",
    approach:
      "Build a shared membership record, class booking with capacity rules, and a staff workspace that shows access state without exposing full payment detail. The member app reads the same record as the desk.",
    solution:
      "We built a shared membership record, class booking with capacity rules, and a staff workspace that showed access state without exposing full payment detail. Passes and the weekly schedule lived in one member app.",
    features: [
      "Membership record and access state",
      "Class booking with capacity",
      "Staff check-in workspace",
      "Member app for schedule and passes",
    ],
    technology: ["Flutter", "Next.js", "Node.js", "MongoDB", "Push notifications"],
    results: [
      "Demo outcome: streamlined class booking and check-in on one membership record.",
      "Demo outcome: staff see access state without a billing call.",
      "Demo outcome: member schedule in a single app.",
      "Fictional fitness group — not a named operator.",
    ],
    metrics: [
      { label: "Demo outcome", value: "Unified membership record" },
      { label: "Programme type", value: "Fictional consumer ops" },
    ],
    mockups: [
      "Member app class booking",
      "Staff check-in desk",
      "Membership access state",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–2",
        detail: `Membership states, class types, and what the desk may see. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 3–5",
        detail: "Access record, booking grid, and the staff vs member information boundary.",
      },
      {
        label: "Build",
        window: "Weeks 6–12",
        detail: "Desk web app, member mobile app, capacity rules, and notifications.",
      },
      {
        label: "Launch",
        window: "Weeks 13–14",
        detail: "Site rehearsal and handover. Not a live gym brand launch.",
      },
    ],
  },
  {
    slug: "foodhub",
    title: "FoodHub",
    kind: "Concept Project",
    mockupLayout: "split",
    sector: "Hospitality operations",
    industrySlug: "retail",
    solutionSlug: "e-commerce",
    serviceSlugs: ["custom-software", "mobile-app-development", "cloud-devops"],
    seoTitle: "FoodHub — Fictional Kitchen and Order Case",
    seoDescription:
      "Fictional TechCore case: kitchen display, order intake, and inventory for a multi-location food group. Demo outcomes only.",
    pitch:
      "Restaurant ordering, kitchen display, and location inventory on one ticket pipeline.",
    summary:
      "Kitchen display, order intake, and inventory for a multi-location food group. Fictional programme — not a live restaurant brand.",
    overview:
      "FoodHub is a fictional hospitality operations case: one order pipeline from counter and delivery apps into the kitchen, with inventory that kitchen leads can trust. Mockup refs: kitchen display tickets, location inventory, and a manager exception queue.",
    challenge:
      "Delivery apps, the counter till, and the kitchen printer each told a different story. Stock-outs were discovered mid-service. Managers reconciled orders the next morning. Guests saw menu items that the kitchen had already 86'd.",
    approach:
      "Introduce a single order ticket into the kitchen, location-level inventory with simple deductions, and an exception queue for missing items and delayed delivery handoffs. Guest ordering and the kitchen display share the same ticket.",
    solution:
      "We introduced a single order ticket into the kitchen, location-level inventory with simple deductions, and an exception queue for missing items and delayed delivery handoffs. Managers reviewed an end-of-day timeline instead of rebuilding the service from printer rolls.",
    features: [
      "Unified order ticket to the kitchen",
      "Location inventory with service deductions",
      "Exception queue for 86'd items and delays",
      "Manager end-of-day order timeline",
    ],
    technology: ["Node.js", "React Native", "MongoDB", "Realtime events", "Docker"],
    results: [
      "Demo outcome: streamlined kitchen ticket workflow from counter and delivery.",
      "Demo outcome: inventory visible before mid-service stock-outs.",
      "Demo outcome: a manager timeline instead of morning reconciliation.",
      "Fictional food group — not a live hospitality client.",
    ],
    metrics: [
      { label: "Demo outcome", value: "One kitchen ticket pipeline" },
      { label: "Programme type", value: "Fictional hospitality" },
    ],
    mockups: [
      "Guest ordering and kitchen tickets",
      "Location inventory board",
      "Manager exception queue",
    ],
    timeline: [
      {
        label: "Discover",
        window: "Weeks 1–2",
        detail: `Order sources, 86 workflow, and location inventory habits. ${typicalTimelineNote}`,
      },
      {
        label: "Design",
        window: "Weeks 3–4",
        detail: "Ticket model, kitchen display, and the manager exception queue.",
      },
      {
        label: "Build",
        window: "Weeks 5–11",
        detail: "Ordering surfaces, KDS, inventory deductions, and realtime events.",
      },
      {
        label: "Launch",
        window: "Weeks 12–13",
        detail: "Service rehearsal and handover. Not a live restaurant cutover.",
      },
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}

export function relatedProjectList<T extends { slug: string; sector: string; serviceSlugs?: string[] }>(
  items: T[],
  slug: string,
  limit = 3,
) {
  const current = items.find((item) => item.slug === slug);
  const rest = items.filter((item) => item.slug !== slug);
  if (!current) return rest.slice(0, limit);
  const currentServices = new Set(current.serviceSlugs ?? []);
  return rest
    .sort((a, b) => {
      const sectorScore = Number(b.sector === current.sector) - Number(a.sector === current.sector);
      if (sectorScore !== 0) return sectorScore;
      const shared = (item: T) =>
        (item.serviceSlugs ?? []).filter((service) => currentServices.has(service)).length;
      return shared(b) - shared(a);
    })
    .slice(0, limit);
}
