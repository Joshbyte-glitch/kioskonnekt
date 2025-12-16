import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, Menu as MenuIcon, Megaphone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
const announcementsData = [
    {
        title: "Enrollment for 2nd Semester Now Open",
        date: "January 15, 2025",
        content: "Online enrollment for the 2nd semester is now open. Please check your enrollment schedule and prepare the necessary documents.",
        urgent: true
    },
    {
        title: "University Week Celebration",
        date: "January 20, 2025",
        content: "Join us in celebrating PLV's founding anniversary! Various activities and competitions await all students.",
        urgent: false
    },
    {
        title: "Library Extended Hours",
        date: "January 18, 2025",
        content: "The library will have extended hours from 7AM to 9PM during finals week to accommodate students' study needs.",
        urgent: false
    },
    {
        title: "Scholarship Application Deadline",
        date: "January 25, 2025",
        content: "Reminder: The deadline for scholarship applications is approaching. Submit your requirements before the deadline.",
        urgent: true
    }
];
export const Announcements = () => {
    const [, setLocation] = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);
    return (<div className="w-full min-h-screen relative flex flex-col overflow-hidden">
      {/* PLV Background */}
      <img className="absolute inset-0 w-full h-full object-cover" alt="PLV Background" src="/figmaAssets/plv-background.png"/>
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"/>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-md">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/menu")} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <ArrowLeftIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>

        <h1 className="font-bold text-[#004aad] text-2xl">Announcements</h1>

        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <MenuIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col px-5 py-6 gap-4">
        {announcementsData.map((item, index) => (<Card key={index} className={`bg-white/95 rounded-2xl border-0 shadow-lg overflow-hidden ${item.urgent ? 'border-l-4 border-l-[#ffc300]' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${item.urgent ? 'bg-[#ffc300]' : 'bg-[#004aad]'} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Megaphone className={`w-6 h-6 ${item.urgent ? 'text-[#004aad]' : 'text-white'}`}/>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {item.urgent && (<span className="px-2 py-0.5 bg-[#ffc300] text-[#004aad] text-xs font-bold rounded-full">
                        URGENT
                      </span>)}
                  </div>
                  <h3 className="font-bold text-[#004aad] text-base mb-1">{item.title}</h3>
                  <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                    <Calendar className="w-3 h-3"/>
                    <span>{item.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </main>

      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}/>
    </div>);
};
