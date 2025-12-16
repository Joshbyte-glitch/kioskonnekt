import React, { useState } from "react";
import { useLocation } from "wouter";
import { X, Settings, LogOut, HelpCircle, Building2, Megaphone, Calendar, FileText, Menu as MenuIcon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
export const Menu = () => {
    const [, setLocation] = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);
    const menuItems = [
        { icon: HelpCircle, label: "FAQs", path: "/faqs", color: "bg-[#004aad]" },
        { icon: Building2, label: "Directory", path: "/directory", color: "bg-[#004aad]" },
        { icon: Megaphone, label: "Announcements", path: "/announcements", color: "bg-[#004aad]" },
        { icon: Calendar, label: "School Calendar", path: "/calendar", color: "bg-[#004aad]" },
        { icon: FileText, label: "Submit Inquiry", path: "/inquiry", color: "bg-[#004aad]" },
    ];
    return (<div className="w-full min-h-screen relative flex flex-col overflow-hidden">
      {/* PLV Background */}
      <img className="absolute inset-0 w-full h-full object-cover" alt="PLV Background" src="/figmaAssets/plv-background.png"/>
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"/>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-white/90 backdrop-blur-md shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="/figmaAssets/frame-9.svg"
            alt="PLV Logo"
            className="w-12 h-12 rounded-2xl shadow-md border-2 border-white"
          />
          <span className="font-bold text-[#004aad] text-xl">KiosKonnekt</span>
        </div>

        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <MenuIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex">
        {/* Menu Grid */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <h1 className="font-bold text-[#004aad] text-3xl mb-8 drop-shadow-lg">
            MAIN MENU
          </h1>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            {menuItems.slice(0, 3).map((item, index) => (<button key={index} onClick={() => setLocation(item.path)} className="flex flex-col items-center gap-3 group">
                <div className={`w-36 h-36 ${item.color} rounded-3xl flex items-center justify-center shadow-2xl border-4 border-[#ffc300] group-hover:scale-105 transition-transform transform-gpu` }>
                  <item.icon className="w-14 h-14 text-white"/>
                </div>
                <span className="text-[#004aad] font-bold text-lg text-center drop-shadow bg-white/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                  {item.label}
                </span>
              </button>))}
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-2xl mt-6">
            {menuItems.slice(3).map((item, index) => (<button key={index} onClick={() => setLocation(item.path)} className="flex flex-col items-center gap-3 group">
                <div className={`w-36 h-36 ${item.color} rounded-3xl flex items-center justify-center shadow-2xl border-4 border-[#ffc300] group-hover:scale-105 transition-transform transform-gpu`}>
                  <item.icon className="w-14 h-14 text-white"/>
                </div>
                <span className="text-[#004aad] font-bold text-lg text-center drop-shadow bg-white/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                  {item.label}
                </span>
              </button>))}
          </div>
        </div>

        {/* Sidebar Overlay */}
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
      </main>
    </div>);
};
