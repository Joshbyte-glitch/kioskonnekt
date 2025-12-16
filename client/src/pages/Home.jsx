import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export const Home = () => {
  const [, setLocation] = useLocation();

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt="PLV Background"
        src="/figmaAssets/plv-background.png"
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Centered Card (solid, not transparent) */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-white/80 overflow-hidden flex flex-col items-center py-10 px-6">
          {/* Logo */}
          <img
            src="/figmaAssets/frame-9.svg"
            alt="PLV Logo"
            className="w-32 h-32 mb-6 rounded-3xl shadow-lg"
          />

          {/* Title & Tagline */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-extrabold text-[#004aad] mb-1">
              KiosKonnekt
            </h1>
            <p className="text-sm italic text-gray-600">
              "Your all-in-one campus information kiosk"
            </p>
          </div>

          {/* Call to Action */}
          <Button
            className="h-12 w-full max-w-xs bg-[#004aad] hover:bg-[#003580] rounded-full font-semibold text-white text-sm tracking-wide shadow-lg border-2 border-[#ffc300]"
            onClick={() => setLocation("/login")}
          >
            Explore Services
          </Button>
        </div>
      </main>
    </div>
  );
};


