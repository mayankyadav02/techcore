export const roles = [
  "super_admin",
  "admin",
  "editor",
  "viewer",
] as const;

export type Role = (typeof roles)[number];

export const permissions = [
  "dashboard:read",
  "content:read",
  "content:write",
  "content:publish",
  "leads:read",
  "leads:write",
  "testimonials:read",
  "testimonials:write",
  "settings:read",
  "settings:write",
  "users:read",
  "users:write",
  "users:delete",
] as const;

export type Permission = (typeof permissions)[number];

const rolePermissions: Record<Role, readonly Permission[]> = {
  super_admin: permissions,
  admin: [
    "dashboard:read",
    "content:read",
    "content:write",
    "content:publish",
    "leads:read",
    "leads:write",
    "testimonials:read",
    "testimonials:write",
    "settings:read",
    "settings:write",
  ],
  editor: [
    "dashboard:read",
    "content:read",
    "content:write",
    "content:publish",
    "testimonials:read",
    "testimonials:write",
  ],
  viewer: [
    "dashboard:read",
    "content:read",
    "testimonials:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export function roleLabel(role: Role) {
  switch (role) {
    case "super_admin":
      return "Super admin";
    case "admin":
      return "Admin";
    case "editor":
      return "Editor";
    case "viewer":
      return "Viewer";
  }
}
