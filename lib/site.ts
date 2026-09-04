import type { Permission } from "@/lib/rbac";
import { hasPermission, type Role } from "@/lib/rbac";

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
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/solutions", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/projects", label: "Projects" },
  { href: "/careers", label: "Careers" },
  { href: "/blog", label: "Blog" },
];

export const desktopNav: NavItem[] = publicNav.filter((item) => item.href !== "/");

export const publicCta: NavItem = {
  href: "/quote",
  label: "Request a Quote",
};

export const footerGroups = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
      { href: "/quote", label: "Request a Quote" },
    ],
  },
  {
    title: "Services",
    links: [
      { href: "/services", label: "All services" },
      { href: "/services/web-development", label: "Web Development" },
      { href: "/services/mobile-app-development", label: "Mobile Apps" },
      { href: "/services/custom-software", label: "Custom Software" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/solutions", label: "All solutions" },
      { href: "/projects", label: "Projects" },
    ],
  },
  {
    title: "Industries",
    links: [{ href: "/industries", label: "All industries" }],
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

export const adminNav: {
  href: string;
  label: string;
  permission: Permission;
}[] = [
  { href: "/admin/dashboard", label: "Dashboard", permission: "dashboard:read" },
  { href: "/admin/services", label: "Services", permission: "content:read" },
  { href: "/admin/solutions", label: "Solutions", permission: "content:read" },
  { href: "/admin/industries", label: "Industries", permission: "content:read" },
  { href: "/admin/projects", label: "Projects", permission: "content:read" },
  { href: "/admin/blog", label: "Blog", permission: "content:read" },
  { href: "/admin/careers", label: "Careers", permission: "content:read" },
  { href: "/admin/applications", label: "Applications", permission: "leads:read" },
  { href: "/admin/enquiries", label: "Enquiries", permission: "leads:read" },
  { href: "/admin/testimonials", label: "Testimonials", permission: "testimonials:read" },
  { href: "/admin/users", label: "Users", permission: "users:read" },
  { href: "/admin/settings", label: "Settings", permission: "settings:read" },
];

export function adminNavForRole(role: Role) {
  return adminNav.filter((item) => hasPermission(role, item.permission));
}
