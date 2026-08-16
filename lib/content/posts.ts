export const blogCategories = [
  "Web Development",
  "AI",
  "Cloud",
  "Cyber Security",
  "Technology",
  "Business",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  body: string[];
  tags?: string[];
  authorName?: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
};

export const posts: Post[] = [
  {
    slug: "why-businesses-need-a-professional-website",
    title: "Why businesses need a professional website",
    excerpt:
      "A credible site is not decoration. It is how buyers check whether you are real, how you capture demand, and how you explain the offer without a sales call.",
    category: "Web Development",
    date: "10 August 2026",
    publishedAt: "2026-08-10",
    readTime: "6 min",
    authorName: "Priya Nair",
    tags: ["Web Development", "Business", "SEO"],
    seoTitle: "Why businesses need a professional website",
    seoDescription:
      "What a professional website is for: credibility, capture, and a clear offer. Fictional TechCore practice note — not a ranking guarantee.",
    body: [
      "Buyers still look you up. If the site is slow, unclear, or last updated in another decade, they do not wait for a brochure. They compare you with whoever explained the offer in one screen.",
      "A professional website is not a pile of keywords. It is a structure: who it is for, what you do, how to start, and enough proof that a serious person can proceed. Performance and crawlable HTML are part of that structure.",
      "Teams delay a rebuild because the current site 'works'. It often works for staff who already know the phone number. It does not work for the next customer.",
      "Start with the journeys that create revenue or trust: the offer, the contact path, and the pages a sales conversation actually references. Then make those pages fast and maintainable.",
      "TechCore treats marketing sites and product surfaces as one engineering standard. This article is practice commentary from a fictional firm, not a promise about search rankings.",
    ],
  },
  {
    slug: "benefits-of-custom-software-development",
    title: "Benefits of custom software development",
    excerpt:
      "Buy when the product fits. Build when the workarounds are the real system. Here is how we tell the difference.",
    category: "Business",
    date: "28 July 2026",
    publishedAt: "2026-07-28",
    readTime: "7 min",
    authorName: "James Okonkwo",
    tags: ["Custom Software", "Business", "Architecture"],
    seoTitle: "Benefits of custom software development",
    seoDescription:
      "When custom software pays for itself: fit to operations, fewer workarounds, and a path to iterate. Fictional TechCore note.",
    body: [
      "Off-the-shelf software is the right answer when your process is the one the vendor designed for. It becomes expensive when the real system is a set of spreadsheets around the product you already pay for.",
      "Custom software earns its keep when the operating model is the advantage: inventory rules, booking exceptions, approvals, or a dashboard operators will actually open. The benefit is not uniqueness for its own sake. It is software that matches the work.",
      "A good custom programme is smaller than people fear. The first release should replace one painful workaround, with integrations to the systems that must remain.",
      "Ownership matters. If the build cannot be handed to another team, you have bought a vendor, not a system. Standard stacks, documented APIs, and runbooks are part of the benefit.",
      "We still recommend buying when the score says so. The value of a custom conversation is that the organisation knows why. This is commentary from a fictional delivery practice.",
    ],
  },
  {
    slug: "how-ai-can-improve-business-operations",
    title: "How AI can improve business operations",
    excerpt:
      "Assist a named decision, measure against the current process, and keep a person in the loop when a wrong answer is expensive.",
    category: "AI",
    date: "15 July 2026",
    publishedAt: "2026-07-15",
    readTime: "7 min",
    authorName: "Priya Nair",
    tags: ["AI", "Operations", "Automation"],
    seoTitle: "How AI can improve business operations",
    seoDescription:
      "Practical AI for operations: assistants, documents, and automation with a baseline and a fallback. Fictional TechCore note.",
    body: [
      "AI improves operations when it shortens a real cycle: classifying documents, drafting a first response, ranking exceptions, or extracting fields a person still confirms. It fails when the brief is 'add AI' without a baseline.",
      "Start with the decision. What happens today, how long it takes, and what a wrong answer costs. If you cannot name those, you are not ready to productionise a model.",
      "Assistants and chatbots need a knowledge boundary. Document intelligence needs a review step when the extract changes money or care. Recommendations need a metric that is not vanity.",
      "Production is monitoring, access control, and a stop path. The same discipline as any other system that can change a customer outcome.",
      "TechCore's AI practice is applied and cautious. Examples on this site are illustrative. We do not publish fictional accuracy percentages as if they were live client results.",
    ],
  },
  {
    slug: "mobile-app-versus-website",
    title: "Mobile app versus website: what should you choose?",
    excerpt:
      "Choose the surface that matches the job: reach and findability on the web, repeated tasks and device capability on mobile — sometimes both, with one product language.",
    category: "Technology",
    date: "2 July 2026",
    publishedAt: "2026-07-02",
    readTime: "6 min",
    authorName: "Sofia Martins",
    tags: ["Mobile", "Web Development", "Product"],
    seoTitle: "Mobile app versus website: what should you choose?",
    seoDescription:
      "How to choose between a website and a mobile app. Fictional TechCore product note — not a one-size rule.",
    body: [
      "A website is still the default for discovery, explanation, and a first transaction. It is linkable, crawlable, and cheaper to correct. If the job is 'be found and understood', start there.",
      "A mobile app earns its place when the job is repeated, personal, or device-native: field work, bookings a member opens weekly, offline moments, push that is actually useful, camera or location as part of the task.",
      "Building both without a shared API and design language produces two products that drift. Cross-platform stacks such as Flutter or React Native help when the product allows it. Native still wins for specific device capability.",
      "The expensive mistake is an app that is a slow copy of the website, or a website that pretends to be an app and fails in search.",
      "We scope the job first, then the surface. This article is a fictional practice note, not a prescription for every sector.",
    ],
  },
  {
    slug: "cloud-computing-for-growing-businesses",
    title: "Cloud computing for growing businesses",
    excerpt:
      "Cloud is not a logo. It is environments, pipelines, and a bill someone can explain — designed for how you actually release software.",
    category: "Cloud",
    date: "18 June 2026",
    publishedAt: "2026-06-18",
    readTime: "6 min",
    authorName: "James Okonkwo",
    tags: ["Cloud", "DevOps", "Cost"],
    seoTitle: "Cloud computing for growing businesses",
    seoDescription:
      "What growing businesses should demand from cloud: repeatable releases, monitoring, and a bill you can explain. Fictional TechCore note.",
    body: [
      "Growing businesses move to the cloud for elasticity and to stop treating servers as pets. They stay in pain when environments are snowflakes, releases are manual, and nobody owns the bill.",
      "The useful cloud programme is boring: a path from development to production, Docker where it reduces drift, CI/CD that a human can reason about, and monitoring that pages someone named.",
      "Scale is a design problem. Chatty APIs, always-on staging, and logs nobody reads show up as cost before they show up as an outage.",
      "You do not need every managed service on day one. You need repeatable infrastructure and access discipline in the account you own.",
      "TechCore runs cloud work in the client tenancy. This is demonstration commentary, not a vendor comparison chart.",
    ],
  },
  {
    slug: "how-to-choose-the-right-technology-partner",
    title: "How to choose the right technology partner",
    excerpt:
      "Score a partner on how they handle exceptions, ownership, and bad news — not on a logo wall or a discounted first sprint.",
    category: "Business",
    date: "4 June 2026",
    publishedAt: "2026-06-04",
    readTime: "8 min",
    authorName: "Amelia Chen",
    tags: ["Consulting", "Delivery", "Business"],
    seoTitle: "How to choose the right technology partner",
    seoDescription:
      "A practical frame for choosing a technology partner. Fictional TechCore advisory note.",
    body: [
      "Vendor demonstrations are designed to look like your process. Your exceptions are not in the demo. Ask what happens when a workflow goes wrong on a Tuesday.",
      "A serious partner will tell you when not to rebuild, when a date is unrealistic, and when they are the wrong team. Discounted discovery that always concludes 'build with us' is a sales motion.",
      "Ownership is the test. Will you receive source, documentation, and a stack you can hire for? Or a black box that can only be extended by the original vendor?",
      "Score options against the operating model, integration load, and the cost of reversing the decision in three years. Chemistry matters. Evidence matters more.",
      "TechCore is a fictional firm used to demonstrate this kind of conversation. Use the frame with whoever you actually hire.",
    ],
  },
  {
    slug: "importance-of-ui-ux-in-digital-products",
    title: "The importance of UI/UX in digital products",
    excerpt:
      "Operators abandon tools that only support the happy path. Design is how you make the messy path visible and finishable.",
    category: "Technology",
    date: "20 May 2026",
    publishedAt: "2026-05-20",
    readTime: "6 min",
    authorName: "Sofia Martins",
    tags: ["UI/UX", "Product", "Design Systems"],
    seoTitle: "The importance of UI/UX in digital products",
    seoDescription:
      "Why UI/UX is an operations problem, not decoration. Fictional TechCore design note.",
    body: [
      "Internal tools fail in the first month when they ignore exceptions. Staff return to spreadsheets because the product has no place to put a messy case.",
      "UI/UX in operational software is hierarchy, states, and language. It is not a mood board. Wireframes and prototypes exist to test the job with the people who do it.",
      "A design system is how you keep the next module from looking like a different company. Tokens, components, and accessibility are cheaper than a later rewrite of every screen.",
      "Research does not have to be a six-week theatre. Sitting with three coordinators while they handle a bad day will change the backlog more than a survey.",
      "We design for delivery. This note is from a fictional practice; the standard still holds: if operators cannot finish the work, the interface is not done.",
    ],
  },
  {
    slug: "cybersecurity-best-practices-for-businesses",
    title: "Cybersecurity best practices for businesses",
    excerpt:
      "Identity, API exposure, secrets, and a review engineers can finish. Most 'best practice' lists fail because nobody owns the ticket.",
    category: "Cyber Security",
    date: "6 May 2026",
    publishedAt: "2026-05-06",
    readTime: "7 min",
    authorName: "Noah Patel",
    tags: ["Cyber Security", "AppSec", "Access"],
    seoTitle: "Cybersecurity best practices for businesses",
    seoDescription:
      "Practical security for business software: identity, APIs, secrets, and remediation that fits the sprint. Fictional TechCore note.",
    body: [
      "Most organisations do not need a new slogan. They need least-privilege access, authentication that matches the product, APIs that validate input, and secrets that are not in the repository.",
      "A review that produces fifty undifferentiated issues will be ignored. Engineers need severity, exploitability, and a suggested fix in their own stack.",
      "Secure SDLC is habit: threat modelling on new features, dependency hygiene, and logging that supports an incident without becoming a second product.",
      "Hardening infrastructure without fixing application access is incomplete. The opposite is also true. Start where a mistake would actually hurt.",
      "TechCore writes findings as work. This article is educational commentary from a fictional firm, not a penetration-test report and not a compliance certificate.",
    ],
  },
  {
    slug: "digital-transformation-for-smes",
    title: "Digital transformation for small and medium businesses",
    excerpt:
      "Transformation is a sequence of owned releases, not a programme name. SMEs win when they modernise one painful process at a time.",
    category: "Business",
    date: "22 April 2026",
    publishedAt: "2026-04-22",
    readTime: "7 min",
    authorName: "Amelia Chen",
    tags: ["Digital Transformation", "SME", "Consulting"],
    seoTitle: "Digital transformation for small and medium businesses",
    seoDescription:
      "A staged approach to digital transformation for SMEs. Fictional TechCore consulting note.",
    body: [
      "Small and medium businesses are sold transformation as a platform decision. The work that pays is usually narrower: replace an inbox, connect two systems, or give operators a status they can trust.",
      "Digital transformation, done honestly, is modernising how work happens. Software is the means. If the operating model is unnamed, the implementation will be theatre.",
      "Sequence matters. A first release that a sponsor can recognise beats a multi-year roadmap with no stop point. Write down what you are not doing yet.",
      "SMEs often already have tools. The job is selection, integration, and retirement of workarounds — not a greenfield empire.",
      "Our consulting practice is written so leadership can stop or continue with evidence. TechCore is fictional; the sequencing advice is still the one we would use.",
    ],
  },
  {
    slug: "ecommerce-platforms-that-help-businesses-grow",
    title: "How e-commerce platforms help businesses grow",
    excerpt:
      "Growth stalls when the shop, the catalogue, and fulfilment disagree. Treat storefront and operations as one product.",
    category: "Web Development",
    date: "8 April 2026",
    publishedAt: "2026-04-08",
    readTime: "6 min",
    authorName: "Priya Nair",
    tags: ["E-Commerce", "Retail", "Web Development"],
    seoTitle: "How e-commerce platforms help businesses grow",
    seoDescription:
      "Why catalogue, checkout, and operations must share a record if e-commerce is going to grow. Fictional TechCore note.",
    body: [
      "A storefront can look finished and still block growth. Merchandising in a spreadsheet, promotions applied by memory, and fulfilment exceptions in email are the usual pattern after a starter shop succeeds.",
      "Platforms help when catalogue rules, checkout, and warehouse or partner flows share a record. Checkout error states matter as much as the hero image. B2B pricing should not require a second system on day sixty.",
      "Search, payments, and ERP connectors are integration work. They fail when they are treated as plugins you can stack forever.",
      "Measure the journeys that lose money: failed checkout, wrong stock promise, slow customer-service lookup. Vanity traffic is not a growth plan.",
      "ShopFlow on this site is a fictional case used to show that structure. It is not a live retailer and not a performance case study.",
    ],
  },
  {
    slug: "why-startups-need-scalable-software",
    title: "Why startups need scalable software",
    excerpt:
      "Scalable does not mean a mesh of services on day one. It means a first platform you can operate, hire for, and extend without a panic rewrite.",
    category: "Technology",
    date: "24 March 2026",
    publishedAt: "2026-03-24",
    readTime: "6 min",
    authorName: "James Okonkwo",
    tags: ["Startups", "Architecture", "MVP"],
    seoTitle: "Why startups need scalable software",
    seoDescription:
      "What scalable means for an early product: production standards, clear ownership, and deferred complexity that is written down. Fictional TechCore note.",
    body: [
      "Startups often ship a prototype that cannot survive the first serious users: no auth story, no backups, no way to change a data model without fear. The rewrite arrives at the worst time.",
      "Scalable software at this stage is an MVP with production standards. One deployable unit, a documented API, observability, and an architecture decision record for what you deferred.",
      "Fashionable complexity is not scale. A distributed system you cannot staff is a liability. Choose tools you can hire for.",
      "Founders also need reporting they did not invent on the morning of a board meeting. Event hygiene is cheaper early than a warehouse rescue later.",
      "TechCore's startup work is fictional demonstration content. The standard is still: ship something you can run on a Monday.",
    ],
  },
  {
    slug: "future-of-software-development",
    title: "The future of software development",
    excerpt:
      "More assistance, stricter contracts, and less patience for systems nobody can operate. The craft is still judgement about what to build.",
    category: "Technology",
    date: "12 March 2026",
    publishedAt: "2026-03-12",
    readTime: "6 min",
    authorName: "Noah Patel",
    tags: ["Technology", "AI", "Engineering"],
    seoTitle: "The future of software development",
    seoDescription:
      "A grounded view of where software delivery is heading. Fictional TechCore practice commentary.",
    body: [
      "Assistance will keep speeding up the boring parts of implementation. It will not remove the need to name the operating constraint, the data model, and the failure modes.",
      "Contracts will get stricter: typed APIs, clearer access, observability as a default. Buyers have less patience for systems that cannot be handed over.",
      "AI in the product and AI in the toolchain are different programmes. Mixing them in a slide does not produce either well.",
      "Server rendering, boring data stores, and explicit security reviews will still matter because users and crawlers still need a reliable result.",
      "We remain a delivery practice, not a futurist shop. This essay is commentary from a fictional firm. The bet is that judgement about what not to build stays the scarce skill.",
    ],
  },
  {
    slug: "building-software-that-operations-teams-will-use",
    title: "Building software that operations teams will actually use",
    excerpt:
      "Most internal tools fail in the first month because they ignore exceptions. Here is how we design for the messy path.",
    category: "Business",
    date: "26 February 2026",
    publishedAt: "2026-02-26",
    readTime: "6 min",
    authorName: "Sofia Martins",
    tags: ["Operations", "Custom Software", "UX"],
    seoTitle: "Building software that operations teams will actually use",
    seoDescription:
      "Design internal tools for exceptions, queues, and Tuesday afternoons. Fictional TechCore delivery note.",
    body: [
      "Operational software is judged on Tuesday afternoon, when a process has already gone wrong. If the product only supports the happy path, staff return to spreadsheets.",
      "We start by listing exceptions with the people who handle them. Those cases become first-class states in the interface: queues, reasons, and a record of what was done.",
      "Dashboards that nobody opens are a smell. Operators need the next action, not another chart. Leadership reporting can be a by-product of the same events.",
      "The result is quieter software. It does less on the surface and more where the work actually lives.",
      "Examples such as CarePlus and FleetPro on this site are fictional programmes used to show that structure. They are not live client brands.",
    ],
  },
  {
    slug: "a-practical-path-to-production-ai",
    title: "A practical path to production AI",
    excerpt:
      "Start with a baseline process, a bounded data set, and a human in the loop. Scale only when the metric moves.",
    category: "AI",
    date: "12 February 2026",
    publishedAt: "2026-02-12",
    readTime: "7 min",
    authorName: "Priya Nair",
    tags: ["AI", "MLOps", "Product"],
    seoTitle: "A practical path to production AI",
    seoDescription:
      "Pilot, measure, then productionise AI. Fictional TechCore engineering note — no fake accuracy stats.",
    body: [
      "AI programmes stall when they begin with a platform decision. The useful question is which decision you want to assist, and what a wrong answer costs.",
      "A short pilot against a known baseline tells you more than a strategy deck. If quality is not better than the current process, you stop.",
      "Document intelligence and chatbots fail in the same way: an unbounded corpus and no owner for a bad answer. Bound the knowledge, name the reviewer, log the outcome.",
      "Production then means monitoring, fallbacks, and access control — the same discipline as any other system that can change a customer outcome.",
      "This path is how a fictional practice would run the work. We do not invent client accuracy percentages to decorate the argument.",
    ],
  },
  {
    slug: "why-we-still-care-about-server-rendering",
    title: "Why we still care about server rendering",
    excerpt:
      "For corporate and product sites, HTML that arrives complete is still the most reliable way to be fast and findable.",
    category: "Web Development",
    date: "29 January 2026",
    publishedAt: "2026-01-29",
    readTime: "5 min",
    authorName: "James Okonkwo",
    tags: ["Web Development", "Performance", "SEO"],
    seoTitle: "Why we still care about server rendering",
    seoDescription:
      "Why TechCore still defaults to server-rendered HTML for public and document-heavy products. Fictional practice note.",
    body: [
      "Client-only rendering has a place. It is rarely the right default for a public website or a document-heavy product.",
      "Server-rendered pages give crawlers and customers the same content, keep JavaScript for interaction, and make performance work visible in the HTML.",
      "Corporate sites that hide the offer behind a spinner are asking buyers to wait for a story they could have read immediately.",
      "At TechCore this is not nostalgia. It is how we keep marketing sites and authenticated tools on one stack without two quality bars.",
    ],
  },
  {
    slug: "cloud-costs-are-a-design-problem",
    title: "Cloud costs are a design problem",
    excerpt:
      "The bill follows architecture: chatty APIs, unbounded logs, and environments that never sleep.",
    category: "Cloud",
    date: "14 January 2026",
    publishedAt: "2026-01-14",
    readTime: "6 min",
    authorName: "Amelia Chen",
    tags: ["Cloud", "FinOps", "Architecture"],
    seoTitle: "Cloud costs are a design problem",
    seoDescription:
      "Treat cloud spend as an architecture constraint. Fictional TechCore cloud note — no fake savings percentages.",
    body: [
      "Finance notices cloud spend after the architecture is already in production. By then the expensive patterns are habits.",
      "We treat cost as a design constraint alongside latency and access. That means questioning always-on environments, chatty service meshes, and logs nobody reads.",
      "The aim is not the cheapest stack. It is a bill that a technology leader can explain.",
      "Growing businesses do not need every managed service. They need sleep schedules, sensible retention, and a named owner for the invoice.",
      "No savings figure in this article is a client result. TechCore is a fictional firm; the design habit is the point.",
    ],
  },
  {
    slug: "security-reviews-that-engineers-can-finish",
    title: "Security reviews that engineers can finish",
    excerpt:
      "Findings without owners and tickets without context do not reduce risk. Remediation has to fit the sprint.",
    category: "Cyber Security",
    date: "8 January 2026",
    publishedAt: "2026-01-08",
    readTime: "5 min",
    authorName: "Noah Patel",
    tags: ["Cyber Security", "Secure SDLC", "Engineering"],
    seoTitle: "Security reviews that engineers can finish",
    seoDescription:
      "Write security findings as work: flow, control, and done. Fictional TechCore security note.",
    body: [
      "A review that produces fifty undifferentiated issues will be ignored. Engineers need severity, exploitability, and a suggested fix in their own stack.",
      "We write findings as work: which flow, which control, what done looks like. That is slower to author and faster to close.",
      "Authentication, authorisation, and API security are usually the highest-leverage places to start. Infrastructure hardening without application fixes is incomplete.",
      "Risk registers stay honest when residual risk is named instead of hidden behind a green dashboard.",
    ],
  },
  {
    slug: "choosing-a-platform-without-the-theatre",
    title: "Choosing a platform without the theatre",
    excerpt:
      "Build versus buy is a decision with evidence, not a brand preference. Here is the frame we use with leadership teams.",
    category: "Technology",
    date: "2 January 2026",
    publishedAt: "2026-01-02",
    readTime: "8 min",
    authorName: "Amelia Chen",
    tags: ["Technology Selection", "Consulting", "Architecture"],
    seoTitle: "Choosing a platform without the theatre",
    seoDescription:
      "A written frame for build versus buy. Fictional TechCore consulting note.",
    body: [
      "Vendor demonstrations are designed to look like your process. Your exceptions are not in the demo.",
      "We score options against the operating model, integration load, and the cost of reversing the decision in three years.",
      "Sometimes the answer is still to buy. The value is that the organisation knows why.",
      "Modernisation of a system that still earns its keep is often cheaper than a greenfield platform with a new name.",
      "This frame is how a fictional advisory practice would run a selection. It is not an endorsement of any commercial vendor.",
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((item) => item.slug === slug);
}

export function relatedPosts(slug: string, category: BlogCategory) {
  return posts
    .filter((post) => post.slug !== slug)
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, 3);
}
