export const userRoles = ["super_admin", "admin", "editor", "viewer"] as const;
export type UserRole = (typeof userRoles)[number];

export const userStatuses = ["active", "disabled"] as const;
export type UserStatus = (typeof userStatuses)[number];

export const contentStatuses = ["draft", "published", "archived"] as const;
export type ContentStatus = (typeof contentStatuses)[number];

export const blogStatuses = ["draft", "published"] as const;
export type BlogStatus = (typeof blogStatuses)[number];

export const jobStatuses = ["draft", "open", "closed", "archived"] as const;
export type JobStatus = (typeof jobStatuses)[number];

export const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
] as const;
export type EmploymentType = (typeof employmentTypes)[number];

export const applicationStatuses = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
  "archived",
] as const;
export type ApplicationStatus = (typeof applicationStatuses)[number];

export const enquiryTypes = ["contact", "quote", "general"] as const;
export type EnquiryType = (typeof enquiryTypes)[number];

export const enquiryStatuses = [
  "new",
  "contacted",
  "qualified",
  "in_progress",
  "converted",
  "closed",
] as const;
export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
