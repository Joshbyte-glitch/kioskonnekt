import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
export const Login = () => {
    const [, setLocation] = useLocation();
    const [name, setName] = useState("");
    return (<div className="w-full min-h-screen relative flex flex-col overflow-hidden">
      {/* PLV Background */}
      <img className="absolute inset-0 w-full h-full object-cover" alt="PLV Background" src="/figmaAssets/plv-background.png"/>
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"/>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-6 pt-8 pb-8">
        {/* PLV Logo */}
        <img
          src="/figmaAssets/frame-9.svg"
          alt="PLV Logo"
          className="w-32 h-32 mb-4 rounded-3xl shadow-lg border-4 border-white/80"
        />

        {/* App Title */}
        <h1 className="font-bold text-[#004aad] text-3xl tracking-tight mb-1">
          KiosKonnekt
        </h1>
        <p className="text-[#004aad]/80 text-sm italic mb-8 text-center">
          "Your all-in-one campus information kiosk"
        </p>

        {/* Login Card */}
        <Card className="w-full max-w-sm bg-white/90 backdrop-blur-xl rounded-3xl border-0 shadow-2xl">
          <CardContent className="p-6 flex flex-col gap-5">
            <div className="text-center mb-2">
              <h2 className="font-bold text-[#004aad] text-xl">Welcome to</h2>
              <h3 className="font-bold text-[#004aad] text-lg">PLV (Main Campus)</h3>
            </div>

            {/* Name Input */}
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="h-12 bg-white rounded-full border-2 border-[#004aad]/50 focus:border-[#004aad] font-medium text-gray-700 text-base placeholder:text-gray-400 px-5"
            />

            {/* Birthday Input */}
            <Input placeholder="BIRTHDAY mm/dd/yyyy" type="text" className="h-12 bg-white rounded-full border-2 border-[#004aad]/50 focus:border-[#004aad] font-medium text-gray-700 text-base placeholder:text-gray-400 px-5"/>

            {/* Login Button */}
            <Button
              onClick={() => {
                const trimmed = name.trim();
                if (!trimmed) {
                  return;
                }
                // Store logged-in name for later use (e.g., inquiry ticket)
                try {
                  window.localStorage.setItem("kioskUserName", trimmed);
                }
                catch {
                  // ignore storage errors
                }
                setLocation("/menu");
              }}
              className="h-12 bg-[#004aad] hover:bg-[#003580] rounded-full font-bold text-white text-lg shadow-lg"
            >
              LOGIN
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>);
};
