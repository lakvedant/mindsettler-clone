import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  AnimatePresence,
  useMotionValue,
  useInView,
} from "framer-motion";
import { Link } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";

// ============== PARTICLE SYSTEM ==============
const FloatingParticle = ({ delay, duration, size, startX, startY }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: startX,
      top: startY,
      background: `radial-gradient(circle, rgba(139, 92, 246, 0.3), rgba(221, 23, 100, 0.1))`,
      filter: "blur(1px)",
    }}
    animate={{
      y: [0, -80, -160],
      x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
      opacity: [0, 0.6, 0],
      scale: [0.5, 1, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

// ============== GLOWING ORB CURSOR FOLLOWER ==============
const GlowingOrb = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouse = (e) => {
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-0"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(221,23,100,0.04) 40%, transparent 70%)",
        filter: "blur(40px)",
      }}
    />
  );
};

// ============== ANIMATED COUNTER ==============
const AnimatedNumber = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = target;
    const duration = 2000;
    const stepTime = Math.max(duration / end, 10);

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

// ============== STATS BAR ==============
const StatsBar = () => {
  const stats = [
    { number: 200, suffix: "+", label: "Users Helped" },
    { number: 95, suffix: "%", label: "Feel Better" },
    { number: 4, suffix: " Steps", label: "To Clarity" },
    { number: 4, suffix: " Weeks", label: "Avg. Progress" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-20"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          className="text-center p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/50"
          whileHover={{ y: -5, boxShadow: "0 10px 40px rgba(63,41,101,0.1)" }}
          transition={{ type: "spring" }}
        >
          <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3F2965] to-[#Dd1764]">
            <AnimatedNumber target={stat.number} suffix={stat.suffix} />
          </div>
          <div className="text-xs md:text-sm text-[#3F2965]/50 mt-1 font-medium">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============== EXPANDED CARD (MODAL STYLE) ==============
const ExpandedCard = ({ step, index, isOpen, onClose, isMobile }) => {
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.85,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.08,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      y: 20,
      transition: { duration: 0.25 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full screen backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Card - always centered on screen */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[92vw] max-w-md"
          >
            <div className="relative overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl">
              {/* Gradient header bar */}
              <div className="h-1.5 bg-gradient-to-r from-[#3F2965] via-[#7c3aed] to-[#Dd1764]" />

              {/* Card content */}
              <div className="p-6">
                {/* Header */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-4 mb-5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3F2965] to-[#Dd1764] flex items-center justify-center shadow-lg shrink-0">
                    <span className="text-2xl">{step.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-[#3F2965]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#3F2965]/50 truncate">
                      {step.desc}
                    </p>
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
                  >
                    ✕
                  </motion.button>
                </motion.div>

                {/* Inner content title */}
                <motion.h4
                  variants={itemVariants}
                  className="text-lg font-semibold text-[#3F2965] mb-4"
                >
                  {step.innerContent.title}
                </motion.h4>

                {/* Points */}
                <div className="space-y-3 mb-5">
                  {step.innerContent.points.map((point, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3F2965]/10 to-[#Dd1764]/10 flex items-center justify-center shrink-0">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764]"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      </div>
                      <span className="text-sm text-[#3F2965]/70 font-medium">
                        {point}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.div
                  variants={itemVariants}
                  className="relative p-4 rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3F2965]/5 to-[#Dd1764]/5" />
                  <div className="absolute top-1 left-3 text-4xl text-[#Dd1764]/10 font-serif">
                    "
                  </div>
                  <p className="relative text-sm text-[#3F2965]/60 italic pl-4">
                    {step.innerContent.quote}
                  </p>
                </motion.div>

                {/* Progress bar */}
                <motion.div variants={itemVariants} className="mt-5">
                  <div className="flex justify-between text-xs text-[#3F2965]/40 mb-2">
                    <span>Journey Progress</span>
                    <span>{(index + 1) * 25}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(index + 1) * 25}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============== SINGLE MILESTONE ROW ==============
const MilestoneRow = ({ step, index, isActive, onClick, isMobile }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
      className="relative flex items-center justify-center py-8 md:py-12"
    >
      {/* Left side label (desktop) */}
      <div
        className={`hidden md:flex flex-1 ${isLeft ? "justify-end pr-8" : "justify-end pr-8 opacity-0"
          }`}
      >
        {isLeft && (
          <motion.div
            className="text-right max-w-[220px]"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-lg font-bold text-[#3F2965]">{step.title}</h3>
            <p className="text-sm text-[#3F2965]/40 mt-1">{step.desc}</p>
          </motion.div>
        )}
      </div>

      {/* Center Node */}
      <div className="relative z-20 shrink-0">
        {/* Pulse ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            background: `radial-gradient(circle, ${isActive ? "rgba(221,23,100,0.25)" : "rgba(63,41,101,0.15)"
              }, transparent 70%)`,
          }}
          animate={{
            scale: isActive ? [1, 1.8, 1] : [1, 1.4, 1],
            opacity: isActive ? [0.6, 0, 0.6] : [0.3, 0, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Main node button */}
        <motion.button
          onClick={onClick}
          className="relative w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#Dd1764]/50 focus:ring-offset-2"
          style={{
            background: isActive
              ? "linear-gradient(135deg, #Dd1764, #3F2965)"
              : "linear-gradient(135deg, #3F2965, #5a3d7a)",
            boxShadow: isActive
              ? "0 0 30px rgba(221,23,100,0.4), 0 0 60px rgba(221,23,100,0.15)"
              : "0 4px 20px rgba(63,41,101,0.3)",
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className="text-2xl md:text-3xl">{step.icon}</span>

          {/* Step number badge */}
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
            <span className="text-xs font-bold text-[#3F2965]">
              {index + 1}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Right side label (desktop) */}
      <div
        className={`hidden md:flex flex-1 ${!isLeft ? "justify-start pl-8" : "justify-start pl-8 opacity-0"
          }`}
      >
        {!isLeft && (
          <motion.div
            className="text-left max-w-[220px]"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h3 className="text-lg font-bold text-[#3F2965]">{step.title}</h3>
            <p className="text-sm text-[#3F2965]/40 mt-1">{step.desc}</p>
          </motion.div>
        )}
      </div>

      {/* Mobile label (below node) */}
      <motion.div
        className="md:hidden absolute -bottom-2 left-1/2 -translate-x-1/2 text-center whitespace-nowrap"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-bold text-[#3F2965]">{step.title}</h3>
      </motion.div>
    </motion.div>
  );
};

// ============== VERTICAL CONNECTING LINE ==============
const VerticalPath = ({ scrollProgress, totalSteps }) => {
  const pathLength = useSpring(scrollProgress, {
    stiffness: 20,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px] z-0">
      {/* Background dashed line */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(63,41,101,0.3) 50%, transparent 50%)",
          backgroundSize: "2px 12px",
        }}
      />

      {/* Animated progress line */}
      <motion.div
        className="absolute top-0 left-0 right-0 origin-top"
        style={{
          scaleY: pathLength,
          background:
            "linear-gradient(to bottom, #3F2965, #7c3aed, #Dd1764, #ec4899)",
          borderRadius: "4px",
          height: "100%",
          filter: "drop-shadow(0 0 6px rgba(124,58,237,0.4))",
        }}
      />
    </div>
  );
};

// ============== MAIN COMPONENT ==============
const JourneySection = () => {
  const containerRef = useRef(null);
  const journeyRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
    layoutEffect: false,
  });

  const milestones = [
    {
      title: "Awareness",
      desc: "Recognizing the patterns of your mind.",
      icon: "🧘",
      innerContent: {
        title: "Deep Dive into Awareness",
        points: [
          "Understand your thought patterns",
          "Identify emotional triggers",
          "Practice mindful observation",
          "Build self-awareness habits",
        ],
        quote:
          "The first step toward change is awareness. The second is acceptance.",
      },
    },
    {
      title: "Discovery",
      desc: "Exploring evidence-based tools for you.",
      icon: "💡",
      innerContent: {
        title: "Tools for Transformation",
        points: [
          "Cognitive behavioral techniques",
          "Meditation & breathing practices",
          "Structured journaling methods",
          "Personalized exercise plans",
        ],
        quote:
          "Discovery consists of seeing what everybody has seen and thinking what nobody has thought.",
      },
    },
    {
      title: "Practice",
      desc: "Implementing daily rituals and exercises.",
      icon: "🌱",
      innerContent: {
        title: "Building Your Practice",
        points: [
          "Morning mindfulness routine",
          "Evening reflection sessions",
          "Weekly progress reviews",
          "Community support circles",
        ],
        quote: "Practice makes progress, not perfection.",
      },
    },
    {
      title: "Clarity",
      desc: "Walking forward with renewed purpose.",
      icon: "✨",
      innerContent: {
        title: "Achieving Mental Clarity",
        points: [
          "Clear decision-making skills",
          "Emotional resilience & strength",
          "Purpose-driven daily living",
          "Sustainable long-term well-being",
        ],
        quote: "Clarity comes from engagement, not thought.",
      },
    },
  ];

  const handleNodeClick = useCallback(
    (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    },
    [activeIndex]
  );

  const handleCloseCard = useCallback(() => {
    setActiveIndex(null);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, 
          #faf5ff 0%, 
          #f5f0ff 15%,
          #fdf2f8 30%, 
          #fce7f3 50%,
          #f3e8ff 70%,
          #ede9fe 85%,
          #faf5ff 100%
        )`,
      }}
    >
      {/* Cursor follower glow - desktop only */}
      {!isMobile && <GlowingOrb />}

      {/* ========= AMBIENT BACKGROUND ========= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)",
            top: "10%",
            left: "-10%",
          }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(221,23,100,0.06), transparent 70%)",
            top: "40%",
            right: "-10%",
          }}
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[550px] h-[550px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)",
            bottom: "5%",
            left: "20%",
          }}
          animate={{ x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating particles - desktop only */}
        {!isMobile &&
          [...Array(15)].map((_, i) => (
            <FloatingParticle
              key={i}
              delay={i * 0.6}
              duration={5 + Math.random() * 4}
              size={4 + Math.random() * 6}
              startX={`${10 + Math.random() * 80}%`}
              startY={`${20 + Math.random() * 60}%`}
            />
          ))}

        {/* Mesh gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.5) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 60%, rgba(255,255,255,0.4) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 90%, rgba(255,255,255,0.3) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* ========= TOP WAVE ========= */}
      <svg
        className="absolute top-0 left-0 w-full h-24 z-[5]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 96"
      >
        <path
          fill="url(#waveGrad)"
          d="M0,48 C240,96 480,0 720,48 C960,96 1200,0 1440,48 L1440,0 L0,0 Z"
        />
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(63,41,101,0.06)" />
            <stop offset="50%" stopColor="rgba(221,23,100,0.06)" />
            <stop offset="100%" stopColor="rgba(63,41,101,0.06)" />
          </linearGradient>
        </defs>
      </svg>

      {/* ========= MAIN CONTENT ========= */}
      <div className="max-w-6xl mx-auto relative px-4 pt-28 z-10">
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          <motion.div
            initial={
              isMobile ? { opacity: 1 } : { opacity: 0, y: -20, scale: 0.9 }
            }
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring" }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2.5 rounded-full bg-white/70 backdrop-blur-md border border-[#3F2965]/10 text-[#Dd1764] font-bold tracking-[0.3em] uppercase text-xs shadow-lg shadow-purple-500/5">
              ✦ The Path Forward ✦
            </span>
          </motion.div>

          <motion.h2
            initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mt-4 leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3F2965] via-[#7c3aed] to-[#3F2965]">
              Your Mental
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#Dd1764] via-[#ec4899] to-[#Dd1764]">
              Wellness Journey
            </span>
          </motion.h2>

          <motion.p
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-[#3F2965]/50 text-lg md:text-xl mt-6 max-w-xl mx-auto font-medium leading-relaxed"
          >
            {isMobile
              ? "Tap each milestone to explore your path"
              : "Click each milestone to reveal your transformation journey"}
          </motion.p>

          {/* Animated line - desktop */}
          {!isMobile && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-1 rounded-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764]"
                animate={{ width: [64, 100, 64] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </div>

        {/* Stats Bar */}
        <StatsBar />

        {/* ========= JOURNEY TIMELINE ========= */}
        <div ref={journeyRef} className="relative max-w-4xl mx-auto">
          {/* Vertical connecting line */}
          <VerticalPath
            scrollProgress={scrollYProgress}
            totalSteps={milestones.length}
          />

          {/* Milestone Rows - uses normal document flow, no absolute positioning */}
          <div className="relative z-10">
            {milestones.map((step, index) => (
              <MilestoneRow
                key={index}
                step={step}
                index={index}
                isActive={activeIndex === index}
                onClick={() => handleNodeClick(index)}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* End point indicator */}
          <motion.div
            className="flex justify-center py-8"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            <motion.div
              className="w-4 h-4 rounded-full bg-gradient-to-r from-[#Dd1764] to-[#ec4899] shadow-lg"
              animate={{
                scale: [1, 1.3, 1],
                boxShadow: [
                  "0 0 10px rgba(221,23,100,0.3)",
                  "0 0 25px rgba(221,23,100,0.5)",
                  "0 0 10px rgba(221,23,100,0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Expanded Card - rendered as a portal-like overlay, completely separate from layout */}
        {milestones.map((step, index) => (
          <ExpandedCard
            key={`card-${index}`}
            step={step}
            index={index}
            isOpen={activeIndex === index}
            onClose={handleCloseCard}
            isMobile={isMobile}
          />
        ))}

        {/* ========= BOTTOM CTA ========= */}
        <motion.div
          initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center pb-24 pt-16 relative z-10"
        >
          <motion.p
            className="text-[#3F2965]/40 text-sm mb-8 font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to transform your mental wellness?
          </motion.p>

          <motion.div
            className="relative inline-block"
            whileHover={!isMobile ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
          >
            {/* Multi-layer glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764] blur-2xl opacity-30"
              animate={!isMobile ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-[#Dd1764] to-[#3F2965] blur-xl opacity-20"
              animate={!isMobile ? { scale: [1.1, 1, 1.1] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            <Link to="/booking">
              <button className="relative px-10 md:px-14 py-4 md:py-5 rounded-full bg-gradient-to-r from-[#3F2965] via-[#5a3d7a] to-[#Dd1764] text-white font-bold text-base md:text-lg shadow-2xl hover:shadow-[#Dd1764]/30 transition-all duration-300 overflow-hidden">
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <span className="relative flex items-center gap-3">
                  Start Your Journey
                  <motion.span
                    animate={!isMobile ? { x: [0, 5, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl"
                  >
                    →
                  </motion.span>
                </span>
              </button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8 text-[#3F2965]/30 text-xs font-medium"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className="flex items-center gap-1">🔒 Secure</span>
            <span className="flex items-center gap-1">⚡ Free Start</span>
            <span className="flex items-center gap-1">💜 No Commitment</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySection;