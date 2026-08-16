export type Service = {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  capabilities: string[];
  features: string[];
  technologies: string[];
  benefits: string[];
  process: string[];
  faqs: { title: string; content: string }[];
  icon: IconName;
  seoTitle?: string;
  seoDescription?: string;
};

export type IconName =
  | "web"
  | "mobile"
  | "software"
  | "ai"
  | "cloud"
  | "design"
  | "security"
  | "consulting";

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    icon: "web",
    seoTitle: "Web Development — Business Sites and Platforms",
    seoDescription:
      "Modern business websites, corporate sites, landing pages, and web platforms built for performance, SEO, and long-term use.",
    summary:
      "Modern business websites, corporate websites, landing pages, and web platforms — built to convert, load quickly, and stay maintainable.",
    overview:
      "TechCore plans and builds websites and web platforms around how a business actually sells and operates. That includes corporate sites, campaign landing pages, CMS-backed publishing, e-commerce storefronts, and authenticated web applications. We start with information architecture and the journeys that matter, then implement a stack your team can extend. Performance, accessibility, and SEO-ready structure are part of the first release — not a later polish pass. Work is delivered in vertical slices so sponsors can review a real page or flow rather than a slide.",
    capabilities: [
      "Business Websites",
      "Corporate Websites",
      "Landing Pages",
      "E-commerce",
      "CMS Websites",
      "Web Applications",
      "Performance Optimization",
      "SEO-ready Development",
    ],
    features: [
      "Responsive layouts with a consistent component system",
      "Clear page hierarchy, metadata, and crawlable HTML",
      "Forms and enquiry capture wired to your team",
      "Role-aware application flows where the product needs them",
      "Core Web Vitals budgets on primary journeys",
      "Staging, analytics, and a documented handover",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "React",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
    ],
    benefits: [
      "A public presence that matches how you sell, not a template leftover",
      "Faster first release with a codebase the next engineer can read",
      "Fewer launch surprises through staged testing and a named rollback path",
    ],
    process: [
      "Scope journeys, sitemap, and constraints",
      "Define information architecture and content model",
      "Build in vertical slices against agreed contracts",
      "Harden, test, publish, and hand over",
    ],
    faqs: [
      {
        title: "Do you rebuild existing sites or only start new ones?",
        content:
          "Both. We assess the current platform first and recommend a rebuild only when it is the more responsible path.",
      },
      {
        title: "Can you work with our internal developers?",
        content:
          "Yes. We regularly embed with in-house teams and leave documentation they can operate.",
      },
      {
        title: "Will the site be ready for search engines?",
        content:
          "Yes. We ship crawlable pages, sensible metadata, and a structure editors can keep honest. Rankings still depend on your content and domain — we do not sell guaranteed positions.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    icon: "mobile",
    seoTitle: "Mobile App Development — Android, iOS, Flutter, React Native",
    seoDescription:
      "Android, iOS, and cross-platform apps with Flutter or React Native, including API integration, authentication, and push notifications.",
    summary:
      "Android, iOS, and cross-platform applications with a single product standard — Flutter or React Native, backed by a clear API and release path.",
    overview:
      "Mobile work at TechCore is treated as a product, not a thin wrapper around a website. We design for permissions, offline moments, and the way field or customer teams actually use a device. Cross-platform delivery with Flutter or React Native is the default when the product allows it; native modules are used when a device capability or performance case is clear. Authentication, API integration, and push notifications are specified as part of the contract, not added after store submission. We support staged rollouts and store listing hygiene so the first public build is operable.",
    capabilities: [
      "Android Apps",
      "iOS Apps",
      "Cross-platform Apps",
      "Flutter Development",
      "React Native",
      "API Integration",
      "App Authentication",
      "Push Notifications",
    ],
    features: [
      "Shared design language with the web product where both exist",
      "Secure sign-in and session handling",
      "Typed API clients against an agreed contract",
      "Push and in-app messaging where the job requires them",
      "Analytics on core conversion or task steps",
      "Store submission support and staged rollouts",
    ],
    technologies: [
      "Flutter",
      "React Native",
      "TypeScript",
      "Swift",
      "Kotlin",
      "Firebase",
    ],
    benefits: [
      "One product language across devices instead of two disconnected apps",
      "Shorter review cycles with shared components and a single API",
      "Clear ownership of release, monitoring, and support",
    ],
    process: [
      "Map device-specific jobs to be done",
      "Prototype the critical flows",
      "Build against a shared API contract",
      "Test on target devices and release",
    ],
    faqs: [
      {
        title: "Do you prefer native or cross-platform?",
        content:
          "We default to Flutter or React Native when the product allows it, and native when the device capability or performance case is clear.",
      },
      {
        title: "Do you handle App Store and Play Console submission?",
        content:
          "Yes, as part of a scoped launch. You retain the developer accounts; we prepare builds, listings, and the review checklist.",
      },
    ],
  },
  {
    slug: "custom-software",
    title: "Custom Software",
    icon: "software",
    seoTitle: "Custom Software — CRM, ERP, Inventory, Workflow",
    seoDescription:
      "Bespoke business systems: CRM, ERP, inventory, booking, workflow automation, and operational dashboards.",
    summary:
      "Bespoke systems for operations that off-the-shelf tools cover poorly — CRM, ERP, inventory, booking, workflow, and dashboards.",
    overview:
      "When a standard product forces workarounds, we design software around the operating model. Typical programmes include business management systems, CRM and ERP modules, inventory, booking, workflow automation, and the dashboards operators actually open on a Tuesday. Integrations, permissions, and reporting are first-class concerns. We document current exceptions before we write a data model, then deliver the smallest useful system that can replace a spreadsheet or inbox without a big-bang cutover. Source control, APIs, and runbooks are part of handover so another team can continue the work.",
    capabilities: [
      "Business Management Systems",
      "CRM",
      "ERP",
      "Inventory Management",
      "Booking Systems",
      "Workflow Automation",
      "Dashboards",
    ],
    features: [
      "Domain-aligned data models and audit trails",
      "Role-based workspaces instead of one crowded screen",
      "Integrations with the systems that must remain",
      "Exception queues for the messy path, not only the happy path",
      "Operational dashboards with exports leadership can trust",
      "Handover notes and runbooks",
    ],
    technologies: [
      "TypeScript",
      "Node.js",
      "Python",
      "MongoDB",
      "PostgreSQL",
      "REST and events",
    ],
    benefits: [
      "Software that matches how the business actually works",
      "Less spreadsheet and email glue between teams",
      "A path to iterate without a rewrite after the first release",
    ],
    process: [
      "Document current process and exceptions",
      "Prioritise the smallest useful system",
      "Deliver in controlled releases",
      "Train operators and refine",
    ],
    faqs: [
      {
        title: "Will this lock us into TechCore?",
        content:
          "No. We use standard stacks, documented APIs, and source control practices so another team can continue the work.",
      },
      {
        title: "Can you replace our current CRM or ERP?",
        content:
          "Sometimes. More often we integrate with the system of record and replace the workarounds around it. A full replacement is recommended only when the operating model justifies it.",
      },
    ],
  },
  {
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    icon: "ai",
    seoTitle: "AI and Machine Learning for Business Operations",
    seoDescription:
      "Applied AI: assistants, chatbots, document intelligence, recommendations, process automation, and analytics — with human control.",
    summary:
      "Applied AI for assistants, chatbots, documents, recommendations, automation, and analytics — measured against a baseline, with a human in the loop.",
    overview:
      "We introduce machine learning where it reduces cost or cycle time, not as a showcase. Typical work includes operational assistants, chatbots with a defined knowledge boundary, document intelligence, recommendation and ranking, process automation, and analytics that a manager can act on. Models are evaluated against the current process, with clear fallbacks when confidence is low. Production means access control, monitoring, and a named owner — the same discipline as any other system that can change a customer outcome. Programmes start small: a bounded data set and a decision worth assisting.",
    capabilities: [
      "AI Assistants",
      "Chatbots",
      "Document Intelligence",
      "Recommendation Systems",
      "Process Automation",
      "Analytics",
    ],
    features: [
      "Human review in the loop for high-cost mistakes",
      "Prompt, policy, and knowledge-boundary controls",
      "Evaluation against a named baseline process",
      "Privacy-aware handling of operational data",
      "Monitoring for quality drift after go-live",
      "A stop path if the metric does not move",
    ],
    technologies: [
      "Python",
      "PyTorch",
      "OpenAI APIs",
      "Vector search",
      "TypeScript",
    ],
    benefits: [
      "Hours returned to specialist staff on repetitive work",
      "More consistent handling of documents and routine queries",
      "A controlled path from pilot to production",
    ],
    process: [
      "Define the decision being assisted",
      "Pilot on a bounded data set",
      "Measure against the current process",
      "Productionise with monitoring",
    ],
    faqs: [
      {
        title: "Do you train custom models?",
        content:
          "When the data and case justify it. Many programmes start with a well-governed use of existing models and only then invest in custom training.",
      },
      {
        title: "Will this replace our staff?",
        content:
          "We design assistance, not silent replacement. If a wrong answer is expensive, a person stays in the loop.",
      },
    ],
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    icon: "cloud",
    seoTitle: "Cloud and DevOps — Deploy, CI/CD, Docker, Scale",
    seoDescription:
      "Cloud deployment, CI/CD, Docker, monitoring, infrastructure setup, and a path to scale without fragile manual releases.",
    summary:
      "Reliable cloud platforms: deployment, CI/CD, Docker, monitoring, infrastructure setup, and a path to scale without theatre.",
    overview:
      "Infrastructure is designed for the product, not the other way around. We set up environments, pipelines, and observability so releases are routine rather than events. Typical work includes cloud deployment, CI/CD, containerised services with Docker, monitoring, infrastructure setup, and capacity planning so growth does not mean a weekend of manual scaling. We typically operate in the client tenancy with least-privilege access and documented change control. Cost is treated as a design constraint alongside latency and access.",
    capabilities: [
      "Cloud Deployment",
      "CI/CD",
      "Docker",
      "Monitoring",
      "Infrastructure Setup",
      "Scalability",
    ],
    features: [
      "Repeatable environments from development to production",
      "Automated promotion with a rollback path",
      "Secrets and access discipline",
      "Operational dashboards and alerting that someone owns",
      "Infrastructure as code where it reduces risk",
      "A written runbook for the on-call path",
    ],
    technologies: ["AWS", "Azure", "Docker", "Terraform", "GitHub Actions"],
    benefits: [
      "Fewer fragile manual releases",
      "A clearer cost and capacity picture",
      "Faster recovery when something fails",
    ],
    process: [
      "Assess current environments and release risk",
      "Design the target path to production",
      "Automate the risky manual steps",
      "Hand over with runbooks",
    ],
    faqs: [
      {
        title: "Can you work inside our existing cloud account?",
        content:
          "Yes. We typically operate in the client tenancy with least-privilege access and documented change control.",
      },
      {
        title: "Do you lock us into one cloud vendor?",
        content:
          "We choose the platform that matches the product and your team. Portability is a design choice, not a slogan — we say when it is worth the cost.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    icon: "design",
    seoTitle: "UI/UX Design — Web, Mobile, Dashboards, Design Systems",
    seoDescription:
      "Interface design for websites, mobile apps, and dashboards: design systems, wireframes, prototypes, and UX research tied to delivery.",
    summary:
      "Interface design for web, mobile, and dashboards — design systems, wireframes, prototypes, and UX research that engineering can implement.",
    overview:
      "Design at TechCore is tied to delivery. We produce systems, not one-off screens, so engineering can implement without reinterpretation. Work covers website UI, mobile app UI, dashboard design, design systems, wireframes, prototypes, and UX research with the people who will use the product. Operational software is a first-class brief: quiet hierarchy, explicit states, and accessibility as a design input. Handover includes component specifications aligned to the codebase, not a disconnected deck of artboards.",
    capabilities: [
      "Website UI",
      "Mobile App UI",
      "Dashboard Design",
      "Design Systems",
      "Wireframes",
      "Prototypes",
      "UX Research",
    ],
    features: [
      "Research that names jobs, constraints, and exceptions",
      "Structure and key flows before visual polish",
      "Accessible colour, type, and focus behaviour",
      "Component specifications engineers can implement",
      "Prototype reviews with operators, not only sponsors",
      "Handover aligned to the delivery stack",
    ],
    technologies: ["Figma", "Design tokens", "Storybook", "WCAG reviews"],
    benefits: [
      "Fewer design–engineering mismatches",
      "Interfaces operators can learn without a training week",
      "A visual language that scales to new modules",
    ],
    process: [
      "Research the jobs and constraints",
      "Define structure and key flows",
      "Systematise components",
      "Support implementation",
    ],
    faqs: [
      {
        title: "Do you only design, or also build?",
        content:
          "We can do either. Many programmes keep design and engineering in one TechCore team so the system stays coherent.",
      },
      {
        title: "Can you work with our existing brand?",
        content:
          "Yes. We treat brand as a constraint and extend it into product UI rather than inventing a parallel look.",
      },
    ],
  },
  {
    slug: "cyber-security",
    title: "Cyber Security",
    icon: "security",
    seoTitle: "Cyber Security — Reviews, Auth, API, Secure SDLC",
    seoDescription:
      "Practical security engineering: application review, authentication and authorisation, API security, secure SDLC, and hardening.",
    summary:
      "Practical security engineering: reviews, authentication and authorisation, API security, secure development practice, and hardening.",
    overview:
      "Security is built into delivery rather than added as a late audit. We focus on identity, data handling, API exposure, dependency risk, and the controls operators can actually maintain. Typical work includes application security reviews, authentication and authorisation design, API security, secure SDLC practices, and infrastructure hardening. Findings are written as work: which flow, which control, what done looks like. We can coordinate specialist penetration testing; our core offering is engineering the product so those tests find less, and so fixes land in the same sprint discipline.",
    capabilities: [
      "Security Review",
      "Authentication & Authorization",
      "API Security",
      "Secure Development Practices",
      "Infrastructure Hardening",
    ],
    features: [
      "Threat modelling for new features",
      "Least-privilege access and session design",
      "Input validation and API contract discipline",
      "Dependency and secret hygiene",
      "Logging that supports incident review",
      "Remediation tickets engineering can finish",
    ],
    technologies: ["OAuth 2.0", "OIDC", "SIEM integrations", "OWASP ASVS"],
    benefits: [
      "Fewer high-severity findings late in a release",
      "Clearer evidence for internal risk teams",
      "Controls that match how the product is run",
    ],
    process: [
      "Establish the threat and compliance context",
      "Review architecture and critical flows",
      "Prioritise fixes by exploitability",
      "Verify and document residual risk",
    ],
    faqs: [
      {
        title: "Is this a penetration test?",
        content:
          "We can coordinate specialist testing. Our core offering is engineering the product so those tests find less, and so fixes land in the same sprint discipline.",
      },
      {
        title: "Do you handle compliance certifications?",
        content:
          "We help you produce evidence and close gaps. Certification bodies remain independent; we do not sell a certificate.",
      },
    ],
  },
  {
    slug: "it-consulting",
    title: "IT Consulting",
    icon: "consulting",
    seoTitle: "IT Consulting — Architecture, Selection, Modernisation",
    seoDescription:
      "Independent advice on system architecture, technology selection, digital transformation, consulting, and software modernisation.",
    summary:
      "Independent advice on architecture, technology selection, digital transformation, and software modernisation — written so leadership can act.",
    overview:
      "Before a build, organisations often need a clear view of options. We produce recommendations that a board or technology leadership team can act on, then stay to implement if asked. Typical work includes system architecture reviews, technology selection, digital transformation planning, IT consulting for delivery operating models, and software modernisation of systems that still earn their keep. Findings are written, with cost and risk made explicit. A staged roadmap lets leadership stop or continue with evidence rather than a transformation slogan.",
    capabilities: [
      "System Architecture",
      "Technology Selection",
      "Digital Transformation",
      "IT Consulting",
      "Software Modernization",
    ],
    features: [
      "Written findings, not slide-only advice",
      "Build-versus-buy scored against the operating model",
      "Cost and risk made explicit",
      "A staged roadmap with stop points",
      "Architecture decision records your team can keep",
      "Optional implementation follow-through",
    ],
    technologies: [
      "Architecture Decision Records",
      "C4 models",
      "Workshop facilitation",
    ],
    benefits: [
      "Decisions that survive contact with delivery",
      "Less spend on the wrong platform",
      "Alignment between business and engineering",
    ],
    process: [
      "Frame the decision and constraints",
      "Evidence the current state",
      "Compare options",
      "Recommend and, if required, execute",
    ],
    faqs: [
      {
        title: "How long is a typical engagement?",
        content:
          "Focused reviews often run in weeks. Transformation programmes are scoped in phases so leadership can stop or continue with evidence.",
      },
      {
        title: "Will you recommend TechCore for the build?",
        content:
          "Only when we are a fit. If another vendor or an internal team is the better owner, we say so in the written recommendation.",
      },
    ],
  },
];

export function getService(slug: string) {
  return services.find((item) => item.slug === slug);
}
