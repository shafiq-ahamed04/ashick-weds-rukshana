import React from 'react';

export default function GoldDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 my-2 w-full max-w-xs mx-auto ${className}`} aria-hidden="true">
      {/* Left hairline with gradient fade */}
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A24B] to-[#C9A24B]/80" />

      {/* Ornamental Centerpiece */}
      <div className="flex items-center gap-1 text-[#C9A24B]">
        <span className="w-1 h-1 rounded-full bg-[#E3C98A] shadow-[0_0_6px_#C9A24B]" />
        <svg
          className="w-4 h-4 text-[#C9A24B] filter drop-shadow-[0_0_4px_rgba(201,162,75,0.6)]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          {/* Symmetrical 8-point Islamic star / Moroccan floral motif */}
          <path d="M12 2L14.2 8.3L20.5 6.1L17.3 12L22 15.3L15.7 16.5L14.5 22.8L12 17.5L9.5 22.8L8.3 16.5L2 15.3L6.7 12L3.5 6.1L9.8 8.3L12 2Z" />
        </svg>
        <span className="w-1 h-1 rounded-full bg-[#E3C98A] shadow-[0_0_6px_#C9A24B]" />
      </div>

      {/* Right hairline with gradient fade */}
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C9A24B] to-[#C9A24B]/80" />
    </div>
  );
}
