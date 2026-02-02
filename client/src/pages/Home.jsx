import Navbar from "../components/common/Navbar.jsx";
import JourneySection from "../components/journey/JourneySection.jsx";
import HeroSection from "../components/hero/HeroSection.jsx";
import FAQ from "../components/common/FAQ.jsx";
import Footer from "../components/common/Footer.jsx";
import MindSettlerSection from "../components/common/MindSettlerSection.jsx";
import StatsSection from "../components/common/StatsSection.jsx";
import { HomeSEO } from "../components/common/SEO.jsx";



function Home() {
  return (
    <>
    <HomeSEO />
    <Navbar />
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <HeroSection />
      <JourneySection />
      {/* <div class="bg-linear-to-b from-[#fdf2f9] to-[#f0f0f4] h-20"></div> */}
      <div class="bg-linear-to-b from-[#ffffff] to-[#f0eff4] h-20"></div>
      <MindSettlerSection />
      <StatsSection />
      <FAQ />
      <Footer/>
    </div>
    </>
  );
}

export default Home;
