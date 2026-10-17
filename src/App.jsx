import React, { useState } from 'react';
import IntroSplash from './sections/IntroSplash';
import HeroSection from './sections/HeroSection';
import InvitationSection from './sections/InvitationSection';
import QuranVerseSection from './sections/QuranVerseSection';
import NikahSection from './sections/NikahSection';
import VineConnector from './components/VineConnector';
import WalimaSection from './sections/WalimaSection';
import CoupleDuaSection from './sections/CoupleDuaSection';
import CountdownSection from './sections/CountdownSection';
import SaveDateRsvpSection from './sections/SaveDateRsvpSection';
import ClosingSection from './sections/ClosingSection';
import FloatingPetals from './components/FloatingPetals';
import VintageGrain from './components/VintageGrain';
import { useSmoothScroll } from './hooks/useSmoothScroll';

export default function App() {
  const [isIntroCompleted, setIsIntroCompleted] = useState(false);

  // Lock scroll while intro curtain is active; unlock when intro is completed
  useSmoothScroll(!isIntroCompleted);

  return (
    <main className="relative min-h-screen w-full bg-cream overflow-x-hidden selection:bg-[#F4C6D7] selection:text-[#3E1A36]">
      {/* Cinematic Film-Grain & Paper Texture Overlay */}
      <VintageGrain />

      {/* Floating Petals and Golden Dust Particle Atmosphere */}
      <FloatingPetals count={26} dustCount={32} />

      {/* Intro Splash Screen (Curtain split & monogram stroke animation) */}
      <IntroSplash onOpen={() => setIsIntroCompleted(true)} />

      {/* Section 1: Hero Section (Arched pavilion, Bismillah, Names, Date, Ken Burns zoom) */}
      <HeroSection isIntroCompleted={isIntroCompleted} />

      {/* Section 2: "YOU'RE INVITED" (Soft cream/blush/lilac, butterflies, clouds, drawn arched gateway, wisteria, lanterns) */}
      <InvitationSection />

      {/* Section 3: QURANIC VERSE AND DUA (Sacred deep plum sky, twinkling stars, Surah Ar-Rum 30:21 & couple dua) */}
      <QuranVerseSection />

      {/* Section 4: THE NIKAH (Lavender and lilac mood, drawn mosque dome, minarets, ceremony details & map directions) */}
      <NikahSection />

      {/* CONNECTOR: Growing vertical gold vine with crescent star emblem */}
      <VineConnector />

      {/* Section 5: THE WALIMA (Blush and peach mood, mirrored layout, grand palace courtyard fountain & reception details) */}
      <WalimaSection />

      {/* Section 6: TWO SOULS, ONE JOURNEY (Clasped-hands illustration in pointed arch + tap to send a dua interaction) */}
      <CoupleDuaSection />

      {/* Section 7: COUNTING THE DAYS (Live dynamic countdown timer to Nikah & Walima) */}
      <CountdownSection />

      {/* Section 9: SAVE THE DATES + RSVP (Client-side .ics download & WhatsApp RSVP) */}
      <SaveDateRsvpSection />

      {/* Section 10: CLOSING (Twilight sky, mosque silhouette, Bismillah/Jazakumullahu Khairan & smooth back to top) */}
      <ClosingSection />
    </main>
  );
}
