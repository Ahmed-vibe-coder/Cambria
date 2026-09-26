"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ShieldCheck, Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/majors", label: "Majors" },
  { href: "/services", label: "Services" },
  { href: "/team", label: "Faculty & Team" },
  { href: "/contact", label: "Contact" },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in admin layout, don't show the public navbar
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-subtle">
      {/* Top Academic Sub-bar */}
      <div className="bg-cambria-deep text-white text-xs py-1.5 border-b border-white/10 hidden md:block">
        <Container className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-300">
            <span>Official Institutional Portal</span>
            <span className="text-[#C8A84E]">★</span>
            <span>London Liaison & Transnational Academic Registry</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="text-slate-300 hover:text-white transition-colors text-xs font-medium"
            >
              Staff Portal Access
            </Link>
          </div>
        </Container>
      </div>

      {/* Main Navigation */}
      <Container className="flex items-center justify-between h-20">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <CambriaSeal size={48} variant="navy" priority className="transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-tight text-cambria-navy leading-none">
              CAMBRIA
            </span>
            <span className="text-[10px] tracking-[0.2em] font-semibold text-slate-500 uppercase mt-0.5">
              International College
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-2 text-sm font-medium transition-colors rounded-[4px]",
                  isActive
                    ? "text-cambria-academic font-semibold bg-cambria-soft/60"
                    : "text-slate-600 hover:text-cambria-navy hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/verify">
            <Button
              variant="outline"
              size="sm"
              className="border-cambria-navy/30 text-cambria-navy hover:bg-cambria-soft font-semibold gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-cambria-academic" />
              Verify Credential
            </Button>
          </Link>
          <Link href="/programs">
            <Button size="sm" className="gap-1.5 bg-cambria-navy hover:bg-cambria-academic">
              Explore Programs
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-[4px] text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-navy"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 min-h-[44px] flex items-center text-base font-medium rounded-[4px] transition-colors",
                    isActive
                      ? "text-cambria-navy bg-cambria-soft font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/verify" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cambria-academic" />
                Verify a Credential
              </Button>
            </Link>
            <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full justify-center">
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
