import React from 'react';

/**
 * FloralFrame creates delicate organic botanical framing along viewport corners and edges.
 * Uses realistic petal curves, wisteria cluster silhouettes, and soft bokeh petals.
 */
export default function FloralFrame({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 z-10 overflow-hidden ${className}`} aria-hidden="true">
      {/* TOP-LEFT VINTAGE FLORAL CASCADE */}
      <div className="absolute -top-4 -left-4 w-44 sm:w-60 md:w-72 opacity-85 transition-transform duration-700">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm">
          {/* Hanging Wisteria Sprays */}
          <g opacity="0.8">
            <path d="M30 0 C40 30 35 70 15 105 C22 90 38 65 38 0 Z" fill="#B9A3D6" />
            <ellipse cx="18" cy="110" rx="4" ry="6" fill="#E4D7F2" />
            <ellipse cx="23" cy="95" rx="5" ry="7" fill="#B9A3D6" />
            <ellipse cx="29" cy="78" rx="6" ry="8" fill="#9D84C7" />
            <ellipse cx="34" cy="60" rx="7" ry="10" fill="#B9A3D6" />
            <ellipse cx="38" cy="40" rx="8" ry="11" fill="#E4D7F2" />

            <path d="M65 0 C75 40 60 90 42 130 C50 105 70 70 70 0 Z" fill="#9D84C7" />
            <ellipse cx="44" cy="135" rx="4" ry="6" fill="#E4D7F2" />
            <ellipse cx="49" cy="115" rx="5" ry="8" fill="#B9A3D6" />
            <ellipse cx="58" cy="90" rx="6" ry="9" fill="#9D84C7" />
            <ellipse cx="65" cy="65" rx="7" ry="10" fill="#B9A3D6" />
          </g>

          {/* Golden leaves & olive twigs */}
          <path d="M15 25 C5 38 10 58 25 52 C32 40 28 28 15 25 Z" fill="#C9A24B" opacity="0.7" />
          <path d="M55 15 C48 32 60 48 75 40 C75 25 68 15 55 15 Z" fill="#7A4B6E" opacity="0.55" />
          <path d="M40 55 C25 68 38 88 52 75 C52 62 45 55 40 55 Z" fill="#5B2A4E" opacity="0.6" />

          {/* Organic layered blush rose */}
          <g transform="translate(42, 42)">
            <path
              d="M0 -24 C14 -24 24 -14 24 0 C24 14 14 24 0 24 C-14 24 -24 14 -24 0 C-24 -14 -14 -24 0 -24 Z"
              fill="#F4C6D7"
              opacity="0.9"
            />
            <path
              d="M-3 -18 C8 -22 18 -10 16 2 C14 14 2 18 -8 14 C-18 10 -14 -2 -3 -18 Z"
              fill="#FBE6EE"
            />
            <path
              d="M2 -10 C9 -12 12 -5 10 2 C8 9 2 11 -4 8 C-10 5 -7 -2 2 -10 Z"
              fill="#E8A5BF"
            />
            <circle cx="2" cy="1" r="3.5" fill="#C9A24B" />
          </g>
        </svg>
      </div>

      {/* TOP-RIGHT VINTAGE FLORAL CASCADE */}
      <div className="absolute -top-4 -right-4 w-44 sm:w-60 md:w-72 opacity-85 transition-transform duration-700">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-sm transform -scale-x-100">
          <g opacity="0.8">
            <path d="M30 0 C40 30 35 70 15 105 C22 90 38 65 38 0 Z" fill="#B9A3D6" />
            <ellipse cx="18" cy="110" rx="4" ry="6" fill="#E4D7F2" />
            <ellipse cx="23" cy="95" rx="5" ry="7" fill="#B9A3D6" />
            <ellipse cx="29" cy="78" rx="6" ry="8" fill="#9D84C7" />
            <ellipse cx="34" cy="60" rx="7" ry="10" fill="#B9A3D6" />
            <ellipse cx="38" cy="40" rx="8" ry="11" fill="#E4D7F2" />

            <path d="M65 0 C75 40 60 90 42 130 C50 105 70 70 70 0 Z" fill="#9D84C7" />
            <ellipse cx="44" cy="135" rx="4" ry="6" fill="#E4D7F2" />
            <ellipse cx="49" cy="115" rx="5" ry="8" fill="#B9A3D6" />
            <ellipse cx="58" cy="90" rx="6" ry="9" fill="#9D84C7" />
          </g>

          <g transform="translate(42, 42)">
            <path
              d="M0 -22 C12 -22 22 -12 22 0 C22 12 12 22 0 22 C-12 22 -22 12 -22 0 C-22 -12 -12 -22 0 -22 Z"
              fill="#F4C6D7"
              opacity="0.9"
            />
            <path
              d="M-2 -16 C7 -20 16 -8 14 2 C12 12 1 16 -7 12 C-15 8 -12 -2 -2 -16 Z"
              fill="#FBE6EE"
            />
            <circle cx="1" cy="1" r="3" fill="#C9A24B" />
          </g>
        </svg>
      </div>

      {/* FOREGROUND SOFT BOKEH PETALS (Cinematic Depth of Field) */}
      <div className="absolute bottom-2 left-3 w-32 sm:w-44 filter blur-[2.5px] opacity-75">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="40" cy="80" rx="28" ry="18" fill="#F4C6D7" transform="rotate(-25 40 80)" />
          <ellipse cx="65" cy="90" rx="22" ry="15" fill="#E4D7F2" transform="rotate(15 65 90)" />
          <ellipse cx="25" cy="100" rx="16" ry="10" fill="#FBE6EE" transform="rotate(-40 25 100)" />
        </svg>
      </div>

      <div className="absolute bottom-2 right-3 w-32 sm:w-44 filter blur-[2.5px] opacity-75">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform -scale-x-100">
          <ellipse cx="40" cy="80" rx="28" ry="18" fill="#F4C6D7" transform="rotate(-25 40 80)" />
          <ellipse cx="65" cy="90" rx="22" ry="15" fill="#E4D7F2" transform="rotate(15 65 90)" />
          <ellipse cx="25" cy="100" rx="16" ry="10" fill="#FBE6EE" transform="rotate(-40 25 100)" />
        </svg>
      </div>
    </div>
  );
}
