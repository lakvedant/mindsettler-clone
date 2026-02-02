import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Video,
  Info,
  MessageSquare,
  Loader2,
  Check,
  Search,
  AlertCircle,
  Wallet,
  ArrowRight,
  X,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  Banknote,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { IsLoginUser, IsVerifiedUser, IsProfileCompleteUser } from "../components/auth/Verification";
import { ScrollProgressBar } from "../components/common/ScrollProgressBar";

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

const MagneticButton = ({ children, className, onClick, disabled, type = "button", ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.15, y: middleY * 0.15 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

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
      {...props}
    >
      {children}
    </motion.button>
  );
};

const TextReveal = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
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

// Staggered Text Animation
const StaggerText = ({ text, className, delay = 0 }) => {
  const words = text.split(" ");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
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
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
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
const GlowingCard = ({ children, className, color = "purple" }) => {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e) => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(400px circle at ${x}px ${y}px, ${
                color === "pink" ? "rgba(221,23,100,0.15)" : "rgba(63,41,101,0.15)"
              }, transparent 40%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
};

// Enhanced Floating Shapes with Parallax
const FloatingShapes = () => {
  const mousePosition = useMousePosition();
  
  const shapes = useMemo(() => [
    { size: 300, x: "5%", y: "10%", color: "purple", delay: 0 },
    { size: 400, x: "80%", y: "5%", color: "pink", delay: 0.5 },
    { size: 250, x: "70%", y: "60%", color: "purple", delay: 1 },
    { size: 350, x: "10%", y: "70%", color: "pink", delay: 1.5 },
    { size: 200, x: "40%", y: "30%", color: "purple", delay: 0.3 },
  ], []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: shape.color === "purple" 
              ? "rgba(139, 92, 246, 0.15)" 
              : "rgba(251, 207, 232, 0.2)",
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 15 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: shape.delay,
          }}
        />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(#3F2965 1px, transparent 1px),
            linear-gradient(90deg, #3F2965 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};

// Enhanced Progress Stepper
const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { label: "Therapy", icon: Sparkles },
    { label: "Schedule", icon: CalendarIcon },
    { label: "Confirm", icon: Check },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mb-4 md:mb-6"
    >
      <div className="flex items-center justify-center gap-1 md:gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStep;
          const isComplete = index < currentStep;

          return (
            <div key={step.label} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    relative w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center
                    transition-all duration-500 ease-out
                    ${
                      isActive
                        ? "bg-gradient-to-br from-[#FAE8FF] via-[#FBCFE8] to-[#E9D5FF] text-pink-600 shadow-lg shadow-pink-200/50 border border-pink-200/50"
                        : "bg-slate-100 text-slate-300"
                    }
                    ${isComplete ? "scale-90" : ""}
                  `}
                >
                  <AnimatePresence mode="wait">
                    {isComplete ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check size={14} className="md:w-4 md:h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="icon"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Icon size={14} className="md:w-4 md:h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Pulse ring for active step */}
                  {isActive && !isComplete && (
                    <motion.div
                      className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-pink-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className={`
                    text-[8px] md:text-[10px] font-bold uppercase mt-1 md:mt-2 tracking-wide md:tracking-wider
                    transition-colors duration-300
                    ${isActive ? "text-pink-500" : "text-slate-300"}
                  `}
                >
                  {step.label}
                </motion.span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="w-4 md:w-16 h-1 mx-1 md:mx-2 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#F3E8FF] via-[#FBCFE8] to-[#FAE8FF]"
                    initial={{ width: 0 }}
                    animate={{ width: isComplete ? "100%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Enhanced Skeleton Loader
const SlotSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.05 }}
        className="h-14 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 bg-[length:200%_100%]"
        style={{
          animation: "shimmer 1.5s infinite",
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
  </div>
);

// Ripple Effect Hook
const useRipple = () => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e, element) => {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = { x, y, size, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return { ripples, addRipple };
};

// Enhanced Animated Button with Ripple
const AnimatedButton = ({ children, onClick, className, disabled, variant = "primary", ...props }) => {
  const buttonRef = useRef(null);
  const { ripples, addRipple } = useRipple();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (!disabled) {
      addRipple(e, buttonRef.current);
      onClick?.(e);
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      ))}
      
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={isHovered && !disabled ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 0.6 }}
      />
      
      {children}
    </motion.button>
  );
};

// Enhanced Section Title
const SectionTitle = ({ icon, title, subtitle, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4"
  >
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
      transition={{ duration: 0.3 }}
      className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 text-[#DD1764] shadow-sm shrink-0"
    >
      {icon}
    </motion.div>
    <div>
      <h3 className="font-black text-sm md:text-base text-[#3F2965] uppercase tracking-tight">
        {title}
      </h3>
      <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wide md:tracking-widest flex items-center gap-1">
        {subtitle}
      </span>
    </div>
  </motion.div>
);

// Enhanced Time Slot Button
const TimeSlotButton = ({ slot, isSelected, onSelect, formatter, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onSelect(slot)}
      className={`
        relative py-3 md:py-4 rounded-xl md:rounded-2xl border-2 text-[10px] md:text-[11px] font-black
        transition-all duration-300 ease-out overflow-hidden
        ${
          isSelected
            ? "bg-gradient-to-br from-[#3F2965] to-[#4a3275] border-[#3F2965] text-white shadow-lg shadow-purple-200"
            : "bg-white border-slate-100 text-slate-500 hover:border-[#3F2965]/30 hover:text-[#3F2965]"
        }
      `}
    >
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#DD1764]/10 to-purple-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isSelected ? 1 : isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shine effect */}
      {isHovered && !isSelected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      <span className="relative flex items-center justify-center gap-1 md:gap-2">
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Check size={12} className="md:w-3.5 md:h-3.5" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="whitespace-nowrap">{formatter(slot)}</span>
      </span>
      
      {/* Selection indicator ring */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-white/30"
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.button>
  );
};

// Enhanced Slot Group
const SlotGroup = ({ title, icon, slots, selectedSlot, onSelect, formatter }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <SectionTitle
        icon={icon}
        title={title}
        subtitle={`${slots.length} Available`}
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        {slots.map((slot, index) => (
          <TimeSlotButton
            key={slot}
            slot={slot}
            isSelected={selectedSlot === slot}
            onSelect={onSelect}
            formatter={formatter}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Enhanced Therapy Card
const TherapyCard = ({ therapy, isSelected, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative w-full text-left p-3 md:p-4 rounded-xl md:rounded-2xl text-[11px] md:text-xs font-bold border-2
        transition-all duration-300 ease-out overflow-hidden
        ${
          isSelected
            ? "bg-gradient-to-r from-pink-50 to-purple-50 border-[#DD1764] text-[#3F2965] shadow-md"
            : "border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600"
        }
      `}
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-purple-100/50"
        initial={{ x: "-100%" }}
        animate={isSelected ? { x: 0 } : { x: "-100%" }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative flex items-center gap-2 md:gap-3">
        <motion.div
          animate={{
            scale: isSelected ? 1.2 : 1,
            backgroundColor: isSelected ? "#DD1764" : "#e2e8f0",
          }}
          transition={{ duration: 0.3 }}
          className="w-2 h-2 rounded-full shrink-0"
        />
        <span className="flex-1 leading-tight">{therapy}</span>
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, x: 10 }}
              animate={{ scale: 1, x: 0 }}
              exit={{ scale: 0, x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronRight size={14} className="shrink-0 text-[#DD1764]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

// Enhanced Session Type Toggle
const SessionTypeToggle = ({ sessionType, setSessionType }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex gap-2 md:gap-4 mb-6 md:mb-10"
    >
      {[
        { type: "online", icon: Video, label: "Online Session", color: "purple" },
        { type: "offline", icon: MapPin, label: "In-Person Visit", color: "pink" },
      ].map(({ type, icon: Icon, label, color }, index) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSessionType(type)}
          className={`
            relative flex-1 p-3 md:p-5 rounded-xl md:rounded-2xl border-2 flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 
            font-black text-xs md:text-sm transition-all duration-300 overflow-hidden
            ${
              sessionType === type
                ? "border-[#3F2965] bg-gradient-to-br from-[#3F2965] to-[#4a3275] text-white shadow-lg shadow-purple-200"
                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
            }
          `}
        >
          {/* Selection indicator */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: sessionType === type ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          <motion.div
            animate={{
              scale: sessionType === type ? [1, 1.1, 1] : 1,
              rotate: sessionType === type ? [0, -5, 5, 0] : 0,
            }}
            transition={{ duration: 0.5 }}
            className={`
              p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300
              ${sessionType === type ? "bg-white/20" : "bg-slate-50"}
            `}
          >
            <Icon size={16} className="md:w-5 md:h-5" />
          </motion.div>
          <span className="relative text-[10px] sm:text-xs md:text-sm">{label}</span>
          
          {/* Active pulse */}
          {sessionType === type && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};

// Enhanced Payment Method Selector
const PaymentMethodSelector = ({ paymentMethod, setPaymentMethod, walletBalance }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="mb-6 md:mb-10"
    >
      <SectionTitle
        icon={<Wallet size={16} className="md:w-4 md:h-4" />}
        title="Payment Method"
        subtitle="Choose how you'd like to pay"
      />
      <div className="flex gap-2 md:gap-4 mt-3">
        {[
          {
            type: "wallet",
            icon: Wallet,
            label: "Pay via Wallet",
            subtitle: `Balance: ₹${walletBalance || 0}`,
            disabled: (walletBalance || 0) < 500,
            color: "green",
          },
          {
            type: "cash",
            icon: Banknote,
            label: "Pay Cash",
            subtitle: "Pay at clinic",
            disabled: false,
            color: "amber",
          },
        ].map(({ type, icon: Icon, label, subtitle, disabled, color }, index) => (
          <motion.button
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={() => !disabled && setPaymentMethod(type)}
            disabled={disabled}
            className={`
              relative flex-1 p-3 md:p-5 rounded-xl md:rounded-2xl border-2 flex flex-col items-center justify-center gap-2 md:gap-3 
              font-black text-xs md:text-sm transition-all duration-300 overflow-hidden
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${
                paymentMethod === type && !disabled
                  ? "border-[#DD1764] bg-gradient-to-br from-pink-50 to-purple-50 text-[#3F2965] shadow-lg shadow-pink-200/50"
                  : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
              }
            `}
          >
            <motion.div
              animate={{
                scale: paymentMethod === type && !disabled ? [1, 1.1, 1] : 1,
                rotate: paymentMethod === type && !disabled ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className={`
                p-1.5 md:p-2 rounded-lg md:rounded-xl transition-all duration-300
                ${paymentMethod === type && !disabled ? "bg-[#DD1764]/10" : "bg-slate-50"}
              `}
            >
              <Icon
                size={16}
                className={`md:w-5 md:h-5 ${paymentMethod === type && !disabled ? "text-[#DD1764]" : ""}`}
              />
            </motion.div>
            <div className="text-center">
              <span className="block text-[10px] sm:text-xs md:text-sm">{label}</span>
              <span
                className={`block text-[8px] sm:text-[10px] mt-1 ${
                  paymentMethod === type && !disabled ? "text-[#DD1764]" : "text-slate-300"
                }`}
              >
                {subtitle}
              </span>
            </div>
            
            <AnimatePresence>
              {paymentMethod === type && !disabled && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute top-2 right-2"
                >
                  <Check size={14} className="text-[#DD1764]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
      
      <AnimatePresence>
        {paymentMethod === "cash" && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            </motion.div>
            <p className="text-xs text-amber-700 font-medium">
              Please pay ₹500 in cash at the clinic before your session begins.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Enhanced Confirmation Modal with Particles
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedTherapy,
  selectedDate,
  selectedSlot,
  formatTo12Hr,
  sessionType,
  paymentMethod,
}) => {
  const isPaidViaWallet = sessionType === "online" || paymentMethod === "wallet";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-8 max-w-md w-full shadow-2xl overflow-hidden"
          >
            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#DD1764] to-[#3F2965] rounded-full opacity-10 blur-2xl"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-10 blur-2xl"
              animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
            />

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={18} className="text-slate-400" />
            </motion.button>

            {/* Header */}
            <div className="relative flex items-center gap-2 md:gap-3 mb-4 md:mb-6 text-[#3F2965]">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 md:p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl md:rounded-2xl"
              >
                {isPaidViaWallet ? (
                  <Wallet size={20} className="md:w-6 md:h-6" />
                ) : (
                  <Banknote size={20} className="md:w-6 md:h-6" />
                )}
              </motion.div>
              <div>
                <h3 className="font-black text-lg md:text-xl">Confirm Booking</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">
                  {isPaidViaWallet ? "Wallet Payment" : "Cash Payment at Clinic"}
                </p>
              </div>
            </div>

            {/* Therapy info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 md:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl md:rounded-2xl mb-4 md:mb-6"
            >
              <p className="text-sm text-slate-600 leading-relaxed">
                You're booking{" "}
                <span className="font-black text-[#3F2965]">{selectedTherapy}</span>
              </p>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-50 rounded-xl md:rounded-2xl p-3 md:p-5 mb-5 md:mb-8 space-y-2 md:space-y-3"
            >
              {[
                { label: "Date", value: selectedDate, icon: CalendarIcon },
                { label: "Time", value: formatTo12Hr(selectedSlot), icon: Clock },
                {
                  label: "Session Type",
                  value: sessionType === "online" ? "Online" : "In-Person",
                  icon: sessionType === "online" ? Video : MapPin,
                },
                { label: "Fee", value: "₹500", icon: Wallet },
                {
                  label: "Payment",
                  value: isPaidViaWallet ? "Via Wallet" : "Cash at Clinic",
                  icon: isPaidViaWallet ? Wallet : Banknote,
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center justify-between text-[11px] md:text-xs font-bold"
                >
                  <span className="text-slate-400 flex items-center gap-2">
                    <item.icon size={14} />
                    {item.label}
                  </span>
                  <span className="text-[#3F2965]">{item.value}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Cash payment warning */}
            <AnimatePresence>
              {!isPaidViaWallet && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4"
                >
                  <AlertCircle size={16} className="text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">
                    Please pay ₹500 in cash at the clinic
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Security note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 p-3 bg-green-50 rounded-xl mb-6"
            >
              <Shield size={16} className="text-green-600" />
              <span className="text-xs font-medium text-green-700">
                {isPaidViaWallet ? "Your payment is secure and encrypted" : "Your booking is confirmed"}
              </span>
            </motion.div>

            {/* Buttons */}
            <div className="flex gap-4">
              <MagneticButton
                onClick={onClose}
                className="flex-1 py-4 text-xs font-black uppercase text-slate-400 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </MagneticButton>
              <MagneticButton
                onClick={onConfirm}
                className="flex-1 py-4 text-xs font-black uppercase text-white bg-gradient-to-r from-[#DD1764] to-[#e91e7e] rounded-xl shadow-lg shadow-pink-200 hover:opacity-90 transition-opacity"
              >
                {isPaidViaWallet ? "Confirm & Pay" : "Confirm Booking"}
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Success Overlay with Confetti
const SuccessOverlay = ({ isOpen, onNavigate, isPaidViaWallet }) => {
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-[#3F2965]/95 to-[#2a1a47]/95 backdrop-blur-md"
          />

          {/* Confetti */}
          {showConfetti && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: Math.random() * 12 + 6,
                    height: Math.random() * 12 + 6,
                    background: ["#DD1764", "#3F2965", "#7c3aed", "#fbbf24", "#34d399", "#f472b6", "#60a5fa"][i % 7],
                    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                    left: `${Math.random() * 100}%`,
                    top: -20,
                  }}
                  initial={{ y: -20, rotate: 0, opacity: 1 }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 720 - 360,
                    opacity: [1, 1, 0],
                    x: Math.random() * 200 - 100,
                  }}
                  transition={{
                    duration: 2.5 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>
          )}

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative bg-white rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 max-w-lg w-full text-center shadow-2xl overflow-hidden"
          >
            {/* Decorative floating elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    background: i % 2 === 0 ? "#DD1764" : "#3F2965",
                    top: `${20 + i * 10}%`,
                    left: `${5 + i * 12}%`,
                    opacity: 0.2,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mx-auto mb-6"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check size={32} className="text-white" strokeWidth={3} />
                </motion.div>
              </div>
              
              {/* Pulse rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.div
                    className="w-24 h-24 rounded-full border-4 border-green-300"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2 + i * 0.3, opacity: 0 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <TextReveal delay={0.3}>
              <h2 className="text-2xl md:text-3xl font-black text-[#3F2965] mb-2">
                Booking Confirmed! 🎉
              </h2>
            </TextReveal>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-slate-500 mb-8 font-medium"
            >
              Your session has been scheduled successfully. We've sent a confirmation to your email.
            </motion.p>

            {/* Cash payment reminder */}
            <AnimatePresence>
              {!isPaidViaWallet && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4"
                >
                  <p className="text-xs font-bold text-amber-700">
                    💰 Remember to pay ₹500 in cash at the clinic before your session!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-8"
            >
              <p className="text-xs font-bold text-[#3F2965]">
                💡 Tip: Add this session to your calendar to stay reminded!
              </p>
            </motion.div>

            {/* CTA Button */}
            <MagneticButton
              onClick={onNavigate}
              className="w-full py-5 bg-gradient-to-r from-[#3F2965] to-[#4a3275] text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-purple-200 hover:opacity-90 transition-opacity"
            >
              <span>View My Sessions</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </MagneticButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Error Alert
const ErrorAlert = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 text-red-600 rounded-2xl flex items-start gap-3 shadow-sm overflow-hidden"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="p-1 bg-red-100 rounded-lg shrink-0"
          >
            <AlertCircle size={16} />
          </motion.div>
          <p className="text-sm font-bold flex-1">{message}</p>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 hover:bg-red-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Enhanced Empty State
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center py-16 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-[2rem] border-2 border-dashed border-slate-200"
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="relative inline-block"
    >
      <Clock className="mx-auto text-slate-200 mb-4" size={56} />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center"
      >
        <X size={12} className="text-slate-400" />
      </motion.div>
    </motion.div>
    <p className="text-sm font-black text-slate-400 uppercase mb-2">No Slots Available</p>
    <p className="text-xs text-slate-300">Try selecting a different date</p>
  </motion.div>
);

// Session Info Card
const SessionInfoCard = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-center justify-between text-xs font-bold p-3 bg-slate-50 rounded-xl"
  >
    <span className="text-slate-400 flex items-center gap-2">
      <Icon size={14} />
      {label}
    </span>
    <span className="text-[#3F2965]">{value}</span>
  </motion.div>
);


// ==================== MAIN COMPONENT ====================
const BookingPage = () => {
const { user, loading: authLoading } = useAuth();
const navigate = useNavigate();
const scrollableRef = useRef(null);

// --- States ---
const [selectedSlot, setSelectedSlot] = useState("");
const [sessionType, setSessionType] = useState("online");
const [selectedTherapy, setSelectedTherapy] = useState("Cognitive Behavioural Therapy (CBT)");
const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
const [note, setNote] = useState("");
const [availableSlots, setAvailableSlots] = useState([]);
const [availabilityId, setAvailabilityId] = useState("");
const [loadingSlots, setLoadingSlots] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [errorMsg, setErrorMsg] = useState("");
const [paymentMethod, setPaymentMethod] = useState("wallet");
const [showConfirmModal, setShowConfirmModal] = useState(false);
const [showSuccess, setShowSuccess] = useState(false);
const [pageLoaded, setPageLoaded] = useState(false);

    const therapies = [
    "Cognitive Behavioural Therapy (CBT)",
    "Dialectical Behavioural Therapy (DBT)",
    "Acceptance & Commitment Therapy (ACT)",
    "Schema Therapy",
    "Emotion-Focused Therapy (EFT)",
    "Emotion-Focused Couples Therapy",
    "Mindfulness-Based Cognitive Therapy",
    "Client-Centred Therapy",
  ];

  // Page load animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setPageLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Reset payment method to wallet when switching to online
  useEffect(() => {
    if (sessionType === "online") {
      setPaymentMethod("wallet");
    }
  }, [sessionType]);

  // Calculate progress step
  const currentStep = selectedSlot ? 2 : selectedTherapy ? 1 : 0;

  useEffect(() => {
    if (errorMsg && scrollableRef.current) {
      scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [errorMsg]);

  const formatTo12Hr = (time24) => {
    if (!time24 || typeof time24 !== "string") return time24;
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setErrorMsg("");
    setSelectedSlot("");
    setAvailabilityId("");
    try {
      const res = await API.get(`/appointment/get-availability?date=${selectedDate}`);
      let fetchedSlots = res.data.data?.slots || [];
      const fetchedId = res.data.data?.availabilityId || "";
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      if (selectedDate === todayStr) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        fetchedSlots = fetchedSlots.filter((slot) => {
          const [slotHour, slotMinute] = slot.split(":").map(Number);
          if (slotHour > currentHour) return true;
          if (slotHour === currentHour && slotMinute > currentMinute) return true;
          return false;
        });
      }

      setAvailableSlots(fetchedSlots);
      setAvailabilityId(fetchedId);
      if (fetchedSlots.length === 0 && selectedDate === todayStr) {
        setErrorMsg("No more slots available for today.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error fetching availability");
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const morningSlots = availableSlots.filter(
    (slot) => parseInt(slot.split(":")[0]) < 12
  );
  const eveningSlots = availableSlots.filter(
    (slot) => parseInt(slot.split(":")[0]) >= 12
  );

  const getIsPaidViaWallet = () => {
    if (sessionType === "online") {
      return true;
    }
    return paymentMethod === "wallet";
  };

  const initiateBooking = () => {
    setErrorMsg("");
    if (!selectedSlot) {
      setErrorMsg("Please select a time slot first.");
      return;
    }

    const isPaidViaWallet = getIsPaidViaWallet();
    if (isPaidViaWallet && (user?.walletBalance || 0) < 500) {
      setErrorMsg(
        "Insufficient wallet balance. Please add funds or select cash payment for in-person sessions."
      );
      return;
    }

    setShowConfirmModal(true);
  };

  const handleFinalPayment = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    setErrorMsg("");

    const isPaidViaWallet = getIsPaidViaWallet();

    try {
      await API.post("/appointment/book", {
        therapyType: selectedTherapy,
        date: selectedDate,
        timeSlot: selectedSlot,
        sessionType: sessionType,
        notes: note,
        availabilityRef: availabilityId,
        isPaidViaWallet: isPaidViaWallet,
      });

      if (isPaidViaWallet) {
        user.walletBalance -= 500;
      }

      setShowSuccess(true);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Transaction failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isPaidViaWallet = getIsPaidViaWallet();

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
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

  return (
    <IsLoginUser user={user} loading={authLoading}>
      <IsVerifiedUser user={user}>
        <IsProfileCompleteUser user={user}>
          <>
            {/* Shimmer Animation Keyframes */}
            <style>{`
              @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
              }
              
              @keyframes glow {
                0%, 100% { box-shadow: 0 0 20px rgba(221, 23, 100, 0.3); }
                50% { box-shadow: 0 0 40px rgba(221, 23, 100, 0.5); }
              }
              
              .animate-glow {
                animation: glow 2s ease-in-out infinite;
              }
              
              .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(180deg, #3F2965, #DD1764);
                border-radius: 10px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f5f9;
              }
            `}</style>

            {/* Scroll Progress Bar */}
            <ScrollProgressBar />

            {/* Navbar */}
            <Navbar />

            <div className="min-h-screen pt-24 bg-gradient-to-br from-[#FDFCFD] via-white to-purple-50/30 font-sans flex flex-col relative overflow-hidden">
              {/* Floating Background Shapes */}
              <FloatingShapes />

              {/* Modals */}
              <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleFinalPayment}
                selectedTherapy={selectedTherapy}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                formatTo12Hr={formatTo12Hr}
                sessionType={sessionType}
                paymentMethod={paymentMethod}
              />

              <SuccessOverlay
                isOpen={showSuccess}
                onNavigate={() =>
                  navigate(`/profile#${encodeURIComponent("My Bookings")}`)
                }
                isPaidViaWallet={isPaidViaWallet}
              />

              {/* Main Content */}
              <motion.main
                variants={containerVariants}
                initial="hidden"
                animate={pageLoaded ? "visible" : "hidden"}
                className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col px-4 md:px-8 pb-6"
              >
                {/* Header Section */}
                <motion.header
                  variants={itemVariants}
                  className="py-3 md:py-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                    <div>
                      <TextReveal>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                          <span className="bg-gradient-to-r from-[#DD1764] via-[#3F2965] to-[#DD1764] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                            Schedule Session
                          </span>
                        </h1>
                      </TextReveal>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-slate-400 mt-1 font-medium"
                      >
                        Book your personalized therapy session
                      </motion.p>
                    </div>
                    <ProgressStepper currentStep={currentStep} />
                  </div>
                </motion.header>

                {/* Main Grid */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 overflow-hidden pb-4">
                  {/* Sidebar */}
                  <motion.aside
                    variants={itemVariants}
                    className="flex flex-col gap-4 md:gap-6 overflow-hidden"
                  >
                    {/* Therapy Type Card */}
                    <GlowingCard className="group flex-1 overflow-hidden">
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] border border-white/50 shadow-xl shadow-purple-100/20 h-full overflow-y-auto custom-scrollbar max-h-100 lg:max-h-none"
                      >
                        <motion.h2
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="font-black text-base md:text-lg mb-4 md:mb-6 text-[#3F2965] flex items-center gap-2"
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={20} className="text-[#DD1764]" />
                          </motion.div>
                          THERAPY TYPE
                        </motion.h2>
                        <div className="space-y-2">
                          {therapies.map((t, index) => (
                            <TherapyCard
                              key={t}
                              therapy={t}
                              isSelected={selectedTherapy === t}
                              onClick={() => setSelectedTherapy(t)}
                              index={index}
                            />
                          ))}
                        </div>
                      </motion.div>
                    </GlowingCard>

                    {/* Session Details Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/80 backdrop-blur-xl p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/50 shadow-xl shadow-purple-100/20 shrink-0"
                    >
                      <h3 className="font-black mb-3 md:mb-4 flex items-center gap-2 text-[10px] md:text-xs uppercase text-[#3F2965]">
                        <motion.div
                          animate={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Info size={14} className="text-[#DD1764] md:w-4 md:h-4" />
                        </motion.div>
                        Session Details
                      </h3>
                      <div className="space-y-2 md:space-y-3">
                        <SessionInfoCard icon={Clock} label="Duration" value="60 Minutes" />
                        <SessionInfoCard icon={Wallet} label="Session Fee" value="₹500" />
                      </div>

                      {/* Additional Info */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                      >
                        <div className="flex items-center gap-2 text-xs font-bold text-[#3F2965]">
                          <Shield size={14} className="text-green-500" />
                          <span>100% Confidential & Secure</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </motion.aside>

                  {/* Main Content Section */}
                  <motion.section
                    variants={itemVariants}
                    className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl shadow-purple-100/20 flex flex-col overflow-hidden"
                  >
                    <div
                      ref={scrollableRef}
                      className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar"
                    >
                      {/* Error Alert */}
                      <ErrorAlert message={errorMsg} onClose={() => setErrorMsg("")} />

                      {/* Date Picker Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-6 md:mb-10"
                      >
                        <SectionTitle
                          icon={<CalendarIcon size={16} className="md:w-4 md:h-4" />}
                          title="Choose Date"
                          subtitle="Select your preferred date"
                        />
                        <div className="flex flex-col sm:flex-row items-stretch gap-2 md:gap-3 mt-2 md:mt-3">
                          <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="relative flex-1"
                          >
                            <input
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              className="w-full p-4 pr-12 rounded-2xl bg-slate-50 font-bold text-[#3F2965] outline-none border-2 border-transparent focus:border-[#3F2965]/20 transition-all duration-300 hover:bg-slate-100"
                            />
                            <motion.div
                              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              
                            </motion.div>
                          </motion.div>
                          
                          <AnimatedButton
                            onClick={fetchSlots}
                            disabled={loadingSlots}
                            className="px-8 py-4 bg-gradient-to-r from-[#3F2965] to-[#4a3275] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-200 hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            {loadingSlots ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 size={18} />
                              </motion.div>
                            ) : (
                              <>
                                <Search size={16} className="md:w-4 md:h-4" />
                                <span className="hidden sm:inline">Find Slots</span>
                              </>
                            )}
                          </AnimatedButton>
                        </div>
                      </motion.div>

                      {/* Session Type Toggle */}
                      <SessionTypeToggle
                        sessionType={sessionType}
                        setSessionType={setSessionType}
                      />

                      {/* Payment Method Selector - Only for offline */}
                      <AnimatePresence>
                        {sessionType === "offline" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <PaymentMethodSelector
                              paymentMethod={paymentMethod}
                              setPaymentMethod={setPaymentMethod}
                              walletBalance={user?.walletBalance}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Time Slots Section */}
                      <div className="space-y-10">
                        {loadingSlots ? (
                          <div className="space-y-8">
                            <div>
                              <div className="flex items-center gap-4 mb-4">
                                <motion.div
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1.5, repeat: Infinity }}
                                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50"
                                />
                                <div className="space-y-2">
                                  <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-24 h-4 bg-gradient-to-r from-slate-100 to-slate-50 rounded"
                                  />
                                  <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                    className="w-16 h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded"
                                  />
                                </div>
                              </div>
                              <SlotSkeleton />
                            </div>
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <EmptyState />
                        ) : (
                          <>
                            {morningSlots.length > 0 && (
                              <SlotGroup
                                title="Morning"
                                icon={<Sun size={18} className="text-amber-500" />}
                                slots={morningSlots}
                                selectedSlot={selectedSlot}
                                onSelect={setSelectedSlot}
                                formatter={formatTo12Hr}
                              />
                            )}
                            {eveningSlots.length > 0 && (
                              <SlotGroup
                                title="Afternoon & Evening"
                                icon={<Moon size={18} className="text-indigo-500" />}
                                slots={eveningSlots}
                                selectedSlot={selectedSlot}
                                onSelect={setSelectedSlot}
                                formatter={formatTo12Hr}
                              />
                            )}
                          </>
                        )}
                      </div>

                      {/* Notes Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 md:mt-12"
                      >
                        <SectionTitle
                          icon={<MessageSquare size={16} className="md:w-4 md:h-4" />}
                          title="Session Notes"
                          subtitle="Private & Confidential"
                        />
                        <div className="relative">
                          <motion.textarea
                            whileFocus={{ scale: 1.01 }}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Share any specific concerns or topics you'd like to discuss..."
                            maxLength={500}
                            className="w-full mt-2 md:mt-3 p-3 md:p-5 rounded-2xl md:rounded-3xl bg-slate-50 h-28 md:h-32 resize-none text-xs md:text-sm font-medium outline-none border-2 border-transparent focus:border-[#3F2965]/20 focus:bg-white transition-all duration-300"
                          />
                          <motion.div
                            className="absolute bottom-4 right-4 text-[10px] font-bold"
                            animate={{
                              color: note.length >= 450 ? "#DD1764" : "#94a3b8",
                            }}
                          >
                            {note.length}/500
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Footer / Action Bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="p-4 md:p-8 border-t border-slate-100 bg-white/80 backdrop-blur-sm shrink-0"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
                        {/* Payment Info */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center gap-3 md:gap-4 w-full md:w-auto"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`p-2 md:p-3 rounded-xl md:rounded-2xl ${
                              isPaidViaWallet
                                ? "bg-gradient-to-br from-green-50 to-emerald-50 text-green-600"
                                : "bg-gradient-to-br from-amber-50 to-orange-50 text-amber-600"
                            }`}
                          >
                            {isPaidViaWallet ? (
                              <Wallet size={20} className="md:w-6 md:h-6" />
                            ) : (
                              <Banknote size={20} className="md:w-6 md:h-6" />
                            )}
                          </motion.div>
                          <div>
                            <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-wide md:tracking-widest">
                              Payment Method
                            </p>
                            <p className="text-xs md:text-sm font-bold text-[#3F2965]">
                              {isPaidViaWallet
                                ? `Wallet Balance: ₹${user?.walletBalance || 0}`
                                : "Cash Payment at Clinic"}
                            </p>
                          </div>
                        </motion.div>

                        {/* Book Button */}
                        <MagneticButton
                          disabled={submitting || !selectedSlot || !availabilityId}
                          onClick={initiateBooking}
                          className={`
                            w-full md:w-auto px-6 md:px-12 py-3.5 md:py-5 
                            bg-gradient-to-r from-[#DD1764] to-[#e91e7e] 
                            text-white font-black rounded-xl md:rounded-2xl 
                            shadow-xl shadow-pink-200 
                            hover:opacity-90 active:scale-[0.98]
                            disabled:opacity-30 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2 md:gap-3 
                            transition-all duration-300
                            text-xs md:text-base
                            ${selectedSlot && !submitting ? "animate-glow" : ""}
                          `}
                        >
                          {submitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Loader2 size={18} />
                              </motion.div>
                              <span className="hidden sm:inline">Processing...</span>
                            </>
                          ) : (
                            <>
                              <motion.div
                                animate={selectedSlot ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 0.5, repeat: Infinity }}
                              >
                                <Check size={18} />
                              </motion.div>
                              <span>
                                {isPaidViaWallet ? "Confirm & Pay ₹500" : "Confirm Booking"}
                              </span>
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight size={16} className="hidden sm:block" />
                              </motion.div>
                            </>
                          )}
                        </MagneticButton>
                      </div>

                      {/* Trust Indicators */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-100"
                      >
                        {[
                          { icon: Shield, text: "Secure Payment" },
                          { icon: Clock, text: "Instant Confirmation" },
                          { icon: Heart, text: "24/7 Support" },
                        ].map((item, index) => (
                          <motion.div
                            key={item.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="flex items-center gap-1.5 text-[10px] text-slate-400"
                          >
                            <item.icon size={12} className="text-green-500" />
                            <span className="font-medium">{item.text}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  </motion.section>
                </div>
              </motion.main>
            </div>

            {/* Footer */}
            <Footer />
          </>
        </IsProfileCompleteUser>
      </IsVerifiedUser>
    </IsLoginUser>
  );
};

export default BookingPage;
