import React from "react";
import { useLocation } from "wouter";
import { X, Settings, LogOut, Home } from "lucide-react";
export const Sidebar = ({ isOpen, onClose }) => {
    const [, setLocation] = useLocation();
    const handleNavigation = (path) => {
        onClose();
        setLocation(path);
    };
    return (<>
      {/* Overlay */}
      {isOpen && (<div className="fixed inset-0 bg-black/30 z-30" onClick={onClose}/>)}

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-64 bg-[#004aad] shadow-2xl z-40 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
          <X className="w-5 h-5 text-white"/>
        </button>

        <div className="flex flex-col gap-2 p-6 pt-16">
          <button onClick={() => handleNavigation("/")} className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
            <Home className="w-6 h-6"/>
            <span className="font-medium">Home</span>
          </button>
          <button className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
            <Settings className="w-6 h-6"/>
            <span className="font-medium">Accessibility</span>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 text-white hover:bg-white/10 p-3 rounded-xl transition-colors">
            <LogOut className="w-6 h-6"/>
            <span className="font-medium">Exit</span>
          </button>
        </div>
      </div>
    </>);
};
