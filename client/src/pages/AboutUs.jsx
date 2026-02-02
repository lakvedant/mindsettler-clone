import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import introVideo from "../assets/video/IMG_2808.MOV";
import { Link } from "react-router";
import { ScrollProgressBar } from "../components/common/ScrollProgressBar";
import useIsMobile from "../hooks/useIsMobile";
import { AboutSEO } from "../components/common/SEO";

// Custom Hook for Mouse Position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
};

// Magnetic Button Component - disabled on mobile for performance
const MagneticButton = ({ children, className, onClick, isMobile }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (isMobile) return; // Skip on mobile
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  // On mobile, render simple button without motion
  if (isMobile) {
    return (
      <button ref={ref} onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  const { x, y } = position;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Text Reveal Animation Component
const TextReveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 0.8,
          ease: [0.33, 1, 0.68, 1],
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const incrementTime = (duration * 1000) / end;
      
      const counter = setInterval(() => {
        start += 1;
        setDisplayValue(start);
        if (start === end) clearInterval(counter);
      }, incrementTime);

      return () => clearInterval(counter);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
};

// Floating Particles Component - hidden on mobile for performance
const FloatingParticles = ({ isMobile }) => {
  // Don't render particles on mobile
  if (isMobile) return null;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? "rgba(63,41,101,0.3)" : "rgba(221,23,100,0.3)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};


// Staggered Text Animation
const StaggerText = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    }),
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span key={index} variants={child} className="inline-block mr-2">
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Glowing Card Component - simplified on mobile
const GlowingCard = ({ children, className, isMobile }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile) return; // Skip on mobile
      const { currentTarget, clientX, clientY } = e;
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY, isMobile]
  );

  // On mobile, render simple div without motion
  if (isMobile) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(221,23,100,0.15), transparent 40%)`,
        }}
      />
      {children}
    </motion.div>
  );
};

const AboutUsPage = () => {
  const isMobile = useIsMobile(); // Hook to detect mobile devices
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const heroRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("education");
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [hoveredValue, setHoveredValue] = useState(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
    layoutEffect: false,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScrollProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(heroScrollProgress, [0, 0.5], [1, 0.9]);
  const heroY = useTransform(heroScrollProgress, [0, 0.5], [0, -100]);

  // Video control functions (keeping all existing logic)
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
      setIsVideoLoaded(true);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoRef.current.mozRequestFullScreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
    setVideoProgress(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    let timeout;
    if (isVideoPlaying) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    } else {
      setShowControls(true);
    }
    return () => clearTimeout(timeout);
  }, [isVideoPlaying]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (isVideoPlaying) {
      setTimeout(() => setShowControls(false), 3000);
    }
  };

  const founderData = {
    name: "Parnika Bajaj",
    role: "Founder & Mental Wellness Advocate",
    tagline: "Transforming mental wellness, one mind at a time",
    story: `I founded MindSettler in April 2023 with a single goal: to make mental wellness accessible, approachable, and truly transformative.
            During my years studying psychology across two continents, I realized that awareness wasn't the problem. The real barriers were accessibility and the fear of judgment.`,
    mission: `This platform offers you a safe, confidential sanctuary where healing is:  
1. Personalized to your unique journey.
2. Evidence-based for real results.
3. Deeply empathetic to your needs.`,
    education: [
      {
        degree: "Master of Arts in Counseling Psychology",
        institution: "Golden Gate University",
        year: "2022",
        icon: "🎓",
      },
      {
        degree: "Bachelor of Science (Hons) in Psychology",
        institution: "University of Edinburgh",
        year: "2018 - 2022",
        icon: "📚",
      },
    ],
    experience: [
      {
        title: "Founder of MindSettler",
        period: "April 2023 - Present",
        description: "Building a platform that prioritizes mental wellness",
      },
      {
        title: "Mental Health Counselor",
        period: "2+ years",
        description:
          "Specialized in anxiety, depression, and relationship counseling",
      },
      {
        title: "Therapeutic Practitioner",
        period: "Ongoing",
        description: "Trained in evidence-based therapeutic approaches",
      },
    ],
    values: [
      {
        title: "Empathy First",
        description: "Understanding before advising",
        icon: "💜",
        color: "#9333ea",
      },
      {
        title: "Evidence-Based",
        description: "Science-backed approaches",
        icon: "🔬",
        color: "#3F2965",
      },
      {
        title: "Accessibility",
        description: "Mental health for everyone",
        icon: "🌍",
        color: "#7c3aed",
      },
      {
        title: "Confidentiality",
        description: "Your privacy, always protected",
        icon: "🔒",
        color: "#Dd1764",
      },
    ],
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
      },
    },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 20,
      },
    },
  };

  return (
    <>
      <AboutSEO />
      <ScrollProgressBar />
      <Navbar />
      
      <div ref={containerRef} className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background with Enhanced Effects */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{ y: backgroundY, opacity: heroOpacity }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 20% 20%, rgba(63,41,101,0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 80%, rgba(221,23,100,0.1) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%),
                  linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #fce7f3 50%, #fdf2f8 75%, #f5f3ff 100%)
                `,
              }}
            />

            {/* Enhanced Floating Elements - hidden on mobile for performance */}
            {!isMobile && [...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  background: `linear-gradient(135deg, rgba(63,41,101,${0.1 + i * 0.02}), rgba(221,23,100,${0.1 + i * 0.02}))`,
                  width: `${60 + i * 30}px`,
                  height: `${60 + i * 30}px`,
                  left: `${5 + i * 12}%`,
                  top: `${15 + (i % 4) * 20}%`,
                  filter: "blur(1px)",
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, i % 2 === 0 ? 20 : -20, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.7, 0.3],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 6 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            ))}

            <FloatingParticles isMobile={isMobile} />
          </motion.div>

          {/* Hero Content with Scroll Effects */}
          <motion.div
            className="relative z-10 max-w-7xl mx-auto mt-20 px-6 py-20"
            style={{ y: heroY, scale: heroScale }}
          >
            {/* Main Title with Enhanced Animations */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center mb-16"
            >
              <motion.div variants={itemVariants} className="overflow-hidden">
                <motion.h1
                  className="text-5xl md:text-7xl lg:text-8xl font-serif mb-4"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 50,
                    damping: 20,
                    delay: 0.2,
                  }}
                >
                  <motion.span
                    className="text-[#3F2965] inline-block"
                    whileHover={{
                      scale: 1.05,
                      color: "#5a3d7a",
                      transition: { duration: 0.3 },
                    }}
                  >
                    Meet the{" "}
                  </motion.span>
                  <motion.span
                    className="italic bg-gradient-to-r from-[#Dd1764] via-[#7c3aed] to-[#3F2965] bg-clip-text text-transparent inline-block"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Founder
                  </motion.span>
                </motion.h1>
              </motion.div>

              <StaggerText
                text="Learn about the vision, education, and experience behind MindSettler"
                className="text-[#3F2965]/60 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                delay={0.5}
              />
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Video Section with Enhanced Animations */}
              <motion.div
                variants={slideInLeft}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                {/* Decorative Frame with Animation */}
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-br from-[#3F2965]/20 via-[#7c3aed]/10 to-[#Dd1764]/20 rounded-3xl"
                  animate={{
                    filter: ["blur(20px)", "blur(30px)", "blur(20px)"],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative">
                  {/* Animated Corner Decorations */}
                  {[
                    { pos: "-top-3 -left-3", border: "border-t-4 border-l-4", rounded: "rounded-tl-2xl", color: "border-[#3F2965]/30" },
                    { pos: "-top-3 -right-3", border: "border-t-4 border-r-4", rounded: "rounded-tr-2xl", color: "border-[#Dd1764]/30" },
                    { pos: "-bottom-3 -left-3", border: "border-b-4 border-l-4", rounded: "rounded-bl-2xl", color: "border-[#Dd1764]/30" },
                    { pos: "-bottom-3 -right-3", border: "border-b-4 border-r-4", rounded: "rounded-br-2xl", color: "border-[#3F2965]/30" },
                  ].map((corner, i) => (
                    <motion.div
                      key={i}
                      className={`absolute ${corner.pos} w-12 h-12 ${corner.border} ${corner.color} ${corner.rounded}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.2 }}
                    />
                  ))}

                  {/* Video Container */}
                  <motion.div
                    className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-2xl"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => isVideoPlaying && setShowControls(false)}
                    whileHover={{ boxShadow: "0 25px 50px -12px rgba(63,41,101,0.25)" }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Watch Introduction Badge with Pulse Animation */}
                    <AnimatePresence>
                      {(!isVideoPlaying || showControls) && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
                        >
                          <motion.span
                            className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-[#3F2965] text-xs font-bold tracking-wider uppercase shadow-lg border border-[#3F2965]/10"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(221,23,100,0.4)",
                                "0 0 0 10px rgba(221,23,100,0)",
                                "0 0 0 0 rgba(221,23,100,0)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Watch Introduction
                          </motion.span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Video Player */}
                    <div className="relative aspect-[3/4] bg-black">
                      <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleVideoEnd}
                        onPlay={() => setIsVideoPlaying(true)}
                        onPause={() => setIsVideoPlaying(false)}
                        playsInline
                        preload="metadata"
                        src={introVideo}
                        poster="/images/video-poster.jpg"
                      />

                      {/* Enhanced Loading Indicator */}
                      {!isVideoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3F2965]/10 to-[#Dd1764]/10">
                          <motion.div className="relative">
                            <motion.div
                              className="w-20 h-20 border-4 border-[#3F2965]/20 rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                              className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-[#Dd1764] rounded-full"
                              animate={{ rotate: -360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                              className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-[#3F2965] rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                          </motion.div>
                        </div>
                      )}

                      {/* Enhanced Play Button Overlay */}
                      <AnimatePresence>
                        {!isVideoPlaying && isVideoLoaded && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                          >
                            <MagneticButton
                              onClick={handlePlayPause}
                              className="relative group"
                              isMobile={isMobile}
                            >
                              {/* Multi-layer Glow Effect */}
                              <motion.div
                                className="absolute inset-0 bg-[#Dd1764] rounded-full blur-2xl"
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                              <motion.div
                                className="absolute inset-0 bg-[#3F2965] rounded-full blur-xl"
                                animate={{
                                  scale: [1.2, 1, 1.2],
                                  opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                              />
                              {/* Button with 3D Effect */}
                              <motion.div
                                className="relative w-24 h-24 bg-gradient-to-br from-[#3F2965] to-[#Dd1764] rounded-full flex items-center justify-center shadow-2xl"
                                whileHover={{
                                  scale: 1.1,
                                  rotateY: 15,
                                  rotateX: -15,
                                }}
                                whileTap={{ scale: 0.95 }}
                                style={{ transformStyle: "preserve-3d" }}
                              >
                                <motion.svg
                                  className="w-10 h-10 text-white ml-1"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  animate={{ x: [0, 3, 0] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                >
                                  <path d="M8 5v14l11-7z" />
                                </motion.svg>
                              </motion.div>
                            </MagneticButton>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Enhanced Video Controls */}
                      <AnimatePresence>
                        {(showControls || !isVideoPlaying) && isVideoLoaded && (
                          <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 30 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16"
                          >
                            <div className="flex flex-col gap-3">
                              {/* Enhanced Progress Bar */}
                              <motion.div
                                className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer group relative"
                                onClick={handleProgressClick}
                                whileHover={{ height: 8 }}
                                transition={{ duration: 0.2 }}
                              >
                                <motion.div
                                  className="h-full bg-gradient-to-r from-[#Dd1764] via-[#7c3aed] to-[#3F2965] rounded-full relative"
                                  style={{ width: `${videoProgress}%` }}
                                  layoutId="progress"
                                >
                                  <motion.div
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100"
                                    whileHover={{ scale: 1.3 }}
                                    animate={{
                                      boxShadow: [
                                        "0 0 0 0 rgba(221,23,100,0.4)",
                                        "0 0 0 8px rgba(221,23,100,0)",
                                      ],
                                    }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                  />
                                </motion.div>
                              </motion.div>

                              {/* Controls Row */}
                              <div className="flex items-center gap-4 text-white">
                                <MagneticButton
                                  onClick={handlePlayPause}
                                  className="hover:text-[#Dd1764] transition-colors p-1"
                                  isMobile={isMobile}
                                >
                                  {isVideoPlaying ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  )}
                                </MagneticButton>

                                <motion.span
                                  className="font-mono text-sm text-white/80"
                                  animate={{ opacity: [0.8, 1, 0.8] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {formatTime(currentTime)} / {formatTime(videoDuration)}
                                </motion.span>

                                <div className="flex-1" />

                                <MagneticButton
                                  onClick={handleMuteToggle}
                                  className="hover:text-[#Dd1764] transition-colors p-1"
                                  isMobile={isMobile}
                                >
                                  {isMuted ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                    </svg>
                                  )}
                                </MagneticButton>

                                <MagneticButton
                                  onClick={handleFullscreen}
                                  className="hover:text-[#Dd1764] transition-colors p-1"
                                  isMobile={isMobile}
                                >
                                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                                  </svg>
                                </MagneticButton>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>

                  {/* Enhanced Floating Stats with Counter Animation */}
                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="absolute -right-6 top-1/4 bg-white rounded-2xl shadow-xl p-4 border border-[#3F2965]/10 cursor-pointer"
                  >
                    <motion.div
                      className="text-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-3xl font-bold bg-gradient-to-r from-[#3F2965] to-[#Dd1764] bg-clip-text text-transparent">
                        <AnimatedCounter value="2" suffix="+" />
                      </span>
                      <p className="text-xs text-[#3F2965]/60 font-medium">
                        Years Experience
                      </p>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: -3 }}
                    className="absolute -left-6 bottom-1/4 bg-white rounded-2xl shadow-xl p-4 border border-[#Dd1764]/10 cursor-pointer"
                  >
                    <motion.div
                      className="text-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    >
                      <span className="text-3xl font-bold bg-gradient-to-r from-[#Dd1764] to-[#3F2965] bg-clip-text text-transparent">
                        <AnimatedCounter value="1000" suffix="+" />
                      </span>
                      <p className="text-xs text-[#3F2965]/60 font-medium">
                        Lives Touched
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Content Section with Enhanced Animations */}
              <motion.div
                variants={slideInRight}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Founder Name & Title with Typewriter Effect */}
                <div>
                  <TextReveal>
                    <motion.h2
                      className="text-3xl md:text-4xl font-serif font-bold text-[#3F2965] mb-2"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring" }}
                    >
                      {founderData.name}
                    </motion.h2>
                  </TextReveal>
                  <TextReveal delay={0.2}>
                    <motion.p
                      className="text-[#Dd1764] font-medium tracking-wide"
                      animate={{
                        color: ["#Dd1764", "#7c3aed", "#Dd1764"],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      {founderData.role}
                    </motion.p>
                  </TextReveal>
                </div>

                {/* Story with Paragraph Animation */}
                <motion.div
                  className="space-y-4"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.p
                    variants={itemVariants}
                    className="text-[#3F2965]/80 leading-relaxed text-lg"
                  >
                    {founderData.story}
                  </motion.p>
                  <motion.p
                    variants={itemVariants}
                    className="text-[#3F2965]/70 leading-relaxed whitespace-pre-line"
                  >
                    {founderData.mission}
                  </motion.p>
                </motion.div>

                {/* Enhanced Tabs */}
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Tab Headers with Underline Animation */}
                  <div className="flex gap-8 mb-6 border-b border-[#3F2965]/10 pb-2 relative">
                    {["education", "experience"].map((tab) => (
                      <motion.button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 py-2 ${
                          activeTab === tab
                            ? "text-[#Dd1764]"
                            : "text-[#3F2965]/40 hover:text-[#3F2965]/70"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#3F2965] via-[#7c3aed] to-[#Dd1764] rounded-full"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tab Content with Enhanced Transitions */}
                  <AnimatePresence mode="wait">
                    {activeTab === "education" && (
                      <motion.div
                        key="education"
                        initial={{ opacity: 0, x: -30, rotateY: -10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: 30, rotateY: 10 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="space-y-4"
                      >
                        {founderData.education.map((edu, index) => (
                          <GlowingCard key={index} className="group" isMobile={isMobile}>
                            <motion.div
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.15, type: "spring" }}
                              whileHover={{
                                x: 10,
                                boxShadow: "0 20px 40px -10px rgba(63,41,101,0.2)",
                              }}
                              className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-r from-white to-[#3F2965]/5 border border-[#3F2965]/10 transition-all duration-300"
                            >
                              <motion.span
                                className="text-3xl"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                              >
                                {edu.icon}
                              </motion.span>
                              <div>
                                <h4 className="font-bold text-[#3F2965] group-hover:text-[#Dd1764] transition-colors">
                                  {edu.degree}
                                </h4>
                                <p className="text-[#3F2965]/60 text-sm">
                                  {edu.institution}
                                </p>
                                <motion.span
                                  className="text-xs text-[#Dd1764] font-medium inline-block mt-1"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {edu.year}
                                </motion.span>
                              </div>
                            </motion.div>
                          </GlowingCard>
                        ))}
                      </motion.div>
                    )}

                    {activeTab === "experience" && (
                      <motion.div
                        key="experience"
                        initial={{ opacity: 0, x: 30, rotateY: 10 }}
                        animate={{ opacity: 1, x: 0, rotateY: 0 }}
                        exit={{ opacity: 0, x: -30, rotateY: -10 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="space-y-6"
                      >
                        {founderData.experience.map((exp, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15, type: "spring" }}
                            className="relative pl-8 group"
                          >
                            {/* Animated Timeline Line */}
                            <motion.div
                              className="absolute left-0 top-0 bottom-0 w-1 rounded-full overflow-hidden"
                              style={{
                                background: "linear-gradient(to bottom, #3F2965, #Dd1764)",
                              }}
                              initial={{ height: 0 }}
                              animate={{ height: "100%" }}
                              transition={{ delay: index * 0.2, duration: 0.5 }}
                            />
                            {/* Animated Dot */}
                            <motion.div
                              className="absolute -left-[6px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-[#3F2965] to-[#Dd1764]"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.2 + 0.3, type: "spring" }}
                              whileHover={{ scale: 1.3 }}
                            >
                              <motion.div
                                className="absolute inset-0 rounded-full bg-[#Dd1764]"
                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                            
                            <motion.div
                              whileHover={{ x: 10 }}
                              transition={{ type: "spring" }}
                            >
                              <h4 className="font-bold text-[#3F2965] group-hover:text-[#Dd1764] transition-colors">
                                {exp.title}
                              </h4>
                              <motion.span
                                className="text-xs text-[#Dd1764] font-medium"
                                animate={{ opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {exp.period}
                              </motion.span>
                              <p className="text-[#3F2965]/60 text-sm mt-1">
                                {exp.description}
                              </p>
                            </motion.div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                        {/* Enhanced CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <Link to="/resources">
                    <MagneticButton className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white font-bold rounded-full shadow-xl overflow-hidden" isMobile={isMobile}>
                      {/* Shine Effect */}
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                      {/* Hover Gradient */}
                      <span className="absolute inset-0 bg-gradient-to-r from-[#Dd1764] to-[#3F2965] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {/* Ripple Effect on Hover */}
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        initial={{ scale: 0, opacity: 0.5 }}
                        whileHover={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
                      />
                      <span className="relative z-10">Learn More</span>
                      <motion.span
                        className="relative z-10"
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </MagneticButton>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Values Section with Enhanced 3D Cards */}
        <section className="py-32 bg-gradient-to-b from-[#f5f3ff] to-white relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-96 h-96 bg-[#3F2965]/10 rounded-full blur-3xl"
              animate={{
                x: [-100, 100, -100],
                y: [-50, 50, -50],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#Dd1764]/10 rounded-full blur-3xl"
              animate={{
                x: [100, -100, 100],
                y: [50, -50, 50],
                scale: [1.2, 1, 1.2],
              }}
              transition={{ duration: 25, repeat: Infinity }}
            />
            
            {/* Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(#3F2965 1px, transparent 1px),
                  linear-gradient(90deg, #3F2965 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
            />
          </div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 50 }}
              className="text-center mb-20"
            >
              <motion.span
                className="text-[#Dd1764] font-bold tracking-[0.3em] uppercase text-sm inline-block"
                animate={{ letterSpacing: ["0.3em", "0.4em", "0.3em"] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Our Foundation
              </motion.span>
              <TextReveal delay={0.2}>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#3F2965] mt-4">
                  Core{" "}
                  <motion.span
                    className="italic text-[#Dd1764]"
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(221,23,100,0)",
                        "0 0 30px rgba(221,23,100,0.3)",
                        "0 0 0px rgba(221,23,100,0)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Values
                  </motion.span>
                </h2>
              </TextReveal>
              <motion.p
                className="text-[#3F2965]/60 mt-6 max-w-xl mx-auto text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                The principles that guide every interaction at MindSettler
              </motion.p>
            </motion.div>

            {/* Enhanced Values Grid with 3D Tilt */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {founderData.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60, rotateX: 30 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 50,
                  }}
                  onHoverStart={() => setHoveredValue(index)}
                  onHoverEnd={() => setHoveredValue(null)}
                  whileHover={{
                    y: -20,
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: -5,
                  }}
                  className="group relative cursor-pointer"
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  <motion.div
                    className="relative bg-white rounded-3xl p-8 shadow-lg border border-[#3F2965]/5 overflow-hidden h-full"
                    style={{
                      boxShadow:
                        hoveredValue === index
                          ? `0 25px 50px -12px ${value.color}40`
                          : "0 10px 40px -10px rgba(0,0,0,0.1)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated Background Gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${value.color}15, transparent 70%)`,
                      }}
                    />

                    {/* Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8 }}
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      }}
                    />

                    {/* Floating Icon with 3D Effect */}
                    <motion.div
                      className="relative z-10 mb-6"
                      transition={{
                        duration: hoveredValue === index ? 0.8 : 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="text-5xl block">{value.icon}</span>
                      {/* Icon Glow */}
                      <motion.div
                        className="absolute inset-0 blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
                        style={{ background: value.color }}
                      />
                    </motion.div>

                    {/* Content */}
                    <motion.h3
                      className="text-xl font-bold mb-3 relative z-10 transition-colors duration-300"
                      style={{
                        color: hoveredValue === index ? value.color : "#3F2965",
                      }}
                    >
                      {value.title}
                    </motion.h3>
                    <p className="text-[#3F2965]/60 text-sm relative z-10 leading-relaxed">
                      {value.description}
                    </p>

                    {/* Decorative Corner Lines */}
                    <motion.div
                      className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ borderColor: value.color }}
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    />
                    <motion.div
                      className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ borderColor: value.color }}
                      initial={{ scale: 0, rotate: 45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    />

                    {/* Bottom Glow Effect */}
                    <motion.div
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                      style={{ background: value.color }}
                    />

                    {/* Particle Effect on Hover */}
                    <AnimatePresence>
                      {hoveredValue === index && (
                        <>
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 rounded-full"
                              style={{ 
                                background: value.color,
                                left: `${20 + i * 12}%`,
                                bottom: "20%"
                              }}
                              initial={{ y: 0, opacity: 0 }}
                              animate={{ 
                                y: -50 - Math.random() * 30, 
                                opacity: [0, 1, 0],
                                x: (Math.random() - 0.5) * 40
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ 
                                duration: 0.8, 
                                delay: i * 0.1,
                                ease: "easeOut"
                              }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Quote Section with Parallax */}
        <section className="py-32 relative overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, #3F2965 0%, #5a3d7a 50%, #Dd1764 100%)`,
            }}
          />

          {/* Animated Mesh Background */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute border border-white/20 rounded-full"
                style={{
                  width: `${200 + i * 150}px`,
                  height: `${200 + i * 150}px`,
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                animate={{
                  rotate: i % 2 === 0 ? [0, 360] : [360, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4 + i, repeat: Infinity },
                }}
              />
            ))}
          </div>

          {/* Floating Stars/Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Quote Marks with Enhanced Animation */}
          <motion.div
            className="absolute top-10 left-10 text-white/10 text-[200px] font-serif leading-none select-none"
            animate={{
              opacity: [0.05, 0.15, 0.05],
              y: [0, -20, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            "
          </motion.div>
          <motion.div
            className="absolute bottom-10 right-10 text-white/10 text-[200px] font-serif leading-none rotate-180 select-none"
            animate={{
              opacity: [0.05, 0.15, 0.05],
              y: [0, 20, 0],
              rotate: [185, 175, 185],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 3 }}
          >
            "
          </motion.div>

          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              {/* Quote Text with Word Animation */}
              <motion.blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif text-white leading-relaxed mb-10">
                {'"Mental health is not a destination, but a process. It\'s about how you drive, not where you\'re going."'.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-3"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.08,
                      type: "spring",
                      stiffness: 100,
                    }}
                    whileHover={{
                      scale: 1.1,
                      color: "#fce7f3",
                      transition: { duration: 0.2 }
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.blockquote>

              {/* Author Attribution with Line Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.5 }}
                className="flex items-center justify-center gap-4"
              >
                <motion.div
                  className="h-0.5 bg-white/30 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                />
                <motion.span
                  className="text-white/80 font-medium text-lg"
                  whileHover={{ color: "#fff", scale: 1.05 }}
                >
                  Parnika Bajaj
                </motion.span>
                <motion.div
                  className="h-0.5 bg-white/30 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.7, duration: 0.5 }}
                />
              </motion.div>

              {/* Decorative Element */}
              <motion.div
                className="mt-8 flex justify-center gap-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 2 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-white/40 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-32 bg-gradient-to-b from-white to-[#faf5ff] relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Gradient Orbs */}
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-[#Dd1764]/10 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#3F2965]/10 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, delay: 4 }}
            />

            {/* Floating Elements */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              >
                <div
                  className={`w-${4 + i * 2} h-${4 + i * 2} rounded-full border-2 ${
                    i % 2 === 0 ? 'border-[#3F2965]/20' : 'border-[#Dd1764]/20'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 50 }}
            >
              {/* Badge */}
              <motion.span
                className="inline-block text-[#Dd1764] font-bold tracking-[0.3em] uppercase text-sm mb-4"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Ready to Begin? ✨
              </motion.span>

              {/* Main Heading with Letter Animation */}
              <TextReveal delay={0.2}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3F2965] mb-6">
                  Start Your{" "}
                  <motion.span
                    className="italic text-[#Dd1764] inline-block"
                    animate={{
                      color: ["#Dd1764", "#7c3aed", "#Dd1764"],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    Wellness Journey
                  </motion.span>
                </h2>
              </TextReveal>

              <motion.p
                className="text-[#3F2965]/60 mb-12 max-w-xl mx-auto text-lg leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                Join thousands who have already taken the first step towards
                better mental health with MindSettler.
              </motion.p>

              {/* Enhanced CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Link to="/booking">
                  <MagneticButton className="relative group px-12 py-6 bg-gradient-to-r from-[#3F2965] via-[#5a3d7a] to-[#Dd1764] text-white font-bold text-lg rounded-full shadow-2xl overflow-hidden" isMobile={isMobile}>
                    {/* Animated Background */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-[#Dd1764] via-[#5a3d7a] to-[#3F2965]"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.5 }}
                    />
                    
                    {/* Shine Effect */}
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />

                    {/* Pulse Ring */}
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(221,23,100,0.4)",
                          "0 0 0 20px rgba(221,23,100,0)",
                        ],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    <span className="relative flex items-center gap-3 z-10">
                      Get Started Today
                      <motion.span
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </MagneticButton>
                </Link>
              </motion.div>

              {/* Trust Badges with Stagger Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap justify-center gap-8 mt-16"
              >
                {[
                  { icon: "🔒", text: "100% Confidential" },
                  { icon: "💜", text: "Evidence-Based" },
                  { icon: "🌟", text: "Personalized Care" },
                ].map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="flex items-center gap-2 text-[#3F2965]/60 text-sm font-medium cursor-pointer group"
                  >
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="text-lg"
                    >
                      {badge.icon}
                    </motion.span>
                    <span className="group-hover:text-[#3F2965] transition-colors">
                      {badge.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default AboutUsPage;