import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useIsMobile from "../../hooks/useIsMobile";

export const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      setProgress(scrolled / scrollHeight);
    };
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // On mobile, use simple div without motion for better performance
  if (isMobile) {
    return (
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#3F2965] via-[#DD1764] to-[#3F2965] z-[9999] origin-left"
        style={{ width: `${progress * 100}%` }}
      />
    );
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3F2965] via-[#DD1764] to-[#3F2965] z-[9999] origin-left"
      style={{ scaleX: progress }}
    />
  );
};