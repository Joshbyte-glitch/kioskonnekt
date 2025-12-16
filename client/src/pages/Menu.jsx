import React, { useState } from "react";
import { useLocation } from "wouter";
import { X, Settings, LogOut, HelpCircle, Building2, Megaphone, Calendar, FileText, Menu as MenuIcon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
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
            Main Menu
          </h1>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-md">
            {menuItems.slice(0, 3).map((item, index) => (<button key={index} onClick={() => setLocation(item.path)} className="flex flex-col items-center gap-2 group">
                <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center shadow-lg border-2 border-[#ffc300] group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-10 h-10 text-white"/>
                </div>
                <span className="text-[#004aad] font-semibold text-sm text-center drop-shadow">
                  {item.label}
                </span>
              </button>))}
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mt-4">
            {menuItems.slice(3).map((item, index) => (<button key={index} onClick={() => setLocation(item.path)} className="flex flex-col items-center gap-2 group">
                <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center shadow-lg border-2 border-[#ffc300] group-hover:scale-105 transition-transform`}>
                  <item.icon className="w-10 h-10 text-white"/>
                </div>
                <span className="text-[#004aad] font-semibold text-sm text-center drop-shadow">
                  {item.label}
                </span>
              </button>))}
          </div>
        </div>

        {/* Sidebar Overlay */}
        {showSidebar && (<div className="fixed inset-0 bg-black/30 z-30" onClick={() => setShowSidebar(false)}/>)}

        {/* Sidebar */}
        <div className={`fixed right-0 top-0 h-full w-64 bg-[#004aad] shadow-2xl z-40 flex flex-col transform transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}>
          <button onClick={() => setShowSidebar(false)} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <X className="w-5 h-5 text-white"/>
          </button>

          <div className="flex flex-col gap-4 p-6 pt-16">
            <button
              onClick={() => {
                setShowSidebar(false);
                setLocation("/menu");
              }}
              className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors"
            >
              <Home className="w-6 h-6"/>
              <span className="font-medium">Home</span>
            </button>
            <button className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
              <Settings className="w-6 h-6"/>
              <span className="font-medium">Accessibility</span>
            </button>
            <button
              onClick={() => {
                setShowSidebar(false);
                setLocation("/");
              }}
              className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors"
            >
              <LogOut className="w-6 h-6"/>
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </main>
    </div>);
};
