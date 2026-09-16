import { connectMongo } from "@/lib/db";
import { hasPermission } from "@/lib/rbac";
import type { AuthUser } from "@/modules/identity/session.service";
import { Enquiry } from "@/modules/leads/enquiry.model";
import { Application } from "@/modules/careers/application.model";
import { Project } from "@/modules/work/project.model";
import { Service } from "@/modules/catalog/service.model";
import { BlogPost } from "@/modules/insights/blog-post.model";
import { Job } from "@/modules/careers/job.model";
import { User } from "@/modules/identity/user.model";
import { AuditLog } from "@/modules/shared/audit-log.model";
import {
  applicationStatuses,
  enquiryStatuses,
} from "@/modules/shared/enums";

const notDeleted = { deletedAt: null };

function isoDate(value: unknown) {
  return value instanceof Date ? value.toISOString() : "";
}

async function enquiryCountsByStatus() {
  const agg = await Enquiry.aggregate([
    { $match: notDeleted },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  const countsMap = new Map(agg.map((a: { _id: string; count: number }) => [a._id, a.count]));
  return enquiryStatuses.map((status) => ({
    status,
    count: countsMap.get(status) || 0,
  }));
}

async function applicationCountsByStatus() {
  const agg = await Application.aggregate([
    { $match: notDeleted },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  const countsMap = new Map(agg.map((a: { _id: string; count: number }) => [a._id, a.count]));
  return applicationStatuses.map((status) => ({
    status,
    count: countsMap.get(status) || 0,
  }));
}

export async function loadDashboard(user: AuthUser) {
  const canReadLeads = hasPermission(user.role, "leads:read");
  const canReadUsers = hasPermission(user.role, "users:read");
  const canReadAuditLogs = hasPermission(user.role, "audit_logs:read");

  await connectMongo();

  const [services, projects, posts, jobs, users, recentAuditLogs] = await Promise.all([
    Service.countDocuments(notDeleted),
    Project.countDocuments(notDeleted),
    BlogPost.countDocuments(notDeleted),
    Job.countDocuments({ ...notDeleted, status: "open" }),
    canReadUsers ? User.countDocuments({ status: "active" }) : Promise.resolve(0),
    canReadAuditLogs
      ? AuditLog.find()
          .select("action resourceType createdAt")
          .sort({ createdAt: -1 })
          .limit(5)
          .lean()
      : Promise.resolve([]),
  ]);

  const generatedAt = new Date().toISOString();

  const permissions = {
    canWriteUsers: hasPermission(user.role, "users:write"),
    canWriteContent: hasPermission(user.role, "content:write") || hasPermission(user.role, "site:write"),
    canReadAuditLogs,
    canReadUsers,
  };

  const auditLogsMapped = recentAuditLogs.map((log) => ({
    id: String(log._id),
    action: log.action,
    resourceType: log.resourceType,
    createdAt: isoDate((log as { createdAt?: Date }).createdAt),
  }));

  if (!canReadLeads) {
    return {
      canReadLeads: false,
      permissions,
      generatedAt,
      counts: {
        enquiries: 0,
        newEnquiries: 0,
        projects,
        services,
        posts,
        jobs,
        applications: 0,
        users,
      },
      enquiryByStatus: enquiryStatuses.map((status) => ({ status, count: 0 })),
      applicationByStatus: applicationStatuses.map((status) => ({
        status,
        count: 0,
      })),
      recentEnquiries: [],
      recentApplications: [],
      recentAuditLogs: auditLogsMapped,
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
    permissions,
    generatedAt,
    counts: {
      enquiries,
      newEnquiries,
      projects,
      services,
      posts,
      jobs,
      applications,
      users,
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
    recentAuditLogs: auditLogsMapped,
  };
}
