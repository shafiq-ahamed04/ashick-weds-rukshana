import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';
import FloralFrame from '../components/FloralFrame';
import { downloadICS } from '../utils/ics';
import { Calendar, Plus, Minus, Send, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function SaveDateRsvpSection() {
  const sectionRef = useRef(null);
  const floralRef = useRef(null);

  // RSVP Form State
  const [name, setName] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [attendingNikah, setAttendingNikah] = useState(true);
  const [attendingWalima, setAttendingWalima] = useState(true);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [downloadSuccess, setDownloadSuccess] = useState('');

  const rsvp = wedding.rsvp;
  const whatsappNumber = rsvp.whatsapp || wedding.whatsapp;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.rsvp-stagger-item',
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        gsap.to(floralRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      } else {
        gsap.set('.rsvp-stagger-item', { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleDownload = (keys, filename, label) => {
    downloadICS(keys, filename);
    setDownloadSuccess(label);
    setTimeout(() => setDownloadSuccess(''), 3000);
  };

  const handleWhatsAppRSVP = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Please provide your full name.';
    }

    if (!attendingNikah && !attendingWalima) {
      newErrors.events = 'Please select at least one event to attend.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const eventsAttending = [];
    if (attendingNikah) eventsAttending.push('Nikah');
    if (attendingWalima) eventsAttending.push('Walima');
    const eventsStr = eventsAttending.join(' and ');

    const guestsText = guestCount === 1 ? '1 guest' : `${guestCount} guests`;
    const optionalMsg = message.trim() ? ` "${message.trim()}"` : '';

    const waText = `Assalamu alaikum! This is ${name.trim()}. I will attend the ${eventsStr} with ${guestsText}.${optionalMsg}`;

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      style={{
        background: 'linear-gradient(180deg, #FBE6EE 0%, #F5CAD8 35%, #E4D7F2 75%, #D4C1EA 100%)',
      }}
      aria-label="Save The Dates and RSVP"
    >
      {/* FLORAL FRAMING WITH PARALLAX */}
      <div ref={floralRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        <FloralFrame />
      </div>

      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* =========================================
            PART 1: SAVE THE DATES
        ========================================= */}
        <div className="rsvp-stagger-item w-full mb-12 sm:mb-14 text-center">
          <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold mb-2 block">
            With All Our Love
          </span>

          <h2 className="font-display font-bold text-[clamp(34px,7.5vw,60px)] text-[#3E1A36] leading-[1.15] my-1 drop-shadow-sm">
            Will you join us?
          </h2>

          <div className="my-2">
            <GoldDivider />
          </div>

          <p className="font-body font-medium italic text-lg sm:text-[19px] text-[#5B2A4E] leading-[1.6] max-w-md mx-auto mb-6">
            Together with our families, we invite you to celebrate our beginning.
          </p>

          {/* Three Gold Pill Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleDownload(['nikah'], 'nikah.ics', 'Nikah')}
              className="min-h-[44px] px-5 py-2.5 rounded-full border-2 border-[#C9A24B] bg-[#FFF8F3]/90 text-[#3E1A36] font-label text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold hover:bg-[#E3C98A]/30 active:scale-95 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Save the Nikah</span>
            </button>

            <button
              onClick={() => handleDownload(['walima'], 'walima.ics', 'Walima')}
              className="min-h-[44px] px-5 py-2.5 rounded-full border-2 border-[#C9A24B] bg-[#FFF8F3]/90 text-[#3E1A36] font-label text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold hover:bg-[#E3C98A]/30 active:scale-95 transition-all shadow-sm hover:shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>Save the Walima</span>
            </button>

            <button
              onClick={() => handleDownload(['nikah', 'walima'], 'nikah-walima.ics', 'Both Events')}
              className="min-h-[44px] px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C9A24B] to-[#E3C98A] text-[#3E1A36] font-label text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#3E1A36]" />
              <span>Save both</span>
            </button>
          </div>

          {downloadSuccess && (
            <p className="mt-3 text-sm font-body italic text-[#5B2A4E] font-medium flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 text-[#8A6414]" />
              <span>{downloadSuccess} calendar invite (.ics) downloaded!</span>
            </p>
          )}
        </div>

        {/* =========================================
            PART 2: RSVP BY WHATSAPP CARD
        ========================================= */}
        <div className="rsvp-stagger-item w-full max-w-md bg-[#FFF8F3]/95 backdrop-blur-md rounded-[2.2rem] p-6 sm:p-9 border border-[#E3C98A]/60 shadow-[0_15px_45px_rgba(62,26,54,0.18)] text-left">
          <div className="text-center mb-5">
            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold block mb-1">
              Kindly Respond
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#3E1A36]">
              RSVP by WhatsApp
            </h3>
            {rsvp.deadline && rsvp.deadline.trim() !== '' && (
              <p className="font-label text-xs tracking-wider text-[#5B2A4E] uppercase mt-1">
                RSVP Deadline: {rsvp.deadline}
              </p>
            )}
          </div>

          <form onSubmit={handleWhatsAppRSVP} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="rsvp-name" className="block font-label text-xs sm:text-[13px] tracking-wider text-[#5B2A4E] uppercase font-bold mb-1">
                Your Full Name <span className="text-[#5B2A4E]">*</span>
              </label>
              <input
                id="rsvp-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="Enter your name"
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#C9A24B]/40 text-[#3E1A36] text-base placeholder-[#5B2A4E]/40 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] transition-all"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[#5B2A4E] font-medium italic">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Guest Count Stepper */}
            <div>
              <label className="block font-label text-xs sm:text-[13px] tracking-wider text-[#5B2A4E] uppercase font-bold mb-1">
                Number of Guests
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                  disabled={guestCount <= 1}
                  className="w-11 h-11 rounded-xl border border-[#C9A24B]/50 bg-white/80 text-[#3E1A36] flex items-center justify-center disabled:opacity-40 hover:bg-[#FBE6EE] active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px]"
                  aria-label="Decrease guest count"
                >
                  <Minus className="w-4 h-4 text-[#5B2A4E]" />
                </button>

                <div className="flex-1 min-h-[44px] rounded-xl bg-white border border-[#C9A24B]/40 flex items-center justify-center font-body text-xl font-bold text-[#3E1A36] tabular-nums">
                  {guestCount} {guestCount === 1 ? 'Guest' : 'Guests'}
                </div>

                <button
                  type="button"
                  onClick={() => setGuestCount((prev) => Math.min(10, prev + 1))}
                  disabled={guestCount >= 10}
                  className="w-11 h-11 rounded-xl border border-[#C9A24B]/50 bg-white/80 text-[#3E1A36] flex items-center justify-center disabled:opacity-40 hover:bg-[#FBE6EE] active:scale-95 transition-all cursor-pointer min-h-[44px] min-w-[44px]"
                  aria-label="Increase guest count"
                >
                  <Plus className="w-4 h-4 text-[#5B2A4E]" />
                </button>
              </div>
            </div>

            {/* Attending Event Checkboxes */}
            <div>
              <label className="block font-label text-xs sm:text-[13px] tracking-wider text-[#5B2A4E] uppercase font-bold mb-1.5">
                Attending Events <span className="text-[#5B2A4E]">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-3 rounded-xl border border-[#C9A24B]/35 bg-white cursor-pointer hover:bg-white/90 transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={attendingNikah}
                    onChange={(e) => {
                      setAttendingNikah(e.target.checked);
                      if (errors.events) setErrors((prev) => ({ ...prev, events: null }));
                    }}
                    className="w-4 h-4 text-[#C9A24B] rounded focus:ring-[#C9A24B] accent-[#C9A24B]"
                  />
                  <span className="font-body text-base font-semibold text-[#3E1A36]">Nikah Ceremony</span>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl border border-[#C9A24B]/35 bg-white cursor-pointer hover:bg-white/90 transition-colors min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={attendingWalima}
                    onChange={(e) => {
                      setAttendingWalima(e.target.checked);
                      if (errors.events) setErrors((prev) => ({ ...prev, events: null }));
                    }}
                    className="w-4 h-4 text-[#C9A24B] rounded focus:ring-[#C9A24B] accent-[#C9A24B]"
                  />
                  <span className="font-body text-base font-semibold text-[#3E1A36]">Walima Reception</span>
                </label>
              </div>
              {errors.events && (
                <p className="mt-1 text-xs text-[#5B2A4E] font-medium italic">
                  {errors.events}
                </p>
              )}
            </div>

            {/* Optional Short Message */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="rsvp-message" className="font-label text-xs sm:text-[13px] tracking-wider text-[#5B2A4E] uppercase font-bold">
                  Dua or Note (Optional)
                </label>
                <span className="text-xs text-[#5B2A4E]/60 tabular-nums">
                  {message.length}/200
                </span>
              </div>
              <textarea
                id="rsvp-message"
                rows="2"
                maxLength={200}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your prayers or wishes..."
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#C9A24B]/40 text-[#3E1A36] text-base placeholder-[#5B2A4E]/40 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full min-h-[44px] py-3 px-6 rounded-full bg-gradient-to-r from-[#5B2A4E] to-[#3E1A36] text-[#FFF8F3] font-label text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(91,42,78,0.35)] hover:shadow-[0_6px_22px_rgba(91,42,78,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-2"
            >
              <Send className="w-3.5 h-3.5 text-[#E3C98A]" />
              <span>Send RSVP on WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
