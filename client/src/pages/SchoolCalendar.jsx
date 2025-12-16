import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, Menu as MenuIcon, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
const calendarEvents = [
    { date: "Jan 6", event: "Classes Resume", type: "academic" },
    { date: "Jan 15", event: "Enrollment Period Starts", type: "enrollment" },
    { date: "Jan 20-24", event: "University Week", type: "event" },
    { date: "Jan 25", event: "Scholarship Deadline", type: "deadline" },
    { date: "Feb 1", event: "Last Day of Enrollment", type: "enrollment" },
    { date: "Feb 14", event: "Valentine's Day (No Classes)", type: "holiday" },
    { date: "Feb 25", event: "EDSA Anniversary (Holiday)", type: "holiday" },
    { date: "Mar 10-14", event: "Midterm Examinations", type: "exam" },
    { date: "Mar 28", event: "Maundy Thursday (Holiday)", type: "holiday" },
    { date: "Mar 29", event: "Good Friday (Holiday)", type: "holiday" },
];
const getTypeColor = (type) => {
    switch (type) {
        case "academic": return "bg-[#004aad]";
        case "enrollment": return "bg-green-500";
        case "event": return "bg-purple-500";
        case "deadline": return "bg-red-500";
        case "holiday": return "bg-[#ffc300]";
        case "exam": return "bg-orange-500";
        default: return "bg-gray-500";
    }
};
const getTypeLabel = (type) => {
    switch (type) {
        case "academic": return "Academic";
        case "enrollment": return "Enrollment";
        case "event": return "Event";
        case "deadline": return "Deadline";
        case "holiday": return "Holiday";
        case "exam": return "Exam";
        default: return type;
    }
};
export const SchoolCalendar = () => {
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

        <h1 className="font-bold text-[#004aad] text-xl">School Calendar</h1>

        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <MenuIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>
      </header>

      {/* Legend */}
      <div className="relative z-10 px-5 py-3 flex flex-wrap gap-2">
        {["academic", "enrollment", "event", "deadline", "holiday", "exam"].map((type) => (<div key={type} className="flex items-center gap-1.5 bg-white/80 rounded-full px-2 py-1">
            <div className={`w-2.5 h-2.5 rounded-full ${getTypeColor(type)}`}/>
            <span className="text-xs text-gray-600 capitalize">{getTypeLabel(type)}</span>
          </div>))}
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col px-5 py-4 gap-3">
        {calendarEvents.map((item, index) => (<Card key={index} className="bg-white/95 rounded-2xl border-0 shadow-md overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${getTypeColor(item.type)} rounded-xl flex flex-col items-center justify-center text-white`}>
                  <CalendarIcon className="w-5 h-5 mb-0.5"/>
                  <span className="text-xs font-bold">{item.date.split(" ")[0]}</span>
                  <span className="text-[10px]">{item.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#004aad] text-base">{item.event}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 ${getTypeColor(item.type)} text-white text-xs font-medium rounded-full`}>
                    {getTypeLabel(item.type)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </main>

      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}/>
    </div>);
};
