export function formatAuditAction(action: string): string {
  const map: Record<string, string> = {
    "content.update": "Updated content",
    "pageseo.update": "Updated page SEO",
    "media.create": "Added media",
    "media.delete": "Deleted media",
    "email.test": "Sent test email",
    "user.create": "Created user",
    "user.update": "Updated user",
    "user.delete": "Deleted user",
    "auth.login": "Logged in",
    "auth.logout": "Logged out",
    "job.create": "Added job",
    "job.update": "Updated job",
    "job.delete": "Deleted job",
    "post.create": "Added post",
    "post.update": "Updated post",
    "post.delete": "Deleted post",
    "service.create": "Added service",
    "service.update": "Updated service",
    "service.delete": "Deleted service",
    "solution.create": "Added solution",
    "solution.update": "Updated solution",
    "solution.delete": "Deleted solution",
    "project.create": "Added project",
    "project.update": "Updated project",
    "project.delete": "Deleted project",
    "industry.create": "Added industry",
    "industry.update": "Updated industry",
    "industry.delete": "Deleted industry",
    "testimonial.create": "Added testimonial",
    "testimonial.update": "Updated testimonial",
    "testimonial.delete": "Deleted testimonial",
    "enquiry.status": "Updated enquiry status",
    "enquiry.note": "Added enquiry note",
    "enquiry.delete": "Deleted enquiry",
    "application.status": "Updated application status",
    "application.note": "Added application note",
    "application.delete": "Deleted application",
  };

  if (map[action]) {
    return map[action];
  }

  // Fallback: capitalize and replace dots with spaces
  return action
    .split(".")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
