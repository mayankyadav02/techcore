import type { ApplicationStatus, EnquiryStatus } from "@/modules/shared/enums";

const enquiryNext: Record<EnquiryStatus, EnquiryStatus[]> = {
  new: ["contacted", "closed"],
  contacted: ["qualified", "closed"],
  qualified: ["in_progress", "closed"],
  in_progress: ["converted", "closed"],
  converted: ["closed"],
  closed: [],
};

const applicationNext: Record<ApplicationStatus, ApplicationStatus[]> = {
  new: ["reviewing", "rejected", "archived"],
  reviewing: ["shortlisted", "rejected", "archived"],
  shortlisted: ["hired", "rejected", "archived"],
  rejected: ["archived"],
  hired: ["archived"],
  archived: [],
};

export function nextEnquiryStatuses(current: EnquiryStatus): EnquiryStatus[] {
  return [current, ...enquiryNext[current]];
}

export function nextApplicationStatuses(
  current: ApplicationStatus,
): ApplicationStatus[] {
  return [current, ...applicationNext[current]];
}

export function canTransitionEnquiry(from: EnquiryStatus, to: EnquiryStatus) {
  return from === to || enquiryNext[from].includes(to);
}

export function canTransitionApplication(
  from: ApplicationStatus,
  to: ApplicationStatus,
) {
  return from === to || applicationNext[from].includes(to);
}
