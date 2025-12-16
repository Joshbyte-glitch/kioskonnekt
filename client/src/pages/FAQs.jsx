import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, Menu as MenuIcon, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/Sidebar";
const faqData = [
    {
        question: "How do I enroll for the next semester?",
        answer: "Visit the Registrar's Office or use the online enrollment portal. Make sure to prepare your requirements including previous semester grades and updated ID."
    },
    {
        question: "Where can I get my school ID?",
        answer: "School IDs are processed at the Student Affairs Office located at the Main Building, Ground Floor. Bring 2 1x1 photos and your enrollment receipt."
    },
    {
        question: "How do I request my Transcript of Records?",
        answer: "Submit a request form at the Registrar's Office. Processing takes 5-7 working days. Bring a valid ID and payment for the processing fee."
    },
    {
        question: "What are the library hours?",
        answer: "The library is open Monday to Friday, 8:00 AM to 5:00 PM. Extended hours during exam week: 7:00 AM to 8:00 PM."
    },
    {
        question: "How can I apply for a scholarship?",
        answer: "Visit the Scholarship Office for available programs. Requirements include grades, income certificate, and recommendation letters. Deadline is usually at the start of each semester."
    }
];
export const FAQs = () => {
    const [, setLocation] = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const filteredFAQs = faqData.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    return (<div className="w-full min-h-screen relative flex flex-col overflow-hidden">
      {/* PLV Background */}
      <img className="absolute inset-0 w-full h-full object-cover" alt="PLV Background" src="/figmaAssets/plv-background.png"/>
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"/>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-md">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/menu")} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <ArrowLeftIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>

        <h1 className="font-bold text-[#004aad] text-2xl">FAQs</h1>

        <Button variant="ghost" size="icon" onClick={() => setShowSidebar(true)} className="h-12 w-12 bg-[#004aad]/10 rounded-xl hover:bg-[#004aad]/20">
          <MenuIcon className="w-6 h-6 text-[#004aad]"/>
        </Button>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col px-5 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
          <Input placeholder="Search FAQs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-12 pl-12 bg-white rounded-2xl border-2 border-[#004aad]/30 focus:border-[#004aad] font-medium text-gray-700 shadow-sm"/>
        </div>

        {/* FAQ List */}
        <div className="flex flex-col gap-3">
          {filteredFAQs.map((faq, index) => (<div key={index} className="bg-white/95 rounded-2xl shadow-lg border-l-4 border-[#ffc300] overflow-hidden">
              <button onClick={() => setExpandedIndex(expandedIndex === index ? null : index)} className="w-full p-4 flex items-center justify-between text-left">
                <span className="font-semibold text-[#004aad] text-sm pr-4">
                  {faq.question}
                </span>
                {expandedIndex === index ? (<ChevronUp className="w-5 h-5 text-[#004aad] flex-shrink-0"/>) : (<ChevronDown className="w-5 h-5 text-[#004aad] flex-shrink-0"/>)}
              </button>
              {expandedIndex === index && (<div className="px-4 pb-4 pt-0">
                  <div className="h-px bg-[#004aad]/20 mb-3"/>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>)}
            </div>))}
        </div>

        {filteredFAQs.length === 0 && (<div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-center">No FAQs found matching your search.</p>
          </div>)}
      </main>

      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)}/>
    </div>);
};
