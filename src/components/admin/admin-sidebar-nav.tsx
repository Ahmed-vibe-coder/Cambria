"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Award,
  FileText,
  History,
  ShieldCheck,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarLinks: NavItem[] = [
  { href: "/admin", label: "Dashboard Overview", icon: LayoutDashboard },
  { href: "/admin/credentials", label: "Credentials Registry", icon: Award },
  { href: "/admin/students", label: "Students Directory", icon: Users },
  { href: "/admin/programs", label: "Academic Programs", icon: GraduationCap },
  { href: "/admin/documents", label: "Document Gallery", icon: FileText },
  { href: "/admin/audit-logs", label: "System Audit Trail", icon: History },
  { href: "/admin/settings", label: "Security & Devices", icon: ShieldCheck },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1">
      {sidebarLinks.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-xs font-medium transition-all group",
              isActive
                ? "bg-white/15 text-white font-semibold shadow-sm border-l-2 border-[#C8A84E] pl-2.5"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4 shrink-0 transition-colors",
                isActive
                  ? "text-[#C8A84E]"
                  : "text-slate-400 group-hover:text-[#C8A84E]"
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
