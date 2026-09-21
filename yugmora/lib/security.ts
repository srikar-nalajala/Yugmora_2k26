// lib/security.ts — Security utilities: sanitization, output escaping, URL filtering & upload defense

/**
 * Escapes characters with special meaning in HTML to prevent XSS.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Validates and sanitizes a URL to ensure it doesn't use dangerous schemes
 * like javascript:, data:, vbscript:. Only allows http, https, mailto, tel, or relative/anchor paths.
 */
export function sanitizeSafeUrl(
  url: string,
  allowedProtocols: string[] = ["http:", "https:", "mailto:", "tel:"]
): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();

  // Allow relative paths and anchors
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (allowedProtocols.includes(parsed.protocol.toLowerCase())) {
      return trimmed;
    }
  } catch {
    // If URL parsing fails, check if it's a valid relative path without slash (e.g., query string or anchor)
    if (/^[a-zA-Z0-9_\-./#?&=%]+$/.test(trimmed) && !trimmed.includes(":")) {
      return trimmed;
    }
  }

  // Dangerous or malformed URL
  return "#blocked";
}

/**
 * Strips directory traversal sequences (../, ..\, null bytes) and invalid filename characters.
 */
export function sanitizeFileName(filename: string): string {
  if (!filename || typeof filename !== "string") return "";
  return filename
    .replace(/\0/g, "")
    .replace(/\.\./g, "")
    .replace(/[/\\]/g, "_")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 255);
}

/**
 * Validates that an incoming request specifies an expected Content-Type.
 * Rejects unexpected content types (such as raw text or arbitrary multipart payloads).
 */
export function validateContentType(
  request: Request,
  expected: string = "application/json"
): boolean {
  const contentType = request.headers.get("content-type");
  if (!contentType) return false;
  return contentType.toLowerCase().includes(expected.toLowerCase());
}

/**
 * Recursively removes __proto__, constructor, and prototype properties to defend against prototype pollution.
 */
export function stripPrototypePollution<T>(obj: T): T {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => stripPrototypePollution(item)) as unknown as T;
  }

  const cleanObj: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    cleanObj[key] = stripPrototypePollution(value);
  }
  return cleanObj as T;
}
