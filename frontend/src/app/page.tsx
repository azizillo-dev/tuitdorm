import React from "react";
import { Header } from "@/components/landing/Header";
import { HeroGrid } from "@/components/landing/HeroGrid";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col bg-page">
      <Header />
      <HeroGrid />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
