export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  closesAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export const jobs: Job[] = [
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    department: "Engineering",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "4+ years",
    closesAt: "2026-11-30",
    seoTitle: "Frontend Developer — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: Frontend Developer. TypeScript, React, Next.js. Hybrid San Francisco.",
    description:
      "You will build the interfaces for TechCore client products and our own public platform. The work is TypeScript-first, component-led, and reviewed for accessibility and performance. This listing is fictional and exists to demonstrate the careers product.",
    responsibilities: [
      "Implement product UI from a design system",
      "Own front-end quality on assigned modules",
      "Collaborate with design and backend on contracts",
      "Document components for reuse",
      "Raise accessibility and performance issues early",
    ],
    requirements: [
      "Strong TypeScript and React experience",
      "Comfort with Next.js App Router concepts",
      "Evidence of accessible, production UI work",
      "Clear written communication",
    ],
    skills: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Testing Library"],
  },
  {
    slug: "backend-developer",
    title: "Backend Developer",
    department: "Engineering",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "4+ years",
    closesAt: "2026-11-30",
    seoTitle: "Backend Developer — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: Backend Developer. APIs, data models, Node.js. Hybrid San Francisco.",
    description:
      "You will design APIs, data models, and service boundaries for client systems. Reliability, validation, and honest error handling matter more than novelty. This listing is fictional.",
    responsibilities: [
      "Design and implement service APIs",
      "Model data with clear ownership",
      "Add tests around critical paths",
      "Support production incidents in rotation",
      "Document contracts other teams can consume",
    ],
    requirements: [
      "Production experience with Node.js or equivalent",
      "Relational or document modelling judgement",
      "Security awareness around auth and input",
      "Ability to explain trade-offs",
    ],
    skills: ["TypeScript", "Node.js", "MongoDB", "PostgreSQL", "REST"],
  },
  {
    slug: "full-stack-developer",
    title: "Full Stack Developer",
    department: "Engineering",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "5+ years",
    closesAt: "2026-11-30",
    seoTitle: "Full Stack Developer — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: Full Stack Developer. Vertical slices from UI to persistence.",
    description:
      "You will take features from interface to persistence on delivery programmes. You are expected to keep the seam between UI and services clean. This listing is fictional.",
    responsibilities: [
      "Deliver vertical slices of product",
      "Keep validation aligned across client and server",
      "Raise design or architecture issues early",
      "Mentor more junior engineers on the squad",
      "Leave handover notes a later engineer can use",
    ],
    requirements: [
      "Depth in either frontend or backend, competence in the other",
      "Shipped business software, not only prototypes",
      "Comfort in client-facing delivery",
      "Disciplined git and review habits",
    ],
    skills: ["TypeScript", "Next.js", "Node.js", "MongoDB", "Zod"],
  },
  {
    slug: "flutter-developer",
    title: "Flutter Developer",
    department: "Engineering",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "3+ years",
    closesAt: "2026-12-15",
    seoTitle: "Flutter Developer — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: Flutter Developer for cross-platform product apps.",
    description:
      "You will build cross-platform mobile products in Flutter, against typed API contracts, with the same quality bar as our web work. Authentication, offline-tolerant flows, and store-ready releases are part of the job. This listing is fictional.",
    responsibilities: [
      "Implement Flutter UI from a shared design system",
      "Integrate APIs, authentication, and push where scoped",
      "Test on target Android and iOS devices",
      "Support store submissions with the delivery lead",
      "Keep platform-specific code isolated and documented",
    ],
    requirements: [
      "Shipped Flutter apps used by real operators or customers",
      "Comfort with Dart, state management, and platform channels when needed",
      "Judgement about when a native module is justified",
      "Clear written communication with design and backend",
    ],
    skills: ["Flutter", "Dart", "Firebase", "REST", "Store release"],
  },
  {
    slug: "devops-engineer",
    title: "DevOps Engineer",
    department: "Platform",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "4+ years",
    closesAt: "2026-12-15",
    seoTitle: "DevOps Engineer — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: DevOps Engineer. CI/CD, Docker, cloud, monitoring.",
    description:
      "You will make releases routine: environments, pipelines, containers, and monitoring in client tenancies and on our own platform. Cost and access discipline are part of the design. This listing is fictional.",
    responsibilities: [
      "Design and operate CI/CD and environment promotion",
      "Containerise services and keep images boring",
      "Implement monitoring, alerting, and a rollback path",
      "Harden access, secrets, and change control",
      "Write runbooks the on-call engineer can follow",
    ],
    requirements: [
      "Production experience with AWS or Azure",
      "Docker and pipeline automation you have operated, not only demoed",
      "Infrastructure as code where it reduces risk",
      "Calm incident communication",
    ],
    skills: ["AWS", "Docker", "GitHub Actions", "Terraform", "Observability"],
  },
  {
    slug: "ui-ux-designer",
    title: "UI/UX Designer",
    department: "Design",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "4+ years",
    closesAt: "2026-11-30",
    seoTitle: "UI/UX Designer — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: UI/UX Designer for operational and public products.",
    description:
      "You will design operational and public products with a restrained visual language. The output is a system engineers can implement, not a deck of disconnected screens. This listing is fictional.",
    responsibilities: [
      "Research and structure key user journeys",
      "Maintain and extend the design system",
      "Specify components, states, and content",
      "Partner with engineering through implementation",
      "Prototype and review with operators, not only sponsors",
    ],
    requirements: [
      "A portfolio of shipped product work",
      "Systems thinking, not only visual polish",
      "Familiarity with accessibility standards",
      "Ability to present recommendations calmly",
    ],
    skills: ["Figma", "Design systems", "Prototyping", "Content design", "WCAG"],
  },
  {
    slug: "qa-engineer",
    title: "QA Engineer",
    department: "Quality",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "3+ years",
    closesAt: "2026-11-30",
    seoTitle: "QA Engineer — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: QA Engineer embedded in delivery squads.",
    description:
      "You will make delivery safer by designing tests that match real risk. You will work inside the squad, not as a gate at the end. This listing is fictional.",
    responsibilities: [
      "Plan test coverage for releases",
      "Automate high-value checks",
      "Investigate defects with engineers",
      "Improve environments and data for testing",
      "Protect the journeys that lose money or trust when they fail",
    ],
    requirements: [
      "Experience testing web applications in production teams",
      "Ability to write or maintain automated checks",
      "Clear defect reports",
      "Judgement about what not to automate",
    ],
    skills: ["Playwright", "API testing", "Exploratory testing", "CI", "SQL"],
  },
  {
    slug: "business-development-executive",
    title: "Business Development Executive",
    department: "Commercial",
    location: "San Francisco / Hybrid",
    employmentType: "Full-time",
    experience: "3+ years",
    closesAt: "2026-12-31",
    seoTitle: "Business Development Executive — TechCore Careers",
    seoDescription:
      "Fictional TechCore opening: Business Development Executive for qualified discovery, not volume outbound theatre.",
    description:
      "You will run qualified conversations with organisations that have a real delivery problem — websites, products, and operational software. You will not invent urgency or oversell a rebuild. Handover to delivery must be honest. This listing is fictional.",
    responsibilities: [
      "Qualify inbound briefs and run structured discovery calls",
      "Write clear opportunity notes delivery leads can use",
      "Coordinate proposals with engineering and design",
      "Maintain a pipeline that reflects reality, not theatre",
      "Represent TechCore as a fictional demonstration brand with integrity",
    ],
    requirements: [
      "Experience selling or qualifying B2B services, preferably technology",
      "Comfort with technical conversations without pretending to be the architect",
      "Excellent writing; proposals are part of the job",
      "Willingness to walk away from a poor-fit brief",
    ],
    skills: [
      "Discovery",
      "Proposal writing",
      "CRM hygiene",
      "Stakeholder management",
      "Commercial judgement",
    ],
  },
];

export function getJob(slug: string) {
  return jobs.find((item) => item.slug === slug);
}
