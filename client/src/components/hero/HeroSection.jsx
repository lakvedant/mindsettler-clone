import { motion } from "framer-motion";
import HeroImage from "../../assets/images/HeroImage.jpeg";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router";
import { use } from "react";
import { useAuth } from "../../context/AuthContext";
import useIsMobile from "../../hooks/useIsMobile";

const HeroSection = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  // Map mouse movement to pixels (e.g., move image 20px in opposite direction)
  const moveX = useTransform(springX, [0, window.innerWidth], [15, -15]);
  const moveY = useTransform(springY, [0, window.innerHeight], [15, -15]);

  const handleMouseMove = (e) => {
    if (isMobile) return; // Skip on mobile
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  // Animation variants for staggered text - disabled on mobile
  const containerVariants = isMobile
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
          },
        },
      };

  const itemVariants = isMobile
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { duration: 0.8, ease: "easeOut" },
        },
      };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full overflow-hidden flex items-center font-serif"
    >
      {/* Background Image with Parallax Effect */}
      {isMobile ? (
        <div className="absolute inset-0 z-0">
          <img
            src={HeroImage}
            alt="Peaceful Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[#4a3a89]/10 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ scale: 1.5 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="absolute inset-0 z-0"
          style={{ x: moveX, y: moveY, scale: 1.05 }}
        >
          <img
            src={HeroImage}
            alt="Peaceful Landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute inset-0 bg-[#4a3a89]/10 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 w-full h-full bg-linear-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </motion.div>
      )}

      {/* Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-bold text-black/60 uppercase tracking-[0.2em] mb-4 drop-shadow-2xl font-serif"
          style={{ textShadow: "0px 0px 20px rgba(255,255,255,0.3)" }}
        >
          JOURNEY TO INNER PEACE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/80 font-light italic mb-8 tracking-wide max-w-2xl mx-auto font-sans"
        >
          Discover Tranquility Above the Clouds
        </motion.p>

        {/* Animated Button */}
        <motion.div variants={itemVariants}>
          <Link to={user ? "/booking" : "/auth"}>
            {isMobile ? (
              <button className="group relative px-8 py-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-white font-semibold uppercase tracking-widest overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                </span>
              </button>
            ) : (
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-3 bg-white/20 backdrop-blur-md border border-white/40 rounded-full text-white font-semibold uppercase tracking-widest overflow-hidden transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                </span>
                {/* Glossy shine effect animation */}
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                />
              </motion.button>
            )}
          </Link>
        </motion.div>
      </motion.div>

      {/* Floating Particle Effect - Hidden on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: [null, "-20px"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSection;
