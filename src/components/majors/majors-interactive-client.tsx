"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import {
  allMajorsData,
  facultiesList,
  MajorItem,
} from "@/data/majors-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import {
  Calculator,
  Landmark,
  Briefcase,
  Building2,
  Users,
  Globe,
  LineChart,
  Layers,
  TrendingUp,
  MessageSquare,
  CheckSquare,
  Code,
  Cpu,
  Laptop,
  Network,
  Wrench,
  Dna,
  Microscope,
  Stethoscope,
  Pill,
  Activity,
  ShieldAlert,
  Gavel,
  Scale,
  Fingerprint,
  ShieldCheck,
  Search,
  Palette,
  HardHat,
  Brain,
  HeartHandshake,
  HandHeart,
  Sparkles,
  GraduationCap,
  Baby,
  Flag,
  BookOpen,
  Plane,
  Hotel,
  UtensilsCrossed,
  Megaphone,
  Share2,
  Binary,
  Music,
  X,
  SlidersHorizontal,
  Grid,
  List,
  ArrowRight,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Filter,
} from "lucide-react";

// Icon mapping dictionary
const iconMap: Record<string, React.ElementType> = {
  Calculator,
  Landmark,
  Briefcase,
  Building2,
  Users,
  Globe,
  LineChart,
  Layers,
  TrendingUp,
  MessageSquare,
  CheckSquare,
  Code,
  Cpu,
  Laptop,
  Network,
  Wrench,
  Dna,
  Microscope,
  Stethoscope,
  Pill,
  Activity,
  ShieldAlert,
  Gavel,
  Scale,
  Fingerprint,
  ShieldCheck,
  Search,
  Palette,
  HardHat,
  Brain,
  HeartHandshake,
  HandHeart,
  Sparkles,
  GraduationCap,
  Baby,
  Flag,
  BookOpen,
  Plane,
  Hotel,
  UtensilsCrossed,
  Megaphone,
  Share2,
  Binary,
  Music,
};

export function MajorsInteractiveClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [activeModalMajor, setActiveModalMajor] = useState<MajorItem | null>(null);

  // Proposal form state
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalData, setProposalData] = useState({
    fullName: "",
    email: "",
    phone: "",
    proposedMajor: "",
    qualificationLevel: "masters",
    experienceSummary: "",
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setActiveModalMajor(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter majors
  const filteredMajors = useMemo(() => {
    return allMajorsData.filter((major) => {
      // Faculty filter
      if (selectedFaculty !== "all" && major.facultyId !== selectedFaculty) {
        return false;
      }

      // Level filter
      if (selectedLevel !== "all" && major.level !== selectedLevel) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = major.name.toLowerCase().includes(query);
        const matchNameAr = major.name_ar.includes(query);
        const matchCode = major.code.toLowerCase().includes(query);
        const matchDesc = major.description.toLowerCase().includes(query);
        const matchFaculty = major.facultyName.toLowerCase().includes(query);
        const matchModules = major.modules.some((m) => m.toLowerCase().includes(query));
        return matchName || matchNameAr || matchCode || matchDesc || matchFaculty || matchModules;
      }

      return true;
    });
  }, [searchQuery, selectedFaculty, selectedLevel]);

  // Handle proposal submit
  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalLoading(true);
    setTimeout(() => {
      setProposalLoading(false);
      setProposalSubmitted(true);
    }, 900);
  };

  const handleOpenMajorInquiry = (major: MajorItem) => {
    setActiveModalMajor(null);
    setProposalData((prev) => ({
      ...prev,
      proposedMajor: `${major.name} (${major.code})`,
      qualificationLevel: major.level === "masters" ? "masters" : "diploma",
    }));
    const proposalSection = document.getElementById("proposal-section");
    if (proposalSection) {
      proposalSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-16">
      {/* 1. FILTER & SEARCH CONTROL CONSOLE */}
      <section className="bg-white border-y border-slate-200 shadow-sm py-8 sticky top-20 z-30 backdrop-blur-md bg-white/95">
        <Container>
          <div className="space-y-6">
            {/* Search Bar + Controls Top Row */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              {/* Search Input */}
              <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by major title, code (e.g. ACC-401), Arabic name, or discipline..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-20 h-12 text-base border-slate-300 focus:border-cambria-navy focus:ring-1 focus:ring-cambria-navy rounded-[6px] bg-slate-50/50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
                      /
                    </kbd>
                  )}
                </div>
              </div>

              {/* View Mode & Level Filters */}
              <div className="flex items-center gap-3 self-end md:self-auto">
                {/* Level Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">Level:</span>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="h-11 px-3 text-xs sm:text-sm font-medium bg-white border border-slate-300 rounded-[6px] text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-cambria-navy/20 cursor-pointer"
                  >
                    <option value="all">All Qualifications</option>
                    <option value="masters">Professional Master&apos;s</option>
                    <option value="diploma">Professional Diploma</option>
                    <option value="certificate">Executive Certificate</option>
                  </select>
                </div>

                {/* Grid / Table Toggle */}
                <div className="flex items-center border border-slate-300 rounded-[6px] p-0.5 bg-slate-100">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-[4px] transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-cambria-navy shadow-xs font-semibold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={`p-2 rounded-[4px] transition-colors ${
                      viewMode === "table"
                        ? "bg-white text-cambria-navy shadow-xs font-semibold"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Horizontal Faculty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Faculties:
              </span>
              {facultiesList.map((fac) => {
                const isSelected = selectedFaculty === fac.id;
                const count =
                  fac.id === "all"
                    ? allMajorsData.length
                    : allMajorsData.filter((m) => m.facultyId === fac.id).length;

                return (
                  <button
                    key={fac.id}
                    onClick={() => setSelectedFaculty(fac.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 shrink-0 ${
                      isSelected
                        ? "bg-cambria-navy text-white shadow-sm ring-2 ring-cambria-navy/20 font-semibold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    <span>{fac.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Query Status Bar */}
            <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
              <div>
                Showing <strong className="text-cambria-navy font-semibold">{filteredMajors.length}</strong> of{" "}
                {allMajorsData.length} Disciplinary Majors
                {selectedFaculty !== "all" && (
                  <span>
                    {" "}
                    in{" "}
                    <strong className="text-cambria-academic font-medium">
                      {facultiesList.find((f) => f.id === selectedFaculty)?.name}
                    </strong>
                  </span>
                )}
                {searchQuery && (
                  <span>
                    {" "}
                    matching &ldquo;<span className="text-slate-900 font-medium">{searchQuery}</span>&rdquo;
                  </span>
                )}
              </div>

              {(searchQuery || selectedFaculty !== "all" || selectedLevel !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFaculty("all");
                    setSelectedLevel("all");
                  }}
                  className="text-cambria-academic hover:underline font-semibold flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Reset Filters
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* 2. MAJORS CATALOG (GRID OR TABLE) */}
      <section>
        <Container>
          {filteredMajors.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-[8px] max-w-xl mx-auto p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-cambria-navy">
                No matching academic majors found
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                We couldn&apos;t find any majors matching &ldquo;{searchQuery}&rdquo;. You can submit your
                desired specialization directly to our Academic Board below.
              </p>
              <div className="pt-2 flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFaculty("all");
                    setSelectedLevel("all");
                  }}
                >
                  Clear All Filters
                </Button>
                <a href="#proposal-section">
                  <Button className="bg-cambria-navy hover:bg-cambria-deep text-white">
                    Propose Custom Major
                  </Button>
                </a>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMajors.map((major) => {
                const IconComponent = iconMap[major.iconName] || BookOpen;

                return (
                  <div
                    key={major.id}
                    onClick={() => setActiveModalMajor(major)}
                    className="group bg-white border border-slate-200 rounded-[8px] p-6 hover:border-cambria-navy/50 hover:shadow-card transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden"
                  >
                    {/* Top Highlight Tag */}
                    {major.highlightTag && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-[4px] bg-[#C8A84E]/15 text-[#8E6E1A] border border-[#C8A84E]/30">
                        {major.highlightTag}
                      </span>
                    )}

                    <div className="space-y-4">
                      {/* Icon & Code Badge */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-[6px] bg-cambria-soft/80 group-hover:bg-cambria-navy group-hover:text-white text-cambria-navy flex items-center justify-center transition-colors shrink-0 border border-cambria-navy/10">
                          <IconComponent className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-bold text-slate-500 tracking-wider block">
                            {major.code}
                          </span>
                          <span className="text-[11px] font-medium text-cambria-academic block">
                            {major.facultyName}
                          </span>
                        </div>
                      </div>

                      {/* Title & Arabic translation */}
                      <div>
                        <h3 className="font-serif text-xl font-bold text-cambria-navy group-hover:text-cambria-academic transition-colors leading-snug">
                          {major.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 font-arabic pt-1" dir="rtl">
                          {major.name_ar}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {major.description}
                      </p>

                      {/* Module Tags */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                          Representative Modules:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {major.modules.slice(0, 2).map((mod, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded-[4px] bg-slate-100 text-slate-700 font-medium truncate max-w-full"
                            >
                              • {mod}
                            </span>
                          ))}
                          {major.modules.length > 2 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-slate-50 text-slate-500 font-semibold">
                              +{major.modules.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {major.duration}
                      </span>
                      <span className="text-cambria-navy font-semibold group-hover:text-cambria-academic flex items-center gap-1">
                        Curriculum Details
                        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE / EDITORIAL LIST VIEW */
            <div className="bg-white border border-slate-200 rounded-[8px] overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-6">Disciplinary Code</th>
                      <th className="py-4 px-6">Major & Arabic Title</th>
                      <th className="py-4 px-6">Faculty Division</th>
                      <th className="py-4 px-6">Level & Duration</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredMajors.map((major) => {
                      const IconComponent = iconMap[major.iconName] || BookOpen;

                      return (
                        <tr
                          key={major.id}
                          onClick={() => setActiveModalMajor(major)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        >
                          <td className="py-4 px-6 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-[4px] bg-slate-100 group-hover:bg-cambria-navy group-hover:text-white text-cambria-navy flex items-center justify-center transition-colors shrink-0">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="font-mono text-xs font-bold text-cambria-navy">
                                {major.code}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <strong className="font-serif text-base text-cambria-navy group-hover:text-cambria-academic transition-colors block">
                                {major.name}
                              </strong>
                              <span className="text-xs text-slate-400 font-arabic block pt-0.5" dir="rtl">
                                {major.name_ar}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-600">
                            {major.facultyName}
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cambria-soft text-cambria-navy block w-fit">
                              {major.levelLabel}
                            </span>
                            <span className="text-[11px] text-slate-500 block mt-1">
                              {major.duration}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-cambria-academic font-semibold group-hover:bg-cambria-soft"
                            >
                              Explore Syllabus
                              <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 3. PROPOSE YOUR MAJOR / CUSTOM CURRICULAR ACCREDITATION INQUIRY */}
      {/* (Fulfilling the Stanford promise: If major not listed, submit it to us) */}
      <section id="proposal-section" className="py-12">
        <Container>
          <div className="bg-gradient-to-br from-cambria-deep via-cambria-navy to-slate-900 rounded-[12px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
            {/* Subtle background crest / texture */}
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
              <Award className="w-96 h-96" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              {/* Left Column: Context & Guarantee */}
              <div className="lg:col-span-6 space-y-6">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C8A84E] block">
                  Curricular Accreditation & Custom Specialization
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  Cannot Find Your Exact Specialization?
                </h2>
                <DoubleRingDivider />
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Cambria International College offers a wide variety of majors specifically engineered
                  for seasoned practitioners and executive professionals across virtually every global industry.
                </p>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  If your specialized field or workplace expertise is not cataloged in our primary syllabus,
                  you can submit your proposed discipline directly to our Academic Board. Our registrar will
                  review your professional background and reply with an evaluation within{" "}
                  <strong className="text-white font-semibold">48 business hours</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-[6px] p-4">
                    <CheckCircle2 className="w-5 h-5 text-[#C8A84E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-semibold text-white block">
                        Workplace RPL Recognition
                      </strong>
                      <span className="text-[11px] text-slate-300">
                        Prior experiential learning credited toward degree requirements.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-[6px] p-4">
                    <ShieldCheck className="w-5 h-5 text-[#C8A84E] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-xs font-semibold text-white block">
                        Official UK Attestation
                      </strong>
                      <span className="text-[11px] text-slate-300">
                        Full cryptographic verification & consular legalization eligibility.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Proposal Form */}
              <div className="lg:col-span-6">
                <div className="bg-white text-slate-900 rounded-[8px] p-8 shadow-2xl">
                  {proposalSubmitted ? (
                    /* Submission Success State */
                    <div className="text-center py-8 space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-cambria-navy">
                        Curricular Inquiry Received
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                        Thank you for submitting your specialization inquiry for{" "}
                        <strong className="text-cambria-navy">
                          {proposalData.proposedMajor || "your chosen major"}
                        </strong>
                        . Your submission has been registered with reference ID:
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-xs text-cambria-navy font-bold">
                        REG-PROPOSAL-{Math.floor(100000 + Math.random() * 900000)}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        The Academic Liaison Committee will contact you at{" "}
                        <strong>{proposalData.email}</strong> within 48 hours.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setProposalSubmitted(false);
                          setProposalData({
                            fullName: "",
                            email: "",
                            phone: "",
                            proposedMajor: "",
                            qualificationLevel: "masters",
                            experienceSummary: "",
                          });
                        }}
                        className="mt-2 text-xs"
                      >
                        Submit Another Inquiry
                      </Button>
                    </div>
                  ) : (
                    /* Proposal Form */
                    <form onSubmit={handleProposalSubmit} className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="font-serif text-xl font-bold text-cambria-navy">
                          Submit Your Specialization
                        </h3>
                        <p className="text-xs text-slate-500">
                          Direct inquiry to the Academic Accreditation Committee
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                          <Input
                            required
                            type="text"
                            placeholder="e.g. Dr. Robert Vance"
                            value={proposalData.fullName}
                            onChange={(e) =>
                              setProposalData({ ...proposalData, fullName: e.target.value })
                            }
                            className="h-10 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                          <Input
                            required
                            type="email"
                            placeholder="name@domain.com"
                            value={proposalData.email}
                            onChange={(e) =>
                              setProposalData({ ...proposalData, email: e.target.value })
                            }
                            className="h-10 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Contact Telephone *</label>
                          <Input
                            required
                            type="tel"
                            placeholder="+44 7... or +1 ..."
                            value={proposalData.phone}
                            onChange={(e) =>
                              setProposalData({ ...proposalData, phone: e.target.value })
                            }
                            className="h-10 text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">Target Credential</label>
                          <select
                            value={proposalData.qualificationLevel}
                            onChange={(e) =>
                              setProposalData({ ...proposalData, qualificationLevel: e.target.value })
                            }
                            className="w-full h-10 px-3 text-xs bg-white border border-slate-300 rounded-[6px] text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-cambria-navy"
                          >
                            <option value="masters">Professional Master&apos;s (Level 7)</option>
                            <option value="diploma">Professional Diploma (Level 6/5)</option>
                            <option value="certificate">Executive Certificate</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Proposed Major or Field of Study *
                        </label>
                        <Input
                          required
                          type="text"
                          placeholder="e.g. Quantum Computing Infrastructure or Forensic Audit"
                          value={proposalData.proposedMajor}
                          onChange={(e) =>
                            setProposalData({ ...proposalData, proposedMajor: e.target.value })
                          }
                          className="h-10 text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Brief Professional Background / Context
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Describe your current industry role, years of experience, or specific academic outcomes desired..."
                          value={proposalData.experienceSummary}
                          onChange={(e) =>
                            setProposalData({ ...proposalData, experienceSummary: e.target.value })
                          }
                          className="w-full p-2.5 text-xs border border-slate-300 rounded-[6px] focus:outline-hidden focus:ring-1 focus:ring-cambria-navy text-slate-800"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={proposalLoading}
                        className="w-full bg-cambria-navy hover:bg-cambria-deep text-white font-semibold py-2.5 text-xs shadow-md transition-all"
                      >
                        {proposalLoading ? "Submitting Inquiry to Registrar..." : "Submit Major for Academic Evaluation"}
                      </Button>

                      <p className="text-[10px] text-slate-400 text-center">
                        Strict institutional privacy. Data handled according to UK Data Protection Act 2018.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. MAJOR DETAILS MODAL / DIALOG */}
      {activeModalMajor && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
          onClick={() => setActiveModalMajor(null)}
        >
          <div
            className="bg-white rounded-[10px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 relative border border-slate-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalMajor(null)}
              className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 border-b border-slate-100 pb-5 pr-8">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                  {activeModalMajor.code}
                </span>
                <span className="text-xs font-semibold text-cambria-academic">
                  {activeModalMajor.facultyName}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cambria-navy">
                {activeModalMajor.name}
              </h3>
              <p className="text-sm font-semibold text-slate-400 font-arabic" dir="rtl">
                {activeModalMajor.name_ar}
              </p>
            </div>

            {/* Overview & Duration */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-[6px] text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Qualification</span>
                <strong className="text-cambria-navy font-semibold">{activeModalMajor.levelLabel}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Typical Duration</span>
                <strong className="text-cambria-navy font-semibold">{activeModalMajor.duration}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Delivery Mode</span>
                <strong className="text-cambria-navy font-semibold">Executive Distance & Hybrid</strong>
              </div>
            </div>

            {/* Narrative Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Disciplinary Scope & Overview
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeModalMajor.description}
              </p>
              <p className="text-xs text-slate-500 font-arabic leading-relaxed pt-1" dir="rtl">
                {activeModalMajor.description_ar}
              </p>
            </div>

            {/* Core Modules */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Representative Curricular Modules
              </h4>
              <div className="space-y-2">
                {activeModalMajor.modules.map((m, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                    <span className="text-[#C8A84E] font-bold mt-0.5">★</span>
                    <span className="font-medium">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Leadership Outcomes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Target Leadership Career Pathways
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeModalMajor.careerOutcomes.map((career, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-[4px] bg-cambria-soft text-cambria-navy border border-blue-200"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <span className="text-xs text-slate-500">
                Need customized curricular modules for your workplace?
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveModalMajor(null)}
                  className="w-1/2 sm:w-auto text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenMajorInquiry(activeModalMajor)}
                  className="w-1/2 sm:w-auto bg-cambria-navy hover:bg-cambria-deep text-white text-xs font-semibold gap-1"
                >
                  Inquire / Apply for Major
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
