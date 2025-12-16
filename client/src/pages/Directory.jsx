import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, Menu as MenuIcon, Building2, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
const directoryData = [
    {
        name: "Registrar's Office",
        location: "Main Building, Ground Floor",
        phone: "(02) 8292-0246",
        email: "registrar@plv.edu.ph"
    },
    {
        name: "Student Affairs Office",
        location: "Main Building, 2nd Floor",
        phone: "(02) 8292-0247",
        email: "studentaffairs@plv.edu.ph"
    },
    {
        name: "Accounting Office",
        location: "Admin Building, Room 101",
        phone: "(02) 8292-0248",
        email: "accounting@plv.edu.ph"
    },
    {
        name: "Library",
        location: "Library Building, All Floors",
        phone: "(02) 8292-0249",
        email: "library@plv.edu.ph"
    },
    {
        name: "Guidance Office",
        location: "Student Center, Room 201",
        phone: "(02) 8292-0250",
        email: "guidance@plv.edu.ph"
    }
];
export const Directory = () => {
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

        <h1 className="font-bold text-[#004aad] text-2xl">Directory</h1>

        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <MenuIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col px-5 py-6 gap-4">
        {directoryData.map((item, index) => (<Card key={index} className="bg-white/95 rounded-2xl border-0 shadow-lg overflow-hidden">
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
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4 text-[#ffc300]"/>
                      <span>{item.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-[#ffc300]"/>
                      <span>{item.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>))}
      </main>

      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}/>
    </div>);
};
