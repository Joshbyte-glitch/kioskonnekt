import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { X, Settings, LogOut, Home, HelpCircle, Building2, Megaphone, Calendar, FileText } from "lucide-react";

export const Sidebar = ({ isOpen, onClose }) => {
    const [location, setLocation] = useLocation();
    // normalize location (strip trailing slashes)
    const loc = (location || "/").replace(/\/+$/, '') || "/";

    // Accessibility toggles persisted in localStorage
    const [highContrast, setHighContrast] = useState(false);
    const [largeText, setLargeText] = useState(false);

    useEffect(() => {
        try {
            const hc = window.localStorage.getItem("kioskHighContrast") === "1";
            const lt = window.localStorage.getItem("kioskLargeText") === "1";
            setHighContrast(hc);
            setLargeText(lt);
        }
        catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        if (highContrast) document.documentElement.classList.add("high-contrast");
        else document.documentElement.classList.remove("high-contrast");
        try { window.localStorage.setItem("kioskHighContrast", highContrast ? "1" : "0"); }
        catch { }
    }, [highContrast]);

    useEffect(() => {
        if (largeText) document.documentElement.classList.add("large-text");
        else document.documentElement.classList.remove("large-text");
        try { window.localStorage.setItem("kioskLargeText", largeText ? "1" : "0"); }
        catch { }
    }, [largeText]);

    const navItems = [
        { icon: Home, label: "Menu", path: "/menu" },
        { icon: HelpCircle, label: "FAQs", path: "/faqs" },
        { icon: Building2, label: "Directory", path: "/directory" },
        { icon: Megaphone, label: "Announcements", path: "/announcements" },
        { icon: Calendar, label: "School Calendar", path: "/calendar" },
        { icon: FileText, label: "Submit Inquiry", path: "/inquiry" },
    ];

    const handleNavigation = (path) => {
        onClose();
        setLocation(path);
    };

    return (<>
      {/* Overlay */}
      {isOpen && (<div className="fixed inset-0 bg-black/30 z-30" onClick={onClose}/>) }

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-64 bg-[#004aad] shadow-2xl z-40 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <X className="w-5 h-5 text-white"/>
        </button>

        <div className="flex flex-col gap-2 p-6 pt-16">
          {navItems.map((item) => {
            const p = (item.path || "/").replace(/\/+$/, '') || "/";
            // Hide the item that corresponds to the current view
            if (p === loc) return null;
            const Icon = item.icon;
            return (<button key={item.path} onClick={() => handleNavigation(item.path)} className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
              <Icon className="w-6 h-6"/>
              <span className="font-medium">{item.label}</span>
            </button>);
          })}

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="mb-2 text-sm text-white/90 font-medium">Accessibility</div>
            <button onClick={() => setHighContrast((v) => !v)} className="flex items-center justify-between w-full gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
              <div className="flex items-center gap-3"><Settings className="w-6 h-6"/><span className="font-medium">High contrast</span></div>
              <div className={`w-10 h-6 rounded-full flex items-center p-1 ${highContrast ? 'justify-end bg-white/40' : 'justify-start bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white`} />
              </div>
            </button>

            <button onClick={() => setLargeText((v) => !v)} className="flex items-center justify-between w-full gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors mt-2">
              <div className="flex items-center gap-3"><span className="w-6 h-6 flex items-center justify-center text-white font-bold">A</span><span className="font-medium">Large text</span></div>
              <div className={`w-10 h-6 rounded-full flex items-center p-1 ${largeText ? 'justify-end bg-white/40' : 'justify-start bg-white/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white`} />
              </div>
            </button>

            <button onClick={() => { onClose(); setLocation('/'); }} className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors w-full mt-4">
              <LogOut className="w-6 h-6"/>
              <span className="font-medium">Exit</span>
            </button>
          </div>
        </div>      </div>
    </>);
};
