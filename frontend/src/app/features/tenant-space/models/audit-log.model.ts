export interface AuditLogEntry {
    id: string;
    revisionId: number;
    timestamp: string;
    userId: string;
    actionType: string;
    entityType: string;
    entityId: string;
}
