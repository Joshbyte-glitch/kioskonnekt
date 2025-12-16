import { ArrowLeftIcon, Menu as MenuIcon, Send, User, Mail, MessageSquare, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/hooks/use-toast"; // toast helper for user feedback

// Connectivity notes:
// - Backend controller: SubmitInquiryController listens at POST /api/SubmitInquiry and GET /api/SubmitInquiry
// - Dev setup: `vite.config.js` proxies /api -> https://localhost:7262 (secure:false) so client can use relative '/api/SubmitInquiry'
// - If you need to call the backend directly instead of using the proxy, change the fetch URL to
//   `https://localhost:7262/api/SubmitInquiry` and ensure CORS is enabled on the server.
// - The client expects the backend to accept JSON matching SubmitInquiryCreateDto: { Name, Email, Concern }
export const SubmitInquiry = () => {
    const [, setLocation] = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);
    const [fullName, setFullName] = useState("");
    const [concern, setConcern] = useState("");
    const [email, setEmail] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [ticketId, setTicketId] = useState("");
    const [loggedInName, setLoggedInName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [backendAvailable, setBackendAvailable] = useState(null); // null = unknown, true/false = known
    const { toast } = useToast();

    // Connectivity check: ping the backend GET /api/SubmitInquiry (the controller exposes GET)
    // We intentionally use a short timeout to avoid blocking the UI. This uses the same
    // relative `/api` path so the Vite dev server proxy (configured in vite.config.js)
    // forwards requests to your backend at https://localhost:7262 during development.
    async function checkBackend(timeoutMs = 3000) {
        try {
            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeoutMs);
            const res = await fetch('/api/SubmitInquiry', { method: 'GET', signal: controller.signal });
            clearTimeout(id);
            setBackendAvailable(res.ok);
            return res.ok;
        }
        catch (err) {
            setBackendAvailable(false);
            return false;
        }
    }

    useEffect(() => {
        // check backend once on mount
        checkBackend();
    }, []);

    // When backend becomes available, attempt to sync any locally queued inquiries
    async function syncQueuedLocalSubmissions() {
        try {
            const existing = JSON.parse(window.localStorage.getItem('kioskTickets') || '[]');
            const queued = existing.filter((t) => t.source === 'local');
            if (!queued || queued.length === 0) return;

            let successCount = 0;
            for (const q of queued) {
                try {
                    const res = await fetch('/api/SubmitInquiry', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ Name: q.name, Email: q.email, Concern: q.concern }),
                    });
                    if (res.ok) {
                        const data = await res.json().catch(() => ({}));
                        // mark as remote and update id if backend returns one
                        q.source = 'remote';
                        if (data && data.id) q.id = data.id;
                        successCount++;
                    }
                }
                catch {
                    // network issue for this item – keep it queued
                }
            }
            if (successCount > 0) {
                // overwrite storage with updated items
                window.localStorage.setItem('kioskTickets', JSON.stringify(existing));
                toast({ title: 'Queued submissions synced', description: `${successCount} items synced to server.` });
            }
        }
        catch {
            // ignore errors
        }
    }

    useEffect(() => {
        if (backendAvailable === true) {
            syncQueuedLocalSubmissions();
        }
    }, [backendAvailable]);


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

    // Submits an inquiry using the backend SubmitInquiry controller.
    // The ASP.NET controller you provided exposes POST /api/SubmitInquiry and accepts
    // a JSON body matching SubmitInquiryCreateDto: { Name, Email, Concern }.
    // Implementation notes:
    // - We POST to the relative path `/api/SubmitInquiry` so the Vite dev proxy
    //   forwards requests to your backend at https://localhost:7262 (see `vite.config.js`).
    // - The client will try the backend and fall back to saving locally if it cannot reach the server.
    const handleSubmit = async () => {
        const nameToUse = (fullName || loggedInName).trim();
        if (!nameToUse || !concern.trim() || !email.trim()) {
            toast({ title: "Missing fields", description: "Please fill out name, concern, and email." });
            return;
        }

        setIsSubmitting(true);
        // Local fallback ticket id (used if backend doesn't return one)
        const fallbackId = `TKT-${Date.now().toString().slice(-6)}`;

        // Match the server DTO casing (PascalCase) to be explicit
        const payload = {
            Name: nameToUse,
            Email: email.trim(),
            Concern: concern.trim(),
        };

        // If we already detected backend is offline, inform the user and still attempt
        if (backendAvailable === false) {
            toast({ title: "Backend offline", description: "Saving locally — will sync when the server is reachable." });
        }

        try {
            const res = await fetch('/api/SubmitInquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json().catch(() => ({}));
                const returnedId = data && (data.id || data.id === 0) ? data.id : fallbackId; // server returns created.Id
                setTicketId(returnedId);

                // Save a local copy too, so the kiosk has a simple record
                try {
                    const existing = JSON.parse(window.localStorage.getItem('kioskTickets') || '[]');
                    existing.push({
                        id: returnedId,
                        name: nameToUse,
                        concern: payload.Concern,
                        email: payload.Email,
                        createdAt: new Date().toISOString(),
                        source: 'remote',
                    });
                    window.localStorage.setItem('kioskTickets', JSON.stringify(existing));
                }
                catch {
                    // ignore storage errors
                }

                toast({ title: 'Submission successful', description: 'Your inquiry has been sent to the admin.' });
                setShowSuccess(true);
                // re-check backend in case it became available
                checkBackend();
            }
            else {
                // Non-200: fallback to local storage and inform the user
                const id = fallbackId;
                setTicketId(id);
                try {
                    const existing = JSON.parse(window.localStorage.getItem('kioskTickets') || '[]');
                    existing.push({
                        id,
                        name: nameToUse,
                        concern: payload.Concern,
                        email: payload.Email,
                        createdAt: new Date().toISOString(),
                        source: 'local',
                    });
                    window.localStorage.setItem('kioskTickets', JSON.stringify(existing));
                }
                catch {
                    // ignore storage errors
                }

                toast({ title: 'Submission queued', description: 'Server error — your inquiry is saved locally and can be synced later.' });
                setShowSuccess(true);
                // also re-check backend
                checkBackend();
            }
        }
        catch (err) {
            // Network or other fetch error: fallback to local storage
            const id = fallbackId;
            setTicketId(id);
            try {
                const existing = JSON.parse(window.localStorage.getItem('kioskTickets') || '[]');
                existing.push({
                    id,
                    name: nameToUse,
                    concern: payload.Concern,
                    email: payload.Email,
                    createdAt: new Date().toISOString(),
                    source: 'local',
                });
                window.localStorage.setItem('kioskTickets', JSON.stringify(existing));
            }
            catch {
                // ignore storage errors
            }

            toast({ title: 'Submission failed', description: 'Network error — saved locally.' });
            setShowSuccess(true);
            // refresh availability state
            setBackendAvailable(false);
        }
        finally {
            setIsSubmitting(false);
        }
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
          <h1 className="font-bold text-white text-3xl tracking-tight drop-shadow-lg">
            Submit Inquiry
          </h1>
          <div className="mt-2 flex items-center justify-center gap-3">
            <p className="text-white/80 text-sm max-w-xs">
              We're here to help! Fill out the form below.
            </p>
            <div className="ml-2">
              {backendAvailable === null ? (
                <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs px-3 py-1 rounded-full">Checking…</div>
              ) : backendAvailable === true ? (
                <div className="inline-flex items-center gap-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">Server online</div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-red-600 text-white text-xs px-3 py-1 rounded-full">Server offline</div>
              )}
            </div>
            <button onClick={() => checkBackend()} className="text-white/80 underline text-xs">Retry</button>
          </div>
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
                disabled={isSubmitting}
                className="h-14 pl-16 bg-[#f8f9fc] rounded-2xl border-2 border-transparent focus:border-[#004aad] focus:bg-white font-medium text-gray-700 text-base placeholder:text-gray-400 transition-all duration-300 disabled:opacity-60"
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
                disabled={isSubmitting}
                className="h-14 pl-16 bg-[#f8f9fc] rounded-2xl border-2 border-transparent focus:border-[#004aad] focus:bg-white font-medium text-gray-700 text-base placeholder:text-gray-400 transition-all duration-300 disabled:opacity-60"
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
                disabled={isSubmitting}
                className="h-14 pl-16 bg-[#f8f9fc] rounded-2xl border-2 border-transparent focus:border-[#004aad] focus:bg-white font-medium text-gray-700 text-base placeholder:text-gray-400 transition-all duration-300 disabled:opacity-60"
              />
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`h-14 ${isSubmitting ? 'bg-gray-400/70 cursor-not-allowed' : 'bg-gradient-to-r from-[#004aad] to-[#0066cc] hover:from-[#003d8f] hover:to-[#0055aa]'} rounded-2xl font-bold text-white text-lg tracking-wide shadow-lg shadow-[#004aad]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#004aad]/40 hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5"/>
                  Submit Inquiry
                </>
              )}
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
          <img src="/figmaAssets/PLVLogo.png" alt="PLV Logo" className="h-20 mx-auto" />
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
