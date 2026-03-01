function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  if (realIP) {
    return realIP;
  }

  // Fallback to connection remote address or unknown
  return "unknown";
}
// response
