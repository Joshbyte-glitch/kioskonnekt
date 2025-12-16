import React from "react";
export const PLVLogo = ({ size = "md", className = "" }) => {
    const sizes = {
        sm: { outer: "w-12 h-12", inner: "w-8 h-8", text: "text-[10px]", vText: "text-lg" },
        md: { outer: "w-20 h-20", inner: "w-14 h-14", text: "text-[8px]", vText: "text-2xl" },
        lg: { outer: "w-32 h-32", inner: "w-24 h-24", text: "text-xs", vText: "text-4xl" },
    };
    const s = sizes[size];
    return (<div className={`relative ${s.outer} ${className}`}>
      {/* Outer yellow circle with blue border */}
      <div className={`${s.outer} rounded-full bg-[#ffc300] border-4 border-[#004aad] flex items-center justify-center shadow-lg`}>
        {/* Inner blue circle */}
        <div className={`${s.inner} rounded-full bg-[#004aad] flex flex-col items-center justify-center relative`}>
          {/* PLV Text arranged around V */}
          <div className="flex flex-col items-center justify-center">
            {/* Top arc text - PAMANTASAN NG LUNGSOD NG */}
            <span className={`text-white ${s.text} font-semibold tracking-wider absolute -top-0.5`} style={{ fontSize: size === 'lg' ? '7px' : '5px' }}>
              PAMANTASAN NG LUNGSOD NG
            </span>
            
            {/* Center V with torch design */}
            <div className="flex flex-col items-center">
              <div className={`text-[#ffc300] font-bold ${s.vText} leading-none`} style={{ fontFamily: 'serif' }}>
                V
              </div>
              {/* Torch flame on top of V */}
              <div className="absolute" style={{ top: size === 'lg' ? '20%' : '25%' }}>
                <svg viewBox="0 0 24 24" className={size === 'lg' ? 'w-4 h-4' : size === 'md' ? 'w-3 h-3' : 'w-2 h-2'} fill="#ffc300">
                  <path d="M12 2C10 6 8 8 8 12c0 2.21 1.79 4 4 4s4-1.79 4-4c0-4-2-6-4-10z"/>
                </svg>
              </div>
            </div>
            
            {/* Bottom arc text - VALENZUELA */}
            <span className={`text-white ${s.text} font-semibold tracking-wider absolute -bottom-0.5`} style={{ fontSize: size === 'lg' ? '8px' : '6px' }}>
              VALENZUELA
            </span>
            
            {/* Year 2002 */}
            <span className="text-[#ffc300] absolute bottom-1" style={{ fontSize: size === 'lg' ? '8px' : '5px' }}>
              2002
            </span>
          </div>
        </div>
      </div>
    </div>);
};
