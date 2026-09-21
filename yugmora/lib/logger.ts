// lib/logger.ts — Structured server-side security & error logging

export type SecurityEventType =
  | "AUTH_SUCCESS"
  | "AUTH_FAILURE"
  | "RATE_LIMITED"
  | "CORS_BLOCKED"
  | "SERVER_ERROR"
  | "SUSPICIOUS_PAYLOAD";

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp?: string;
  ip?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  reason?: string;
  error?: string;
  meta?: Record<string, unknown>;
}

/**
 * Logs a security event in structured JSON format.
 * Redacts any sensitive information (never logs passcodes, secrets, or tokens).
 */
export function logSecurityEvent(event: SecurityEvent): void {
  const sanitizedMeta: Record<string, unknown> = {};

  if (event.meta) {
    for (const [k, v] of Object.entries(event.meta)) {
      if (/password|passcode|token|secret|auth|hash/i.test(k)) {
        sanitizedMeta[k] = "[REDACTED]";
      } else {
        sanitizedMeta[k] = v;
      }
    }
  }

  const logPayload = {
    level: event.type === "SERVER_ERROR" || event.type === "AUTH_FAILURE" ? "WARN" : "INFO",
    timestamp: event.timestamp || new Date().toISOString(),
    type: event.type,
    ip: event.ip || "unknown",
    path: event.path,
    method: event.method,
    userAgent: event.userAgent ? event.userAgent.slice(0, 200) : undefined,
    reason: event.reason,
    error: event.error ? event.error.slice(0, 500) : undefined,
    ...(Object.keys(sanitizedMeta).length > 0 ? { meta: sanitizedMeta } : {}),
  };

  const jsonStr = JSON.stringify(logPayload);

  if (logPayload.level === "WARN") {
    console.warn(`[SECURITY_AUDIT] ${jsonStr}`);
  } else {
    console.info(`[SECURITY_AUDIT] ${jsonStr}`);
  }
}
