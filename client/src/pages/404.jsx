import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router";
import useIsMobile from "../hooks/useIsMobile";
import { NotFoundSEO } from "../components/common/SEO";

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

// Magnetic Button Component
const MagneticButton = ({ children, className, onClick, isMobile = false }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  // On mobile, render simple button
  if (isMobile) {
    return (
      <button ref={ref} onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Floating Particle Component - Hidden on mobile
const FloatingParticle = ({ delay, duration, size, initialX, initialY, isMobile = false }) => {
  // Don't render on mobile
  if (isMobile) return null;
  
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: initialX,
        top: initialY,
        background: `linear-gradient(135deg, rgba(63,41,101,0.3), rgba(221,23,100,0.3))`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 20 - 10, 0],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
};

// Animated Number Component
const AnimatedNumber = ({ number, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [30, -30]);
  const rotateY = useTransform(mouseX, [-100, 100], [-30, 30]);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="relative cursor-pointer select-none"
      style={{
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 100, rotateX: 90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.2,
      }}
    >
      <motion.span
        className="inline-block text-[120px] sm:text-[150px] md:text-[200px] lg:text-[250px] font-black"
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          background: `linear-gradient(135deg, #3F2965 0%, #7c3aed 50%, #Dd1764 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "0 10px 30px rgba(63,41,101,0.3)",
        }}
        animate={
          isHovered
            ? {
                scale: 1.1,
              }
            : {
                scale: 1,
              }
        }
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {number}
      </motion.span>

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background: `linear-gradient(135deg, #3F2965, #Dd1764)`,
        }}
        animate={
          isHovered ? { opacity: 0.5, scale: 1.2 } : { opacity: 0.3, scale: 1 }
        }
      />

      {/* Particle Burst on Hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: i % 2 === 0 ? "#3F2965" : "#Dd1764",
                  left: "50%",
                  top: "50%",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: Math.cos((i * Math.PI) / 4) * 100,
                  y: Math.sin((i * Math.PI) / 4) * 100,
                  opacity: 0,
                  scale: 1,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Breathing Circle Component (Mental Wellness Theme)
const BreathingCircle = () => {
  const [breathPhase, setBreathPhase] = useState("inhale");

  useEffect(() => {
    const interval = setInterval(() => {
      setBreathPhase((prev) => (prev === "inhale" ? "exhale" : "inhale"));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-2">
      <motion.div
        className="w-16 h-16 rounded-full border-2 border-[#3F2965]/30 flex items-center justify-center"
        animate={{
          scale: breathPhase === "inhale" ? 1.3 : 1,
          borderColor:
            breathPhase === "inhale"
              ? "rgba(221,23,100,0.5)"
              : "rgba(63,41,101,0.3)",
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3F2965]/30 to-[#Dd1764]/30"
          animate={{
            scale: breathPhase === "inhale" ? 1.5 : 1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
      </motion.div>
      <motion.p
        className="text-xs text-[#3F2965]/50 font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {breathPhase === "inhale" ? "Breathe in..." : "Breathe out..."}
      </motion.p>
    </motion.div>
  );
};

// Floating Shapes Component
const FloatingShapes = () => {
  const shapes = [
    { type: "circle", size: 60, x: "10%", y: "20%", delay: 0 },
    { type: "square", size: 40, x: "85%", y: "15%", delay: 0.5 },
    { type: "triangle", size: 50, x: "75%", y: "70%", delay: 1 },
    { type: "circle", size: 30, x: "20%", y: "75%", delay: 1.5 },
    { type: "square", size: 25, x: "90%", y: "50%", delay: 2 },
    { type: "circle", size: 45, x: "5%", y: "50%", delay: 2.5 },
  ];

  return (
    <>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        >
          {shape.type === "circle" && (
            <div className="w-full h-full rounded-full border-2 border-[#3F2965]/20" />
          )}
          {shape.type === "square" && (
            <div className="w-full h-full rounded-lg border-2 border-[#Dd1764]/20 rotate-45" />
          )}
          {shape.type === "triangle" && (
            <div
              className="w-0 h-0"
              style={{
                borderLeft: `${shape.size / 2}px solid transparent`,
                borderRight: `${shape.size / 2}px solid transparent`,
                borderBottom: `${shape.size}px solid rgba(124,58,237,0.2)`,
              }}
            />
          )}
        </motion.div>
      ))}
    </>
  );
};

// Quick Links Component
const QuickLinks = () => {
  const links = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Services", path: "/services", icon: "💆" },
    { name: "About Us", path: "/about", icon: "💜" },
    { name: "Resources", path: "/resources", icon: "📚" },
    { name: "Contact", path: "/contact", icon: "✉️" },
  ];

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-3 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
    >
      {links.map((link, i) => (
        <motion.div
          key={link.name}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 + i * 0.1 }}
        >
          <Link to={link.path}>
            <motion.div
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#3F2965]/10 text-[#3F2965] text-sm font-medium flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(63,41,101,0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};

// Main 404 Page Component
const PageNotFound = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const messages = [
    "Taking a moment to pause is okay 💜",
    "Even the best paths have unexpected turns",
    "Lost? That's just another word for exploring",
    "Every journey has its detours",
    "You're not lost, you're discovering",
  ];

  const handleNumberClick = () => {
    setClickCount((prev) => prev + 1);
    if (clickCount >= 2) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      setClickCount(0);
    }
  };

  return (
    <>
      <NotFoundSEO />
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 20%, rgba(63,41,101,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(221,23,100,0.08) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%),
              linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #fce7f3 50%, #fdf2f8 75%, #f5f3ff 100%)
            `,
          }}
        />

        {/* Floating Shapes */}
        <FloatingShapes />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={Math.random() * 2}
            duration={3 + Math.random() * 2}
            size={`${4 + Math.random() * 8}px`}
            initialX={`${Math.random() * 100}%`}
            initialY={`${Math.random() * 100}%`}
          />
        ))}

        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(#3F2965 1px, transparent 1px),
              linear-gradient(90deg, #3F2965 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
          {/* Animated Message Popup */}
          <AnimatePresence>
            {showMessage && (
              <motion.div
                className="absolute top-20 left-1/2 -translate-x-1/2 z-50"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
              >
                <div className="px-6 py-3 bg-white rounded-full shadow-2xl border border-[#3F2965]/10">
                  <p className="text-[#3F2965] font-medium">
                    {messages[Math.floor(Math.random() * messages.length)]}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 404 Numbers */}
          <div
            className="flex items-center justify-center gap-2 md:gap-4"
            onClick={handleNumberClick}
          >
            <AnimatedNumber number="4" index={0} />
            <AnimatedNumber number="0" index={1} />
            <AnimatedNumber number="4" index={2} />
          </div>

          {/* Glitch Line */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-[#3F2965] via-[#7c3aed] to-[#Dd1764] rounded-full my-6"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />

          {/* Error Message */}
          <motion.div
            className="text-center max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.h1
              className="text-2xl md:text-3xl font-serif font-bold text-[#3F2965] mb-4"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Oops! Page Not Found
            </motion.h1>

            <motion.p
              className="text-[#3F2965]/60 text-lg leading-relaxed mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              The page you're looking for seems to have wandered off on its own
              wellness journey.
            </motion.p>

            <motion.p
              className="text-[#3F2965]/40 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              Don't worry, even the mind needs a moment to find its way
              sometimes.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {/* Primary Button */}
            <Link to="/">
              <MagneticButton className="group relative px-8 py-4 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white font-bold rounded-full shadow-xl overflow-hidden">
                {/* Shine Effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                {/* Hover Gradient */}
                <span className="absolute inset-0 bg-gradient-to-r from-[#Dd1764] to-[#3F2965] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-2">
                  <motion.span
                    animate={{ x: [0, -3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ←
                  </motion.span>
                  Go Back Home
                </span>
              </MagneticButton>
            </Link>

            {/* Secondary Button */}
            <Link to="/contact">
              <MagneticButton className="group relative px-8 py-4 bg-white text-[#3F2965] font-bold rounded-full shadow-xl border-2 border-[#3F2965]/20 overflow-hidden hover:border-[#Dd1764]/50 transition-colors">
                <span className="relative flex items-center gap-2">
                  Contact Support
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💬
                  </motion.span>
                </span>
              </MagneticButton>
            </Link>
          </motion.div>

          {/* Quick Links */}
          <QuickLinks />

          {/* Fun Interaction Hint */}
          <motion.p
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#3F2965]/30 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ delay: 3, duration: 3, repeat: Infinity }}
          >
            Tip: Click on the numbers for a surprise! ✨
          </motion.p>

          {/* Breathing Circle */}
          <BreathingCircle />

          {/* Decorative Corner Elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 border-t-2 border-l-2 border-[#3F2965]/10 rounded-tl-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-20 h-20 border-b-2 border-r-2 border-[#Dd1764]/10 rounded-br-3xl"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6 }}
          />
        </div>

        {/* Animated Wave at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <motion.svg
            viewBox="0 0 1440 120"
            className="w-full h-20"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.path
              d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z"
              fill="url(#waveGradient)"
              animate={{
                d: [
                  "M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z",
                  "M0,80 C360,20 720,100 1080,40 C1260,60 1380,70 1440,80 L1440,120 L0,120 Z",
                  "M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient
                id="waveGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(63,41,101,0.1)" />
                <stop offset="50%" stopColor="rgba(124,58,237,0.1)" />
                <stop offset="100%" stopColor="rgba(221,23,100,0.1)" />
              </linearGradient>
            </defs>
          </motion.svg>
        </div>
      </div>
    </>
  );
};

export default PageNotFound;
