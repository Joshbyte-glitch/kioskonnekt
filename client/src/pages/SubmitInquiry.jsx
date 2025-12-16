import { ArrowLeftIcon, Menu as MenuIcon, Send, User, Mail, MessageSquare, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar";
export const SubmitInquiry = () => {
    const [, setLocation] = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);
    const [fullName, setFullName] = useState("");
    const [concern, setConcern] = useState("");
    const [email, setEmail] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [ticketId, setTicketId] = useState("");
    const [loggedInName, setLoggedInName] = useState("");

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem("kioskUserName");
            if (stored) {
                setLoggedInName(stored);
            }
        }
        catch {
            // ignore
        }
    }, []);

    const handleSubmit = () => {
        const nameToUse = (fullName || loggedInName).trim();
        if (!nameToUse || !concern.trim() || !email.trim()) {
            return;
        }

        const newTicketId = `TKT-${Date.now().toString().slice(-6)}`;
        setTicketId(newTicketId);

        // Optionally keep a simple history in localStorage to represent "created tickets"
        try {
            const existing = JSON.parse(window.localStorage.getItem("kioskTickets") || "[]");
            existing.push({
                id: newTicketId,
                name: nameToUse,
                concern: concern.trim(),
                email: email.trim(),
                createdAt: new Date().toISOString(),
            });
            window.localStorage.setItem("kioskTickets", JSON.stringify(existing));
        }
        catch {
            // ignore storage errors
        }

        setShowSuccess(true);
    };

    const displayName = (fullName || loggedInName || "").trim() || "Guest";

    return (<div className="w-full min-h-screen relative flex flex-col overflow-hidden">
      {/* PLV Background */}
      <img className="absolute inset-0 w-full h-full object-cover" alt="PLV Background" src="/figmaAssets/plv-background.png"/>
      <div className="absolute inset-0 bg-[#004aad]/60 backdrop-blur-[3px]"/>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/menu")} className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all duration-300">
          <ArrowLeftIcon className="w-6 h-6 text-white"/>
        </Button>

        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all duration-300">
          <MenuIcon className="w-6 h-6 text-white"/>
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-5 pt-4 pb-8">
        {/* Title Section */}
        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <span className="px-4 py-1.5 bg-[#ffc300] rounded-full text-[#004aad] text-sm font-semibold tracking-wide">
              PLV Helpdesk
            </span>
          </div>
          <h1 className="font-bold text-white text-3xl tracking-tight drop-shadow-lg">
            Submit Inquiry
          </h1>
          <p className="text-white/80 text-sm mt-2 max-w-xs mx-auto">
            We're here to help! Fill out the form below.
          </p>
        </div>

        {/* Form Card */}
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border-0 shadow-2xl shadow-black/20">
          <CardContent className="p-6 flex flex-col gap-5">
            {/* Full Name Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#004aad]/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-[#004aad]"/>
              </div>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="h-14 pl-16 bg-[#f8f9fc] rounded-2xl border-2 border-transparent focus:border-[#004aad] focus:bg-white font-medium text-gray-700 text-base placeholder:text-gray-400 transition-all duration-300"
              />
            </div>

            {/* Concern Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#004aad]/10 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#004aad]"/>
              </div>
              <Input
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                placeholder="Your Concern"
                className="h-14 pl-16 bg-[#f8f9fc] rounded-2xl border-2 border-transparent focus:border-[#004aad] focus:bg-white font-medium text-gray-700 text-base placeholder:text-gray-400 transition-all duration-300"
              />
            </div>

            {/* Email Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#004aad]/10 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#004aad]"/>
              </div>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                type="email"
                className="h-14 pl-16 bg-[#f8f9fc] rounded-2xl border-2 border-transparent focus:border-[#004aad] focus:bg-white font-medium text-gray-700 text-base placeholder:text-gray-400 transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              className="h-14 bg-gradient-to-r from-[#004aad] to-[#0066cc] hover:from-[#003d8f] hover:to-[#0055aa] rounded-2xl font-bold text-white text-lg tracking-wide shadow-lg shadow-[#004aad]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#004aad]/40 hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5"/>
              Submit Inquiry
            </Button>

            {/* Info Text */}
            <div className="flex items-center gap-3 mt-2 p-4 bg-[#ffc300]/15 rounded-2xl border border-[#ffc300]/30">
              <div className="w-10 h-10 bg-[#ffc300] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-[#004aad] text-lg font-bold">i</span>
              </div>
              <p className="font-medium text-[#004aad]/80 text-sm leading-relaxed">
                Once submitted, your request will be processed by the admin within 24-48 hours.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PLV Branding */}
        <div className="mt-auto pt-6">
          <div className="flex items-center gap-2 text-white/70">
            <div className="w-8 h-8 bg-[#ffc300] rounded-lg flex items-center justify-center">
              <span className="text-[#004aad] font-bold text-xs">PLV</span>
            </div>
            <span className="text-sm font-medium">Pamantasan ng Lungsod ng Valenzuela</span>
          </div>
        </div>
      </main>

      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}/>

      {/* Success Modal */}
      {showSuccess && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 relative flex flex-col items-center text-center">
            <button
              className="absolute top-4 right-4 text-[#004aad] hover:text-[#002f6c]"
              onClick={() => setShowSuccess(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#004aad] flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-[#004aad] font-extrabold text-lg mb-2">
              Submission Successful
            </h2>
            <p className="text-gray-600 text-sm mb-1">
              Thank you! Your inquiry has been received.
            </p>
            <p className="text-gray-600 text-sm mb-4">
              Please check your e-mail for a response soon.
            </p>

            {/* Instead of QR code, show the logged-in name */}
            <div className="mt-2 mb-4 px-4 py-3 rounded-2xl bg-[#f5f7ff] border border-[#004aad]/20 w-full">
              <p className="text-xs text-gray-500 mb-1">Submitted by</p>
              <p className="text-[#004aad] font-bold text-lg break-words">
                {displayName}
              </p>
              {ticketId && (
                <p className="text-[11px] text-gray-500 mt-1">
                  Ticket ID: {ticketId}
                </p>
              )}
            </div>

            <p className="text-gray-500 text-xs">
              Keep this name and ticket ID for tracking your inquiry status.
            </p>
          </div>
        </div>
      )}
    </div>);
};
