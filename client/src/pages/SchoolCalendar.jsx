import React, { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { ArrowLeftIcon, Menu as MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sidebar } from "@/components/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

/* =========================
   EVENT DATA
========================= */

const calendarEvents = [
  {
    date: "Dec 3",
    event: "Last Day of Classes",
    type: "academic",
    description: "Wrap up of term lectures. Submit any outstanding assignments.",
  },
  {
    date: "Dec 10-12",
    event: "Final Examinations",
    type: "exam",
    description: "Final exams across departments. Check your schedule and room assignments.",
  },
  {
    date: "Dec 18",
    event: "Graduation Ceremony",
    type: "event",
    description: "University commencement ceremony for graduating students.",
  },
  {
    date: "Dec 20-31",
    event: "Winter Break",
    type: "holiday",
    description: "Campus offices closed for the holidays.",
  },
];

/* =========================
   COLORS & PRIORITY
========================= */

const TYPE_COLORS = {
  academic: "#004aad",
  enrollment: "#16a34a",
  event: "#8b5cf6",
  deadline: "#dc2626",
  holiday: "#ffc300",
  exam: "#fb923c",
};

const TYPE_PRIORITY = {
  holiday: 5,
  exam: 4,
  deadline: 3,
  academic: 2,
  event: 1,
  enrollment: 0,
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

/* =========================
   EVENT PARSER
========================= */

function parseEventsToMap(events) {
  const map = {};
  const year = new Date().getFullYear();
  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  for (const ev of events) {
    const [monStr, dayStr] = ev.date.split(" ");
    const month = months[monStr];
    if (month === undefined) continue;

    if (dayStr.includes("-")) {
      const [start, end] = dayStr.split("-").map(Number);
      for (let d = start; d <= end; d++) {
        const dt = new Date(year, month, d);
        const key = dt.toISOString().slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(ev);
      }
    } else {
      const d = parseInt(dayStr, 10);
      const dt = new Date(year, month, d);
      const key = dt.toISOString().slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
  }
  return map;
}

/* =========================
   COMPONENT
========================= */

export const SchoolCalendar = () => {
  const [, setLocation] = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [month, setMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const eventsMap = useMemo(
    () => parseEventsToMap(calendarEvents),
    []
  );

  /* =========================
     CUSTOM DAY CONTENT
  ========================= */

  const DayContent = ({ date }) => {
    const key = date.toISOString().slice(0, 10);
    const events = eventsMap[key] || [];

    const primary = events
      .slice()
      .sort((a, b) => TYPE_PRIORITY[b.type] - TYPE_PRIORITY[a.type])[0];

    const bgColor = primary ? TYPE_COLORS[primary.type] : null;
    const isHoliday = primary?.type === "holiday";

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {bgColor && (
          <div
            className="absolute inset-1 rounded-md opacity-25"
            style={{ backgroundColor: bgColor }}
          />
        )}

        <div className="relative z-10 flex flex-col items-center">
          <span
            className="text-sm font-medium"
            style={{ color: isHoliday ? "#111" : "#004aad" }}
          >
            {date.getDate()}
          </span>

          <div className="flex gap-1 mt-1">
            {events.slice(0, 3).map((e, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[e.type] }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const selectedEvents = selectedDate
    ? eventsMap[selectedDate.toISOString().slice(0, 10)] || []
    : [];

  /* =========================
     UI
  ========================= */

  return (
    <div className="w-full min-h-screen relative flex flex-col overflow-hidden">
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src="/figmaAssets/plv-background.png"
        alt="PLV Background"
      />
      <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between p-4 bg-white/80 backdrop-blur-md shadow-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/menu")}
          className="h-12 w-12 bg-[#004aad]/10 rounded-xl"
        >
          <ArrowLeftIcon className="w-6 h-6 text-[#004aad]" />
        </Button>

        <h1 className="font-bold text-[#004aad] text-xl">
          School Calendar
        </h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSidebar(true)}
          className="h-12 w-12 bg-[#004aad]/10 rounded-xl"
        >
          <MenuIcon className="w-6 h-6 text-[#004aad]" />
        </Button>
      </header>

      {/* LEGEND */}
      <div className="relative z-10 px-5 py-3 flex flex-wrap gap-3">
        {Object.keys(TYPE_COLORS).map((type) => (
          <div
            key={type}
            className="flex items-center gap-2 bg-white/80 rounded-full px-3 py-2"
          >
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            />
            <span className="text-sm text-gray-600">
              {getTypeLabel(type)}
            </span>
          </div>
        ))}
      </div>

      {/* CALENDAR */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-5 py-6 gap-6">
        <Card className="bg-white/95 rounded-2xl border-0 shadow-md w-full max-w-2xl">
          <CardContent className="p-6 flex justify-center">
            <Calendar
              month={month}
              onMonthChange={setMonth}
              onDayClick={setSelectedDate}
              showOutsideDays={false}
              components={{ DayContent }}
              classNames={{
                row: "flex justify-center mt-2",
                cell: "h-20 w-20 p-0",
                day: "h-20 w-20 p-0 relative",
              }}
            />
          </CardContent>
        </Card>

        {/* SELECTED EVENTS */}
        <div className="w-full max-w-3xl">
          <Card className="bg-white/95 rounded-2xl border-0 shadow-md">
            <CardContent className="p-4">
              <h3 className="font-semibold text-[#004aad]">
                {selectedDate
                  ? format(selectedDate, "MMMM d, yyyy")
                  : "Select a date"}
              </h3>

              <div className="mt-3">
                {selectedEvents.length === 0 ? (
                  <p className="text-sm text-gray-600">
                    No events for this date.
                  </p>
                ) : (
                  selectedEvents.map((e, i) => (
                    <div key={i} className="flex gap-3 mb-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full mt-1"
                        style={{ backgroundColor: TYPE_COLORS[e.type] }}
                      />
                      <div>
                        <div className="font-medium text-[#004aad]">
                          {e.event}
                        </div>
                        <div className="text-xs text-gray-500">
                          {e.date}
                        </div>
                        {e.description && (
                          <div className="text-sm text-gray-700 mt-1">
                            {e.description}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Sidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
      />
    </div>
  );
};
