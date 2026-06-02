import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LogoBar from "./components/LogoBar";
import ProblemSection from "./components/ProblemSection";
import ArchitectureSection from "./components/ArchitectureSection";
import FeaturesSection from "./components/FeaturesSection";
import UseCasesSection from "./components/UseCasesSection";
import ComparisonSection from "./components/ComparisonSection";
import PricingSection from "./components/PricingSection";
import WaitlistSection from "./components/WaitlistSection";
import Footer from "./components/Footer";

function LandingPage() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen text-zinc-100 overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <LogoBar />
        <ProblemSection />
        <ArchitectureSection />
        <FeaturesSection />
        <UseCasesSection />
        <ComparisonSection />
        <PricingSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
