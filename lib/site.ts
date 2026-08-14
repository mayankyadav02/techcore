export const site = {
  name: "TechCore",
  tagline: "Technology That Moves Business.",
  description:
    "TechCore delivers IT services, technology solutions, and industry expertise for organisations that need reliable digital partners.",
  email: "hello@techcore.example",
  phone: "+1 (555) 010-2040",
  address: "200 Market Street, Suite 800, San Francisco, CA",
} as const;

export type NavItem = {
  href: string;
  label: string;
};

export const publicNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/projects", label: "Projects" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const publicCta: NavItem = {
  href: "/request-quote",
  label: "Start a Project",
};

export const footerGroups = [
  {
    title: "Services",
    links: [
      { href: "/services", label: "IT Services" },
      { href: "/solutions", label: "Solutions" },
      { href: "/industries", label: "Industries" },
      { href: "/projects", label: "Projects" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/request-quote", label: "Request a Quote" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
] as const;

export const socialLinks = [
  { href: "https://www.linkedin.com", label: "LinkedIn" },
  { href: "https://x.com", label: "X" },
] as const;

export const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/solutions", label: "Solutions" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/careers", label: "Careers" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/enquiries", label: "Enquiries" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
] as const;
