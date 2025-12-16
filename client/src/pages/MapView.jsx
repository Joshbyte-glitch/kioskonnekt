import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// MapView with slideshow support
// Props:
// - office: { name, floor, description, mapImages?: string[] }
// - onClose: callback when user wants to go back
// NOTES:
// - To change slides for an office, update `mapImages` in `Directory.jsx`.
// - Images should be placed under `/client/public/figmaAssets/maps/` and
//   referenced like `/figmaAssets/maps/office-1.png`.
// - Autoplay interval can be changed in AUTOPLAY_MS constant below.
export default function MapView({ office, onClose }) {
  if (!office) return null;

  // slides: support either `office.mapImages` (preferred) or fall back to `mapImage`
  const slides = office.mapImages && office.mapImages.length > 0 ? office.mapImages : (office.mapImage ? [office.mapImage] : []);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const AUTOPLAY_MS = 4000; // change autoplay timing here (ms)
  const autoplayRef = useRef(null);

  // autoplay effect (stop when last slide is reached)
  useEffect(() => {
    if (slides.length <= 1) return;
    if (isPaused) return;
    autoplayRef.current = setInterval(() => {
      setIndex((i) => {
        if (i + 1 < slides.length) {
          return i + 1;
        } else {
          // reached last slide: stop autoplay and pause
          clearInterval(autoplayRef.current);
          setIsPaused(true);
          return i;
        }
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(autoplayRef.current);
  }, [isPaused, slides.length]);

  // keyboard navigation and escape to close (no wrapping)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") {
        setIndex((i) => {
          const ni = i > 0 ? i - 1 : i;
          if (ni < slides.length - 1) setIsPaused(false);
          return ni;
        });
      }
      if (e.key === "ArrowRight") {
        setIndex((i) => {
          const ni = i + 1 < slides.length ? i + 1 : i;
          if (ni === slides.length - 1) {
            // reached last slide; stop autoplay
            setIsPaused(true);
            clearInterval(autoplayRef.current);
          }
          return ni;
        });
      }
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length, onClose]);

  if (!slides || slides.length === 0) return null;

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      {/* stop clicks inside modal from closing */}
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-6xl bg-white/95 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-2xl font-bold text-[#004aad]">{office.name}</h2>
            <p className="text-sm text-gray-600">{office.floor}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 bg-[#004aad]/10 rounded-lg">
              <X className="w-5 h-5 text-[#004aad]" />
            </Button>
          </div>
        </div>

        <div className="p-6 flex flex-col items-center gap-6">
          {/* Description */}
          <p className="max-w-3xl text-center text-base text-gray-700">{office.description}</p>

          {/* Slideshow container */}
          <div className="w-full flex flex-col items-center">
            <div
              className="relative w-full rounded-2xl overflow-hidden shadow-lg"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              style={{ maxHeight: "72vh" }}
            >
              {/* Slides: use absolute positioned images and fade between them */}
              {slides.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${office.name} map ${i + 1}`}
                  className={`absolute inset-0 w-full h-auto mx-auto transition-opacity duration-500 object-contain ${i === index ? "opacity-100 relative z-10" : "opacity-0"}`}
                  style={{ display: i === index ? "block" : "block" }}
                />
              ))}

              {/* Prev/Next buttons (visible for >1 slides) */}
              {slides.length > 1 && (
                <>
                  <button
                    aria-label="Previous"
                    onClick={() => setIndex((i) => {
                      const ni = Math.max(0, i - 1);
                      if (ni < slides.length - 1) setIsPaused(false);
                      return ni;
                    })}
                    disabled={index === 0}
                    className={`absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 shadow rounded-full p-2 ${index === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'}`}
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    <ChevronLeft className="w-6 h-6 text-[#004aad]" />
                  </button>
                  <button
                    aria-label="Next"
                    onClick={() => setIndex((i) => {
                      const ni = Math.min(slides.length - 1, i + 1);
                      if (ni === slides.length - 1) {
                        setIsPaused(true);
                        clearInterval(autoplayRef.current);
                      } else {
                        setIsPaused(false);
                      }
                      return ni;
                    })}
                    disabled={index === slides.length - 1}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 shadow rounded-full p-2 ${index === slides.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'}`}
                    style={{ backdropFilter: "blur(6px)" }}
                  >
                    <ChevronRight className="w-6 h-6 text-[#004aad]" />
                  </button> 
                </>
              )}
            </div>

            {/* Pagination dots */}
            {slides.length > 1 && (
              <div className="flex items-center gap-3 mt-4">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIndex(i);
                      if (i === slides.length - 1) {
                        setIsPaused(true);
                        clearInterval(autoplayRef.current);
                      } else {
                        setIsPaused(false);
                      }
                    }}
                    className={`w-3 h-3 rounded-full ${i === index ? "bg-[#004aad]" : "bg-gray-300"}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer / Legend */}
          <div className="w-full max-w-3xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3.5 h-3.5 rounded-full bg-[#004aad]" />
              <span className="text-sm text-gray-600">Route / Direction</span>
            </div>
            <div className="text-sm text-gray-500">Tap outside or use the X button to close</div>
          </div>
        </div>
      </div>
    </div>
  );
}
