import { connectMongo } from "@/lib/db";
import { hasPermission } from "@/lib/rbac";
import type { AuthUser } from "@/modules/identity/session.service";
import { Enquiry } from "@/modules/leads/enquiry.model";
import { Application } from "@/modules/careers/application.model";
import { Project } from "@/modules/work/project.model";
import { Service } from "@/modules/catalog/service.model";
import { BlogPost } from "@/modules/insights/blog-post.model";
import { Job } from "@/modules/careers/job.model";
import {
  applicationStatuses,
  enquiryStatuses,
} from "@/modules/shared/enums";

const notDeleted = { deletedAt: null };

function isoDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : "";
}

async function enquiryCountsByStatus() {
  return Promise.all(
    enquiryStatuses.map(async (status) => ({
      status,
      count: await Enquiry.countDocuments({ ...notDeleted, status }),
    })),
  );
}

async function applicationCountsByStatus() {
  return Promise.all(
    applicationStatuses.map(async (status) => ({
      status,
      count: await Application.countDocuments({ ...notDeleted, status }),
    })),
  );
}

export async function loadDashboard(user: AuthUser) {
  const canReadLeads = hasPermission(user.role, "leads:read");
  await connectMongo();

  const [services, projects, posts, jobs] = await Promise.all([
    Service.countDocuments(notDeleted),
    Project.countDocuments(notDeleted),
    BlogPost.countDocuments(notDeleted),
    Job.countDocuments({ ...notDeleted, status: "open" }),
  ]);

  const generatedAt = new Date().toISOString();

  if (!canReadLeads) {
    return {
      canReadLeads: false,
      generatedAt,
      counts: {
        enquiries: 0,
        newEnquiries: 0,
        projects,
        services,
        posts,
        jobs,
        applications: 0,
      },
      enquiryByStatus: enquiryStatuses.map((status) => ({ status, count: 0 })),
      applicationByStatus: applicationStatuses.map((status) => ({
        status,
        count: 0,
      })),
      recentEnquiries: [],
      recentApplications: [],
    };
  }

  const [
    enquiries,
    newEnquiries,
    applications,
    recentEnquiries,
    recentApplications,
    enquiryByStatus,
    applicationByStatus,
  ] = await Promise.all([
    Enquiry.countDocuments(notDeleted),
    Enquiry.countDocuments({ ...notDeleted, status: "new" }),
    Application.countDocuments(notDeleted),
    Enquiry.find(notDeleted)
      .select("name company type status subject createdAt")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    Application.find(notDeleted)
      .select("name jobTitleSnapshot status createdAt")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    enquiryCountsByStatus(),
    applicationCountsByStatus(),
  ]);

  return {
    canReadLeads: true,
    generatedAt,
    counts: {
      enquiries,
      newEnquiries,
      projects,
      services,
      posts,
      jobs,
      applications,
    },
    enquiryByStatus,
    applicationByStatus,
    recentEnquiries: recentEnquiries.map((row) => ({
      id: String(row._id),
      name: row.name,
      company: row.company ?? "",
      type: row.type,
      status: row.status,
      subject: row.subject ?? "",
      createdAt: isoDate(
        (row as { createdAt?: Date }).createdAt,
      ),
    })),
    recentApplications: recentApplications.map((item) => ({
      id: String(item._id),
      name: item.name,
      role: item.jobTitleSnapshot,
      status: item.status,
      createdAt: isoDate(
        (item as { createdAt?: Date }).createdAt,
      ),
    })),
  };
}
