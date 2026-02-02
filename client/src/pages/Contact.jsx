import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
} from "framer-motion";
import {
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Send,
  Loader2,
  CheckCircle,
  Sparkles,
  Heart,
  Clock,
  MapPin,
  ArrowRight,
  X,
  Star,
  MousePointer,
  Zap,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { ContactSEO } from "../components/common/SEO";
import API from "../api/axios";
import FAQSection from "../components/common/FAQ";
import { ScrollProgressBar } from "../components/common/ScrollProgressBar";
import useIsMobile from "../hooks/useIsMobile";

// ============== CUSTOM HOOKS ==============

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

// ============== ANIMATION COMPONENTS ==============

// Magnetic Button Component
const MagneticButton = ({
  children,
  className,
  onClick,
  disabled,
  type = "button",
  isMobile = false,
}) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (disabled || isMobile) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  // On mobile, render simple button
  if (isMobile) {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
      >
        {children}
      </button>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
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
  const isInView = useInView(ref, { once: true, margin: "-50px" });

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
      const incrementTime = Math.max((duration * 1000) / end, 10);

      const counter = setInterval(() => {
        start += Math.ceil(end / 50);
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(counter);
        } else {
          setDisplayValue(start);
        }
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

// Staggered Text Animation
const StaggerText = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delay },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20, rotateX: 90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
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

// Glowing Card with Mouse Track
const GlowingCard = ({ children, className, color = "purple", isMobile = false }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e) => {
      if (isMobile) return;
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    },
    [mouseX, mouseY, isMobile]
  );

  // On mobile, render simple div
  if (isMobile) {
    return (
      <div ref={ref} className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(400px circle at ${x}px ${y}px, ${
                color === "pink"
                  ? "rgba(221,23,100,0.15)"
                  : "rgba(63,41,101,0.15)"
              }, transparent 40%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
};

// Enhanced Bubble Animation Background Component - Conditionally rendered
const BubbleBackground = ({ isMobile = false }) => {
  // Don't render on mobile for performance
  if (isMobile) return null;

  const bubbles = [
    { size: 280, x: "5%", y: "8%", opacity: 0.15, color: "purple", delay: 0 },
    { size: 320, x: "75%", y: "5%", opacity: 0.12, color: "pink", delay: 0.5 },
    { size: 250, x: "85%", y: "25%", opacity: 0.18, color: "purple", delay: 1 },
    { size: 300, x: "-5%", y: "35%", opacity: 0.14, color: "pink", delay: 1.5 },
    { size: 280, x: "70%", y: "45%", opacity: 0.16, color: "purple", delay: 2 },
    { size: 260, x: "10%", y: "55%", opacity: 0.13, color: "pink", delay: 0.3 },
    {
      size: 290,
      x: "80%",
      y: "65%",
      opacity: 0.15,
      color: "purple",
      delay: 0.8,
    },
    { size: 270, x: "0%", y: "75%", opacity: 0.17, color: "pink", delay: 1.2 },
    {
      size: 310,
      x: "65%",
      y: "85%",
      opacity: 0.14,
      color: "purple",
      delay: 1.8,
    },
    { size: 180, x: "30%", y: "12%", opacity: 0.12, color: "pink", delay: 0.2 },
    {
      size: 160,
      x: "55%",
      y: "20%",
      opacity: 0.14,
      color: "purple",
      delay: 0.7,
    },
    { size: 200, x: "20%", y: "30%", opacity: 0.11, color: "pink", delay: 1.1 },
    {
      size: 170,
      x: "45%",
      y: "42%",
      opacity: 0.13,
      color: "purple",
      delay: 0.4,
    },
    { size: 190, x: "60%", y: "55%", opacity: 0.15, color: "pink", delay: 0.9 },
    {
      size: 175,
      x: "35%",
      y: "68%",
      opacity: 0.12,
      color: "purple",
      delay: 1.4,
    },
    { size: 185, x: "50%", y: "78%", opacity: 0.14, color: "pink", delay: 1.7 },
    {
      size: 165,
      x: "25%",
      y: "88%",
      opacity: 0.11,
      color: "purple",
      delay: 2.1,
    },
    {
      size: 100,
      x: "15%",
      y: "18%",
      opacity: 0.1,
      color: "purple",
      delay: 0.1,
    },
    { size: 90, x: "40%", y: "8%", opacity: 0.12, color: "pink", delay: 0.6 },
    {
      size: 110,
      x: "68%",
      y: "32%",
      opacity: 0.09,
      color: "purple",
      delay: 1.3,
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main bubbles with enhanced animations */}
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
            background:
              bubble.color === "purple"
                ? `radial-gradient(circle at 30% 30%, rgba(139, 92, 246, ${
                    bubble.opacity + 0.05
                  }), rgba(63, 41, 101, ${bubble.opacity}))`
                : `radial-gradient(circle at 30% 30%, rgba(251, 207, 232, ${
                    bubble.opacity + 0.1
                  }), rgba(221, 23, 100, ${bubble.opacity}))`,
            filter: "blur(1px)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [
              bubble.opacity * 0.8,
              bubble.opacity,
              bubble.opacity * 0.8,
            ],
            x: [0, 15, -15, 0],
            y: [0, -20, 10, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 10 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: bubble.delay,
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background:
              i % 2 === 0 ? "rgba(221,23,100,0.4)" : "rgba(63,41,101,0.4)",
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Soft gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)
          `,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(#3F2965 1px, transparent 1px),
            linear-gradient(90deg, #3F2965 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
};

// Enhanced Contact Info Card Component
const ContactCard = ({
  icon,
  title,
  detail,
  description,
  color,
  delay,
  href,
  isExternal,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : ""}
      data-hover
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: delay,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        y: -12,
        scale: 1.03,
        rotateY: 5,
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative overflow-hidden cursor-pointer block p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            color === "pink"
              ? "linear-gradient(135deg, rgba(221,23,100,0.08) 0%, rgba(221,23,100,0.02) 100%)"
              : "linear-gradient(135deg, rgba(63,41,101,0.08) 0%, rgba(63,41,101,0.02) 100%)",
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />

      {/* Icon with enhanced animation */}
      <motion.div
        className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 ${
          color === "pink"
            ? "bg-gradient-to-br from-[#DD1764]/15 to-[#DD1764]/5 text-[#DD1764]"
            : "bg-gradient-to-br from-[#3F2965]/15 to-[#3F2965]/5 text-[#3F2965]"
        }`}
        animate={
          isHovered
            ? {
                scale: [1, 1.2, 1.1],
                rotate: [0, -10, 10, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        {React.cloneElement(icon, { size: 22 })}

        {/* Icon glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity"
          style={{
            background: color === "pink" ? "#DD1764" : "#3F2965",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.h3
        className="relative font-bold text-base sm:text-lg text-[#3F2965] mb-1"
        animate={isHovered ? { x: 5 } : { x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className={`relative text-sm sm:text-base font-semibold mb-1 ${
          color === "pink" ? "text-[#DD1764]" : "text-[#3F2965]/80"
        }`}
        animate={isHovered ? { x: 5 } : { x: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {detail}
      </motion.p>
      {description && (
        <motion.p
          className="relative text-xs sm:text-sm text-[#3F2965]/50"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {description}
        </motion.p>
      )}

      {/* Arrow indicator with animation */}
      <motion.div
        className="absolute top-5 right-5 sm:top-6 sm:right-6"
        initial={{ opacity: 0, x: 10 }}
        animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <ArrowRight
            size={18}
            className={color === "pink" ? "text-[#DD1764]" : "text-[#3F2965]"}
          />
        </motion.div>
      </motion.div>

      {/* Corner decoration */}
      <motion.div
        className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full blur-2xl ${
          color === "pink" ? "bg-[#DD1764]" : "bg-[#3F2965]"
        }`}
        initial={{ opacity: 0, scale: 0 }}
        animate={
          isHovered ? { opacity: 0.15, scale: 1 } : { opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.3 }}
      />

      {/* Particle effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: color === "pink" ? "#DD1764" : "#3F2965",
                  left: "20%",
                  bottom: "30%",
                }}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{
                  x: Math.cos((i * Math.PI) / 2.5) * 50,
                  y: Math.sin((i * Math.PI) / 2.5) * 50 - 20,
                  scale: [0, 1, 0],
                  opacity: [0.8, 0.4, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.a>
  );
};

// Enhanced Input Component with Focus Animation
const FormInput = ({ label, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) props.onChange(e);
  };

  return (
    <motion.div
      className="space-y-1.5 sm:space-y-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <motion.label
        className="block text-xs sm:text-sm font-semibold text-[#3F2965] ml-1"
        animate={{
          color: isFocused ? "#DD1764" : "#3F2965",
        }}
        transition={{ duration: 0.3 }}
      >
        {label}
        {props.required && (
          <motion.span
            className="text-[#DD1764] ml-0.5"
            animate={{ scale: isFocused ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            *
          </motion.span>
        )}
      </motion.label>
      <div className="relative group">
        {/* Animated border gradient */}
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-[#3F2965] to-[#DD1764] rounded-xl sm:rounded-2xl blur transition-opacity duration-300"
          animate={{
            opacity: isFocused ? 0.2 : 0,
          }}
        />

        {props.as === "textarea" ? (
          <motion.textarea
            {...props}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative w-full p-3.5 sm:p-4 bg-white/80 hover:bg-white border-2 border-[#3F2965]/10 focus:border-[#DD1764]/30 focus:bg-white rounded-xl sm:rounded-2xl outline-none transition-all duration-300 text-[#3F2965] text-sm sm:text-base placeholder-[#3F2965]/30 resize-none"
            whileFocus={{ scale: 1.01 }}
          />
        ) : (
          <motion.input
            {...props}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="relative w-full p-3.5 sm:p-4 bg-white/80 hover:bg-white border-2 border-[#3F2965]/10 focus:border-[#DD1764]/30 focus:bg-white rounded-xl sm:rounded-2xl outline-none transition-all duration-300 text-[#3F2965] text-sm sm:text-base placeholder-[#3F2965]/30"
            whileFocus={{ scale: 1.01 }}
          />
        )}

        {/* Focus indicator line */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-[#3F2965] to-[#DD1764] rounded-full"
          initial={{ width: 0, x: "-50%" }}
          animate={{
            width: isFocused ? "95%" : "0%",
            x: "-50%",
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// Enhanced Success Modal with Confetti
const SuccessModal = ({ isOpen, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Confetti */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: [
                      "#DD1764",
                      "#3F2965",
                      "#7c3aed",
                      "#fbbf24",
                      "#34d399",
                    ][i % 5],
                    left: `${Math.random() * 100}%`,
                    top: -20,
                  }}
                  initial={{ y: -20, rotate: 0, opacity: 1 }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 720 - 360,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-[#DD1764]/20 to-[#3F2965]/20 rounded-full blur-2xl"
                animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
            >
              <X size={18} className="text-slate-400" />
            </button>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
              className="relative w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <CheckCircle size={40} className="text-white" />
              </motion.div>

              {/* Ripple effect */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-green-400"
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>

            <TextReveal delay={0.3}>
              <h3 className="text-xl sm:text-2xl font-bold text-[#3F2965] mb-2">
                Message Sent! 🎉
              </h3>
            </TextReveal>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm sm:text-base text-[#3F2965]/60 mb-6 relative"
            >
              Thank you for reaching out. We'll get back to you within 24 hours.
            </motion.p>

            <MagneticButton
              onClick={onClose}
              className="relative w-full py-3 bg-gradient-to-r from-[#3F2965] to-[#5a3d8a] text-white font-bold rounded-xl overflow-hidden group"
            >
              <motion.span className="absolute inset-0 bg-gradient-to-r from-[#DD1764] to-[#3F2965] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative">Got it!</span>
            </MagneticButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Social Button Component
const SocialButton = ({ href, icon, gradient, shadowColor, delay }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-hover
    initial={{ opacity: 0, scale: 0, rotate: -180 }}
    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    whileHover={{
      scale: 1.15,
      y: -8,
      rotate: [0, -10, 10, 0],
      transition: { rotate: { duration: 0.5 } },
    }}
    whileTap={{ scale: 0.9 }}
    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${shadowColor} relative overflow-hidden group`}
  >
    {/* Shine effect */}
    <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
    {icon}
  </motion.a>
);

// Testimonial Card Component
const TestimonialCard = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative bg-white/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-white/50 shadow-lg group overflow-hidden"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Background glow */}
      <motion.div className="absolute inset-0 bg-gradient-to-br from-[#3F2965]/5 to-[#DD1764]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Stars with animation */}
      <div className="flex gap-1 mb-3 relative">
        {[...Array(5)].map((_, j) => (
          <motion.div
            key={j}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + j * 0.1, type: "spring" }}
            animate={
              isHovered
                ? {
                    scale: [1, 1.3, 1],
                    rotate: [0, 15, -15, 0],
                  }
                : {}
            }
          >
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
          </motion.div>
        ))}
      </div>

      {/* Quote mark */}
      <motion.div
        className="absolute top-4 right-4 text-4xl text-[#3F2965]/10 font-serif"
        animate={
          isHovered ? { scale: 1.2, opacity: 0.2 } : { scale: 1, opacity: 0.1 }
        }
      >
        "
      </motion.div>

      <motion.p
        className="text-sm text-[#3F2965]/70 italic mb-4 leading-relaxed relative"
        animate={isHovered ? { x: 5 } : { x: 0 }}
        transition={{ duration: 0.3 }}
      >
        "{item.text}"
      </motion.p>

      <div className="relative">
        <motion.p
          className="font-bold text-sm text-[#3F2965]"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          {item.author}
        </motion.p>
        <motion.p
          className="text-xs text-[#DD1764]"
          animate={isHovered ? { x: 5 } : { x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {item.role}
        </motion.p>
      </div>

      {/* Bottom decoration */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3F2965] to-[#DD1764]"
        initial={{ scaleX: 0 }}
        animate={isHovered ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  );
};

// Quick Stat Badge Component
const StatBadge = ({ icon: Icon, text, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.8 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    whileHover={{ scale: 1.05, y: -3 }}
    className="flex items-center gap-2 text-[#3F2965]/60 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full cursor-pointer group"
  >
    <motion.div
      animate={{ rotate: [0, 10, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, delay: delay }}
    >
      <Icon
        size={16}
        className="text-[#DD1764] group-hover:text-[#3F2965] transition-colors"
      />
    </motion.div>
    <span className="text-xs sm:text-sm font-medium group-hover:text-[#3F2965] transition-colors">
      {text}
    </span>
  </motion.div>
);

// Main Contact Page
const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/user/contact/send", formData);
      if (res.data.success) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone />,
      title: "Call Us",
      detail: "+91 9974631313",
      description: "Mon-Fri, 9am-6pm",
      color: "purple",
      href: "tel:+919974631313",
      isExternal: false,
    },
    {
      icon: <MessageCircle />,
      title: "WhatsApp",
      detail: "+91 9974631313",
      description: "Quick responses",
      color: "purple",
      href: "https://wa.me/919974631313?text=Hi%20MindSettler%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services.",
      isExternal: true,
    },
    {
      icon: <Mail />,
      title: "Email",
      detail: "contact@mindsettler.com",
      description: "We reply within 24h",
      color: "purple",
      href: "mailto:contact@mindsettler.com?subject=Inquiry%20from%20Website",
      isExternal: false,
    },
    {
      icon: <Instagram />,
      title: "Instagram",
      detail: "@mindsettlerbypb",
      description: "Follow for updates",
      color: "pink",
      href: "https://www.instagram.com/mindsettlerbypb?igsh=MTdkeXcxaHd5dG50Ng==",
      isExternal: true,
    },
  ];

  const testimonials = [
    {
      text: "The support team responded within hours. Truly exceptional service!",
      author: "Sarah M.",
      role: "Verified Client",
    },
    {
      text: "MindSettler helped me find the right therapist. Life-changing experience.",
      author: "James K.",
      role: "Verified Client",
    },
    {
      text: "Professional, caring, and always available. Highly recommend!",
      author: "Emily R.",
      role: "Verified Client",
    },
  ];

  return (
    <>
      <ContactSEO />
      <ScrollProgressBar />
      <Navbar />

      <div
        className="min-h-screen font-sans text-[#3F2965] relative"
        style={{
          background: `linear-gradient(135deg, 
            #faf5ff 0%, 
            #f5f0ff 20%,
            #fdf2f8 40%, 
            #fce7f3 60%,
            #f3e8ff 80%,
            #faf5ff 100%
          )`,
        }}
      >
        <BubbleBackground />

        {/* === HERO SECTION === */}
        <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-28 px-4 overflow-hidden">
          <div className="relative max-w-4xl mx-auto text-center z-10">
            {/* Badge with animation */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 mb-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart size={14} className="text-[#DD1764]" />
              </motion.div>
              <span className="text-xs sm:text-sm font-semibold text-[#3F2965]">
                We're here to help
              </span>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Sparkles size={12} className="text-yellow-500" />
              </motion.div>
            </motion.div>

            {/* Title with enhanced animation */}
            <div className="overflow-hidden mb-4 sm:mb-6">
              <motion.h1
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold"
              >
                Let's Start a{" "}
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F2965] via-[#DD1764] to-[#3F2965] inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Conversation
                </motion.span>
              </motion.h1>
            </div>

            {/* Subtitle */}
            <StaggerText
              text="MindSettler provides a safe, supportive environment. Reach out for guidance, book a consultation, or just say hello."
              className="text-sm sm:text-base lg:text-lg text-[#3F2965]/60 max-w-2xl mx-auto leading-relaxed"
              delay={0.3}
            />

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-10"
            >
              <StatBadge icon={Clock} text="24h Response" delay={0.6} />
              <StatBadge icon={Star} text="5-Star Support" delay={0.7} />
              <StatBadge icon={MapPin} text="Global Reach" delay={0.8} />
            </motion.div>
          </div>
        </section>

        {/* === MAIN CONTENT === */}
        <section
          ref={formRef}
          className="relative px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-28 z-10"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* === LEFT: CONTACT CARDS === */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                {/* Section title - Mobile only */}
                <motion.div
                  className="lg:hidden mb-2"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-xl sm:text-2xl font-bold text-[#3F2965]">
                    Reach Out
                  </h2>
                  <p className="text-sm text-[#3F2965]/50">
                    Choose your preferred way to connect
                  </p>
                </motion.div>

                {/* Contact cards grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {contactInfo.map((item, index) => (
                    <ContactCard
                      key={index}
                      {...item}
                      delay={index * 0.1}
                      index={index}
                    />
                  ))}
                </div>

                {/* Urgent Help Card */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring" }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative overflow-hidden p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#3F2965] to-[#5a3d8a] text-white group"
                >
                  {/* Animated decorative circles */}
                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                    animate={{
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#DD1764]/20 rounded-full blur-2xl"
                    animate={{
                      scale: [1.3, 1, 1.3],
                      rotate: [360, 180, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                  />

                  <div className="relative">
                    <motion.div
                      className="flex items-center gap-2 mb-3"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 15, -15, 0],
                          scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles size={18} className="text-yellow-300" />
                      </motion.div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                        Quick Support
                      </span>
                    </motion.div>

                    <TextReveal delay={0.6}>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">
                        Need Urgent Help?
                      </h3>
                    </TextReveal>

                    <motion.p
                      className="text-sm text-white/70 mb-4 leading-relaxed"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                    >
                      Our support team is available for emergencies. Don't
                      hesitate to reach out.
                    </motion.p>

                    <motion.a
                      href="tel:+919974631313"
                      data-hover
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#3F2965] font-bold text-sm rounded-xl hover:bg-white/90 transition-colors relative overflow-hidden group/btn"
                    >
                      <motion.span className="absolute inset-0 bg-gradient-to-r from-[#DD1764]/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      <motion.div
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Phone size={16} />
                      </motion.div>
                      <span className="relative">Call Now</span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </motion.a>
                  </div>
                </motion.div>

                {/* Social Connect Card */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="relative overflow-hidden p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg"
                >
                  <TextReveal delay={0.6}>
                    <h3 className="text-lg font-bold text-[#3F2965] mb-4">
                      Connect With Us
                    </h3>
                  </TextReveal>

                  <div className="flex gap-3">
                    <SocialButton
                      href="https://wa.me/919974631313?text=Hi%20MindSettler%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                      icon={<MessageCircle size={22} />}
                      gradient="from-green-400 to-green-600"
                      shadowColor="shadow-green-500/30"
                      delay={0.7}
                    />
                    <SocialButton
                      href="https://www.instagram.com/mindsettlerbypb?igsh=MTdkeXcxaHd5dG50Ng=="
                      icon={<Instagram size={22} />}
                      gradient="from-[#833AB4] via-[#FD1D1D] to-[#F77737]"
                      shadowColor="shadow-pink-500/30"
                      delay={0.8}
                    />
                    <SocialButton
                      href="mailto:contact@mindsettler.com?subject=Inquiry%20from%20Website"
                      icon={<Mail size={22} />}
                      gradient="from-[#3F2965] to-[#5a3d8a]"
                      shadowColor="shadow-purple-500/30"
                      delay={0.9}
                    />
                    <SocialButton
                      href="tel:+919974631313"
                      icon={<Phone size={22} />}
                      gradient="from-[#DD1764] to-[#e83d7f]"
                      shadowColor="shadow-pink-500/30"
                      delay={1.0}
                    />
                  </div>

                  <motion.p
                    className="text-xs text-[#3F2965]/50 mt-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.1 }}
                  >
                    Click any icon to connect instantly
                  </motion.p>
                </motion.div>
              </div>

              {/* === RIGHT: CONTACT FORM === */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotateY: 10 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                className="lg:col-span-3"
                style={{ transformStyle: "preserve-3d" }}
              >
                <GlowingCard className="group">
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl lg:rounded-[40px] shadow-xl border border-white/50 overflow-hidden">
                    {/* Decorative gradient line */}
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3F2965] via-[#DD1764] to-[#3F2965] rounded-t-3xl"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    />

                    {/* Background animation */}
                    <motion.div
                      className="absolute -top-20 -right-20 w-40 h-40 bg-[#DD1764]/5 rounded-full blur-3xl"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                      transition={{ duration: 10, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#3F2965]/5 rounded-full blur-3xl"
                      animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                      transition={{ duration: 10, repeat: Infinity }}
                    />

                    {/* Form header */}
                    <div className="relative mb-6 sm:mb-8">
                      <TextReveal>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#3F2965] mb-2">
                          Get In Touch
                        </h2>
                      </TextReveal>
                      <motion.p
                        className="text-sm sm:text-base text-[#3F2965]/50"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                      >
                        Fill out the form and we'll respond within 24 hours.
                      </motion.p>
                    </div>
                    {/* Error message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.95 }}
                          className="mb-5 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm font-medium"
                        >
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                          >
                            <X size={16} />
                          </motion.div>
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 sm:space-y-5 relative"
                    >
                      {/* Name & Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                        <FormInput
                          label="Name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <FormInput
                          label="Email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      {/* Subject */}
                      <FormInput
                        label="Subject"
                        name="subject"
                        type="text"
                        placeholder="Booking / General Inquiry / Feedback"
                        value={formData.subject}
                        onChange={handleChange}
                      />

                      {/* Message */}
                      <FormInput
                        label="Message"
                        name="message"
                        as="textarea"
                        rows={4}
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />

                      {/* Submit button with enhanced animations */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                      >
                        <MagneticButton
                          type="submit"
                          disabled={loading}
                          className={`
                            relative w-full py-4 sm:py-4.5
                            bg-gradient-to-r from-[#DD1764] via-[#e83d7f] to-[#DD1764]
                            bg-[length:200%_100%] bg-left hover:bg-right
                            text-white font-bold text-sm sm:text-base
                            rounded-xl sm:rounded-2xl
                            transition-all duration-500
                            flex items-center justify-center gap-2
                            shadow-xl shadow-[#DD1764]/20
                            hover:shadow-2xl hover:shadow-[#DD1764]/30
                            disabled:opacity-70 disabled:cursor-not-allowed
                            overflow-hidden group
                          `}
                        >
                          {/* Animated background gradient */}
                          <motion.div className="absolute inset-0 bg-gradient-to-r from-[#3F2965] to-[#DD1764] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: "-200%" }}
                            animate={{ x: loading ? "0%" : "-200%" }}
                            whileHover={{ x: "200%" }}
                            transition={{
                              duration: loading ? 1.5 : 0.8,
                              repeat: loading ? Infinity : 0,
                              ease: "linear",
                            }}
                          />

                          {/* Ripple effect on hover */}
                          <motion.div
                            className="absolute inset-0 rounded-xl sm:rounded-2xl"
                            initial={{ scale: 0, opacity: 0.3 }}
                            whileHover={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{
                              background:
                                "radial-gradient(circle, white 0%, transparent 70%)",
                            }}
                          />

                          {/* Pulse ring when not loading */}
                          {!loading && (
                            <motion.div
                              className="absolute inset-0 rounded-xl sm:rounded-2xl"
                              animate={{
                                boxShadow: [
                                  "0 0 0 0 rgba(221,23,100,0.4)",
                                  "0 0 0 15px rgba(221,23,100,0)",
                                ],
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}

                          {loading ? (
                            <motion.div
                              className="relative flex items-center gap-2"
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              >
                                <Loader2 size={20} />
                              </motion.div>
                              <span>Sending...</span>
                            </motion.div>
                          ) : (
                            <motion.div className="relative flex items-center gap-2">
                              <span>Send Message</span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <Send size={18} />
                              </motion.div>
                            </motion.div>
                          )}
                        </MagneticButton>
                      </motion.div>
                    </form>

                    {/* Privacy note with animation */}
                    <motion.p
                      className="mt-4 sm:mt-5 text-center text-[10px] sm:text-xs text-[#3F2965]/40"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                    >
                      By submitting, you agree to our{" "}
                      <motion.a
                        href="#"
                        className="underline hover:text-[#DD1764] transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        Privacy Policy
                      </motion.a>
                      . We'll never share your information.
                    </motion.p>

                    {/* Trust indicators */}
                    <motion.div
                      className="mt-6 pt-6 border-t border-[#3F2965]/10"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="flex flex-wrap justify-center gap-4">
                        {[
                          { icon: "🔒", text: "Secure" },
                          { icon: "⚡", text: "Fast Response" },
                          { icon: "💯", text: "Confidential" },
                        ].map((item, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center gap-1.5 text-[#3F2965]/50 text-xs"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.9 + i * 0.1 }}
                            whileHover={{ scale: 1.1, color: "#3F2965" }}
                          >
                            <motion.span
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                              }}
                            >
                              {item.icon}
                            </motion.span>
                            <span>{item.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </GlowingCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* === TESTIMONIALS SECTION === */}
        <section className="relative py-16 sm:py-20 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-14"
            >
              <motion.span
                className="inline-block text-[#DD1764] font-bold tracking-[0.2em] uppercase text-xs sm:text-sm mb-3"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨ Testimonials
              </motion.span>

              <TextReveal>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#3F2965] mb-2">
                  What People Say
                </h3>
              </TextReveal>

              <motion.p
                className="text-sm text-[#3F2965]/50 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Trusted by thousands seeking mental wellness
              </motion.p>
            </motion.div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((item, i) => (
                <TestimonialCard key={i} item={item} index={i} />
              ))}
            </div>

            {/* Floating Stats */}
            <motion.div
              className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-6 sm:gap-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {[
                { value: "1000", suffix: "+", label: "Happy Clients" },
                { value: "98", suffix: "%", label: "Satisfaction Rate" },
                { value: "24", suffix: "h", label: "Avg Response Time" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <motion.div
                    className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#3F2965] to-[#DD1764] bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: "200% 200%" }}
                  >
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </motion.div>
                  <p className="text-xs sm:text-sm text-[#3F2965]/50 mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* === CTA SECTION === */}
        <section className="relative py-16 sm:py-20 z-10 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-[#3F2965] to-[#5a3d8a] rounded-3xl sm:rounded-[40px] p-8 sm:p-12 lg:p-16 text-center text-white overflow-hidden"
            >
              {/* Animated background elements */}
              <motion.div
                className="absolute -top-20 -right-20 w-60 h-60 bg-[#DD1764]/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 20, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1.3, 1, 1.3],
                  rotate: [360, 180, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
              />

              {/* Floating particles */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${10 + i * 9}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}

              {/* Content */}
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="inline-block mb-4"
                >
                  <Sparkles size={32} className="text-yellow-300" />
                </motion.div>

                <TextReveal>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                    Ready to Start Your Journey?
                  </h2>
                </TextReveal>

                <motion.p
                  className="text-white/70 text-sm sm:text-base max-w-lg mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  Take the first step towards better mental wellness. Our team
                  is here to support you every step of the way.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <MagneticButton
                    onClick={() =>
                      formRef.current?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="relative px-8 py-4 bg-white text-[#3F2965] font-bold rounded-full overflow-hidden group"
                  >
                    <motion.span className="absolute inset-0 bg-gradient-to-r from-[#DD1764]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      Send a Message
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </MagneticButton>

                  <MagneticButton
                    onClick={() =>
                      window.open("https://wa.me/919974631313", "_blank")
                    }
                    className="relative px-8 py-4 bg-transparent border-2 border-white/50 text-white font-bold rounded-full overflow-hidden group hover:border-white transition-colors"
                  >
                    <motion.span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      <MessageCircle size={18} />
                      WhatsApp Us
                    </span>
                  </MagneticButton>
                </motion.div>

                {/* Trust badges */}
                <motion.div
                  className="mt-8 flex flex-wrap justify-center gap-4 sm:gap-6"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  {[
                    { icon: "🔒", text: "100% Confidential" },
                    { icon: "💜", text: "Professional Support" },
                    { icon: "⚡", text: "Quick Response" },
                  ].map((badge, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 text-white/60 text-xs sm:text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                      whileHover={{
                        scale: 1.05,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      >
                        {badge.icon}
                      </motion.span>
                      <span>{badge.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Gradient spacer */}
      <div
        className="h-20 sm:h-32"
        style={{
          background: `linear-gradient(180deg, #faf5ff 0%, #fdfcf8 100%)`,
        }}
      />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
};

export default ContactPage;
