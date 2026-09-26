"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DoubleRingDivider } from "@/components/ui/double-ring-divider";
import { CambriaSeal } from "@/components/ui/cambria-seal";
import { Mail, MapPin, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Institutional Registrar"
        title="Contact & Registrar Inquiries"
        description="Connect with the Office of the Academic Registrar, consular attestation officers, or admissions directors."
        variant="navy"
      />

      <Section variant="offwhite">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Contact Details & Office Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200 rounded-[6px] p-8 shadow-card space-y-6">
                <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                  <CambriaSeal size={48} variant="navy" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-cambria-navy">
                      Office of the Registrar
                    </h3>
                    <span className="text-xs text-slate-500 uppercase tracking-wider block">
                      Cambria International College
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-cambria-academic shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-cambria-navy">Headquarters & Registrar Liaison</strong>
                      <span>London & International Transnational Operations</span>
                      <p className="text-xs text-slate-500 pt-0.5">
                        Transnational Academic Records & Archival Registry
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-cambria-academic shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-cambria-navy">Official Registrar Inquiries</strong>
                      <span className="text-slate-600">registrar@cambria.edu</span>
                      <p className="text-xs text-slate-500 pt-0.5">
                        Official correspondence, transcript requests, and verification queries.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-cambria-navy">Immediate Verification</strong>
                      <p className="text-xs text-slate-600 pt-0.5">
                        For immediate credential validation, please use our sovereign online verification portal
                        instead of email requests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7">
              <Card className="p-8 shadow-card">
                <CardHeader className="p-0 pb-6">
                  <CardTitle className="font-serif text-2xl font-bold text-cambria-navy">
                    Registrar Inquiry Submission
                  </CardTitle>
                  <p className="text-sm text-slate-500 pt-1">
                    Please submit your inquiry regarding programs, student records, or institutional partnerships.
                  </p>
                </CardHeader>

                <CardContent className="p-0">
                  {submitted ? (
                    <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-[6px] text-center space-y-3">
                      <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                      <h4 className="font-serif text-xl font-bold text-emerald-950">
                        Inquiry Received by Registrar
                      </h4>
                      <p className="text-sm text-emerald-800">
                        Your inquiry has been logged in the institutional intake queue. An academic officer will
                        respond to the provided email address within two business days.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSubmitted(false)}
                        className="mt-2 border-emerald-600 text-emerald-800 hover:bg-emerald-100"
                      >
                        Submit Another Inquiry
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">
                            Full Name <span className="text-rose-600">*</span>
                          </label>
                          <Input required placeholder="e.g. Dr. Arthur Pendelton" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">
                            Email Address <span className="text-rose-600">*</span>
                          </label>
                          <Input required type="email" placeholder="e.g. arthur@institution.org" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">
                            Inquiry Category
                          </label>
                          <select className="flex h-11 sm:h-10 w-full rounded-[4px] border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic">
                            <option>Program Admissions & Syllabi</option>
                            <option>Prior Learning Assessment (PLAR)</option>
                            <option>Transcript & Attestation Support</option>
                            <option>Institutional Partnership</option>
                            <option>Other Institutional Inquiry</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700">
                            Credential Number (if applicable)
                          </label>
                          <Input placeholder="e.g. CAM-2026-000184" className="h-11 sm:h-10" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Message & Inquiry Details <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                          required
                          rows={4}
                          className="w-full rounded-[4px] border border-slate-300 bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cambria-academic"
                          placeholder="Please provide comprehensive details regarding your academic or administrative request..."
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-cambria-navy hover:bg-cambria-academic text-white font-semibold"
                      >
                        {loading ? "Transmitting to Registrar..." : "Dispatch Inquiry"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
