import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, Menu as MenuIcon, Building2, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import MapView from "@/pages/MapView"; // Map view modal for static wayfinding maps
// Directory data structure with support for multiple map images per office
// To add a new office: add another object to this array and include `mapImages`.
// Place map images under `/client/public/figmaAssets/maps/` and reference them
// as `/figmaAssets/maps/<your-file>.png`.
const directoryData = [
    {
        name: "Registrar's Office",
        floor: "Student Center Building, 2nd Floor",
        description: "Handles student records, enrollment verification, and transcript requests.",
        // Registrar needs 3 slides to show approach, entrance, and counter
        mapImages: [
            "/Maps/map-floorplan.png",
            "/Maps/GF-Registrar.png",
            "/Maps/SF-Registrar.png",
        ],
    },
    {
        name: "Student Affairs Office",
        floor: "Main Building, 2nd Floor",
        description: "Student support services and campus activities are coordinated here.",
        // Student Affairs needs 2 slides
        mapImages: [
            "/figmaAssets/maps/student_affairs-1.png",
            "/figmaAssets/maps/student_affairs-2.png",
        ],
    },
    {
        name: "Accounting Office",
        floor: "Admin Building, Room 101",
        description: "Payments, cashiering, and financial inquiries are handled by this office.",
        // single slide
        mapImages: ["/figmaAssets/maps/accounting.png"],
    },
    {
        name: "Main Library",
        floor: "Student Center Building, 5th Floor",
        description: "Campus library with reading rooms and digital resources.",
        mapImages: ["/figmaAssets/maps/library.png"],
    },
    {
        name: "Guidance Office",
        floor: "Student Center, Room 201",
        description: "Counseling and student guidance services.",
        // guidance uses 3 slides
        mapImages: [
            "/figmaAssets/maps/guidance-1.png",
            "/figmaAssets/maps/guidance-2.png",
            "/figmaAssets/maps/guidance-3.png",
        ],
    }
];
export const Directory = () => {
    // Local state-driven navigation: `selectedOffice` holds the office object
    // for which we show the Map View. This uses React state instead of router.
    const [, setLocation] = useLocation();
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    return (<div className="w-full min-h-screen relative flex flex-col overflow-hidden">
      {/* PLV Background */}
      <img className="absolute inset-0 w-full h-full object-cover" alt="PLV Background" src="/figmaAssets/plv-background.png"/>
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm"/>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-md">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/menu")} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <ArrowLeftIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>

        <h1 className="font-bold text-[#004aad] text-2xl">Directory</h1>

        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <MenuIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col px-5 py-6 gap-4">
        {directoryData.map((item, index) => (<Card key={index} className="bg-white/95 rounded-2xl border-0 shadow-lg overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => setSelectedOffice(item)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#004aad] rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-white"/>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#004aad] text-lg mb-2">{item.name}</h3>
                  <div className="flex flex-col gap-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-[#ffc300]"/>
                      <span>{item.floor}</span>
                    </div>
                    <div className="text-gray-600 text-sm">{item.description}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </main>

      {/* Map view is driven by local state; this avoids using routes for navigation */}
      {selectedOffice && <MapView office={selectedOffice} onClose={() => setSelectedOffice(null)} />}


      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}/>
    </div>);
};
