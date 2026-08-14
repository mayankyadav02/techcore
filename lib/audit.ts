export type AuditEvent = {
  actorId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export async function writeAuditLog(event: AuditEvent): Promise<void> {
  void event;
}
