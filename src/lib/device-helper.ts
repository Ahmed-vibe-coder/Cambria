export function parseDeviceName(userAgent: string | undefined): string {
  if (!userAgent) return "Web Browser";

  let os = "Unknown OS";
  if (/windows nt 10/i.test(userAgent)) os = "Windows 10/11";
  else if (/windows/i.test(userAgent)) os = "Windows";
  else if (/iphone/i.test(userAgent)) os = "iPhone";
  else if (/ipad/i.test(userAgent)) os = "iPad";
  else if (/macintosh|mac os x/i.test(userAgent)) os = "macOS";
  else if (/android/i.test(userAgent)) os = "Android";
  else if (/linux/i.test(userAgent)) os = "Linux";

  let browser = "Web Browser";
  if (/edg\//i.test(userAgent)) browser = "Microsoft Edge";
  else if (/opr\/|opera/i.test(userAgent)) browser = "Opera";
  else if (/chrome|crios/i.test(userAgent)) browser = "Google Chrome";
  else if (/firefox|fxios/i.test(userAgent)) browser = "Mozilla Firefox";
  else if (/safari/i.test(userAgent)) browser = "Apple Safari";

  return `${browser} on ${os}`;
}
