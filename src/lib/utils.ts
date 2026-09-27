import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAppBaseUrl(): string {
  // 1. Explicit production or custom domain override
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/+$/, "");
  }

  // 2. Vercel System Environment Variables (automatically set on Vercel deploys)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. Localhost development fallback only when NOT running on Vercel
  if (!process.env.VERCEL && envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  // 4. Default Production Canonical Domain
  return "https://cambria-five.vercel.app";
}


export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function maskNationalId(id?: string | null): string {
  if (!id) return "••••••••";
  if (id.length <= 4) return "••••" + id;
  const lastFour = id.slice(-4);
  return "•".repeat(Math.max(id.length - 4, 4)) + lastFour;
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
      return {
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200",
        dot: "bg-emerald-600",
        label: "Active & Verified",
      };
    case "expired":
      return {
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        dot: "bg-amber-600",
        label: "Expired",
      };
    case "revoked":
      return {
        bg: "bg-rose-50",
        text: "text-rose-800",
        border: "border-rose-200",
        dot: "bg-rose-600",
        label: "Revoked",
      };
    case "suspended":
      return {
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-200",
        dot: "bg-orange-600",
        label: "Suspended",
      };
    case "draft":
      return {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-500",
        label: "Draft",
      };
    case "replaced":
      return {
        bg: "bg-indigo-50",
        text: "text-indigo-800",
        border: "border-indigo-200",
        dot: "bg-indigo-600",
        label: "Replaced",
      };
    case "cancelled":
      return {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-200",
        dot: "bg-gray-500",
        label: "Cancelled",
      };
    default:
      return {
        bg: "bg-slate-50",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-500",
        label: status,
      };
  }
}
