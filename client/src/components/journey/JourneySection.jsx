import { useRef, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";

const JourneySection = () => {
  const containerRef = useRef(null);
  const [openBook, setOpenBook] = useState(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
    layoutEffect: false,
  });

  // Slow and smooth animation
  const pathLength = useSpring(scrollYProgress, {
    stiffness: 10,
    damping: 40,
    restDelta: 0.0001,
  });

  const milestones = [
    {
      title: "Awareness",
      desc: "Recognizing the patterns of your mind.",
      side: "left",
      icon: "🧘",
      innerContent: {
        title: "Deep Dive into Awareness",
        points: [
          "Understand your thought patterns",
          "Identify emotional triggers",
          "Practice mindful observation",
          "Build self-awareness habits",
        ],
        quote: "The first step toward change is awareness.",
      },
    },
    {
      title: "Discovery",
      desc: "Exploring evidence-based tools for you.",
      side: "right",
      icon: "💡",
      innerContent: {
        title: "Tools for Transformation",
        points: [
          "Cognitive behavioral techniques",
          "Meditation practices",
          "Journaling methods",
          "Breathing exercises",
        ],
        quote: "Discovery consists of seeing what everybody has seen.",
      },
    },
    {
      title: "Practice",
      desc: "Implementing daily rituals and exercises.",
      side: "left",
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
      side: "right",
      icon: "✨",
      innerContent: {
        title: "Achieving Mental Clarity",
        points: [
          "Clear decision-making skills",
          "Emotional resilience",
          "Purpose-driven living",
          "Sustainable well-being",
        ],
        quote: "Clarity comes from engagement, not thought.",
      },
    },
  ];

  // Bubble configuration - matching the reference image style
  const bubbles = [
    // Large bubbles
    { size: 280, x: "5%", y: "8%", opacity: 0.15, color: "purple", delay: 0 },
    { size: 320, x: "75%", y: "5%", opacity: 0.12, color: "pink", delay: 0.5 },
    { size: 250, x: "85%", y: "25%", opacity: 0.18, color: "purple", delay: 1 },
    { size: 300, x: "-5%", y: "35%", opacity: 0.14, color: "pink", delay: 1.5 },
    { size: 280, x: "70%", y: "45%", opacity: 0.16, color: "purple", delay: 2 },
    { size: 260, x: "10%", y: "55%", opacity: 0.13, color: "pink", delay: 0.3 },
    { size: 290, x: "80%", y: "65%", opacity: 0.15, color: "purple", delay: 0.8 },
    { size: 270, x: "0%", y: "75%", opacity: 0.17, color: "pink", delay: 1.2 },
    { size: 310, x: "65%", y: "85%", opacity: 0.14, color: "purple", delay: 1.8 },
    
    // Medium bubbles
    { size: 180, x: "30%", y: "12%", opacity: 0.12, color: "pink", delay: 0.2 },
    { size: 160, x: "55%", y: "20%", opacity: 0.14, color: "purple", delay: 0.7 },
    { size: 200, x: "20%", y: "30%", opacity: 0.11, color: "pink", delay: 1.1 },
    { size: 170, x: "45%", y: "42%", opacity: 0.13, color: "purple", delay: 0.4 },
    { size: 190, x: "60%", y: "55%", opacity: 0.15, color: "pink", delay: 0.9 },
    { size: 175, x: "35%", y: "68%", opacity: 0.12, color: "purple", delay: 1.4 },
    { size: 185, x: "50%", y: "78%", opacity: 0.14, color: "pink", delay: 1.7 },
    { size: 165, x: "25%", y: "88%", opacity: 0.11, color: "purple", delay: 2.1 },
    
    // Small bubbles
    { size: 100, x: "15%", y: "18%", opacity: 0.10, color: "purple", delay: 0.1 },
    { size: 90, x: "40%", y: "8%", opacity: 0.12, color: "pink", delay: 0.6 },
    { size: 110, x: "68%", y: "32%", opacity: 0.09, color: "purple", delay: 1.3 },
    { size: 95, x: "8%", y: "48%", opacity: 0.11, color: "pink", delay: 0.5 },
    { size: 105, x: "90%", y: "52%", opacity: 0.10, color: "purple", delay: 1.6 },
    { size: 85, x: "42%", y: "62%", opacity: 0.12, color: "pink", delay: 1.9 },
    { size: 115, x: "78%", y: "72%", opacity: 0.08, color: "purple", delay: 2.2 },
    { size: 92, x: "18%", y: "82%", opacity: 0.11, color: "pink", delay: 0.8 },
    { size: 88, x: "55%", y: "92%", opacity: 0.10, color: "purple", delay: 1.0 },
  ];

  // Book Card Component
  const BookCard = ({ step, index }) => {
    const isOpen = openBook === index;

    // Handle card interaction - toggle on mobile, hover on desktop
    const handleClick = () => {
      if (isMobile) {
        setOpenBook(isOpen ? null : index);
      }
    };

    return (
      <div
        className="relative w-72 h-80 cursor-pointer"
        style={{ perspective: "1500px" }}
        onClick={handleClick}
        onMouseEnter={() => !isMobile && setOpenBook(index)}
        onMouseLeave={() => !isMobile && setOpenBook(null)}
      >
        {/* Book Shadow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: isOpen
              ? "20px 20px 60px rgba(63,41,101,0.25), -5px 5px 30px rgba(221,23,100,0.15)"
              : "10px 10px 30px rgba(63,41,101,0.15)",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Back Page (Revealed Content) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
          {/* Inner Content */}
          <div className="relative p-5 h-full flex flex-col">
            <motion.h4
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ delay: isOpen ? 0.3 : 0, duration: 0.3 }}
              className="text-lg font-bold text-[#3F2965] mb-3"
            >
              {step.innerContent.title}
            </motion.h4>

            <motion.ul
              className="space-y-2 flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ delay: isOpen ? 0.4 : 0, duration: 0.3 }}
            >
              {step.innerContent.points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: isOpen ? 0 : -10, opacity: isOpen ? 1 : 0 }}
                  transition={{ delay: isOpen ? 0.4 + i * 0.1 : 0 }}
                  className="flex items-start gap-2 text-[#3F2965]/70 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764] mt-1.5 shrink-0" />
                  {point}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ delay: isOpen ? 0.7 : 0 }}
              className="mt-3 p-3 bg-gradient-to-r from-[#3F2965]/5 to-[#Dd1764]/5 rounded-xl"
            >
              <p className="text-[#3F2965]/60 italic text-xs">
                "{step.innerContent.quote}"
              </p>
            </motion.div>
          </div>
        </div>

        {/* Book Spine */}
        <motion.div
          className="absolute top-0 bottom-0 w-2 bg-gradient-to-b from-[#3F2965] via-[#5a3d7a] to-[#Dd1764] rounded-l-sm z-10"
          style={{
            left: 0,
            transformOrigin: "left center",
          }}
          animate={{
            x: isOpen ? -4 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.645, 0.045, 0.355, 1] }}
        />

        {/* Front Cover (Flips) */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#3F2965] via-[#5a3d7a] to-[#Dd1764]"
          style={{
            transformStyle: "preserve-3d",
            transformOrigin: "left center",
            backfaceVisibility: "hidden",
          }}
          animate={{
            rotateY: isOpen ? -160 : 0,
          }}
          transition={{
            duration: 0.6,
            ease: [0.645, 0.045, 0.355, 1],
          }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-6"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute bottom-8 left-4 w-10 h-10 rounded-full bg-white/10" />

            {/* Icon */}
            <motion.span
              className="text-5xl mb-4 relative z-10 drop-shadow-lg"
              animate={!isOpen ? { y: [0, -5, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {step.icon}
            </motion.span>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-2 text-center relative z-10">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-white/80 text-center text-sm mb-4 relative z-10">
              {step.desc}
            </p>

            {/* Hover instruction */}
            <motion.div
              className="flex items-center gap-2 text-white/90 text-xs font-medium relative z-10"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.div>

            {/* Step number badge */}
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{index + 1}</span>
            </div>
          </div>

          {/* Back Face (visible when flipped) */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-100 to-white rounded-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          />
        </motion.div>

        {/* Left page fold shadow when opening */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/20 to-transparent z-5 rounded-l-2xl"
              style={{ transformOrigin: "left" }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
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
      {/* ==================== BUBBLE ANIMATION BACKGROUND ==================== */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {bubbles.map((bubble, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: bubble.x,
                top: bubble.y,
                background: bubble.color === "purple" 
                  ? `radial-gradient(circle at 30% 30%, rgba(139, 92, 246, ${bubble.opacity + 0.05}), rgba(63, 41, 101, ${bubble.opacity}))`
                  : `radial-gradient(circle at 30% 30%, rgba(251, 207, 232, ${bubble.opacity + 0.1}), rgba(221, 23, 100, ${bubble.opacity}))`,
                filter: "blur(1px)",
              }}
              initial={{ 
                scale: 0.8, 
                opacity: 0 
              }}
              animate={{ 
                scale: [0.95, 1.05, 0.95],
                opacity: [bubble.opacity * 0.8, bubble.opacity, bubble.opacity * 0.8],
                x: [0, 10, -10, 0],
                y: [0, -15, 5, 0],
              }}
              transition={{
                duration: 8 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: bubble.delay,
              }}
            />
          ))}
          
          {/* Extra floating small bubbles for depth */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`small-${i}`}
              className="absolute rounded-full"
              style={{
                width: 40 + Math.random() * 60,
                height: 40 + Math.random() * 60,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 2 === 0 
                  ? `radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.15), rgba(139, 92, 246, 0.08))`
                  : `radial-gradient(circle at 30% 30%, rgba(251, 207, 232, 0.18), rgba(244, 114, 182, 0.1))`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}
      {/* ==================== END BUBBLE ANIMATION BACKGROUND ==================== */}

      {/* Soft gradient overlay for smoother look */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 70%)
          `,
        }}
      />

      {/* Decorative Top Wave */}
      <svg
        className="absolute top-0 left-0 w-full h-32 opacity-50 z-10"
        preserveAspectRatio="none"
        viewBox="0 0 1440 120"
      >
        <path
          fill="url(#topWaveGradient)"
          d="M0,60 C360,120 1080,0 1440,60 L1440,0 L0,0 Z"
        />
        <defs>
          <linearGradient
            id="topWaveGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(63,41,101,0.1)" />
            <stop offset="50%" stopColor="rgba(221,23,100,0.1)" />
            <stop offset="100%" stopColor="rgba(63,41,101,0.1)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="max-w-6xl mx-auto relative px-4 pt-24 z-10">
        {/* Section Header */}
        <div className="text-center mb-32 relative z-10">
          <motion.div
            initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={isMobile ? {} : { duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="px-6 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#3F2965]/20 text-[#Dd1764] font-bold tracking-[0.3em] uppercase text-sm shadow-lg">
              The Path Forward
            </span>
          </motion.div>

          <motion.h2
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={isMobile ? {} : { duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#3F2965] via-[#7c3aed] to-[#Dd1764] mt-4"
          >
            Your Mental Wellness Journey
          </motion.h2>

          <motion.p
            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={isMobile ? {} : { delay: 0.4 }}
            className="text-[#3F2965]/60 text-xl mt-6 max-w-2xl mx-auto font-medium"
          >
            {isMobile ? "Tap each milestone to open the book of knowledge" : "Hover over each milestone to open the book of knowledge"}
          </motion.p>

          {/* Animated Dots - Hidden on mobile */}
          {!isMobile && (
            <motion.div
              className="flex justify-center gap-2 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764]"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* SVG River Path */}
        <svg
          className="absolute left-1/2 -translate-x-1/2 top-64 w-full pointer-events-none z-0"
          style={{ height: "calc(100% - 16rem)" }}
          viewBox="0 0 400 1400"
          fill="none"
          preserveAspectRatio="xMidYMin slice"
        >
          <defs>
            <linearGradient
              id="riverGradientLight"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3F2965" stopOpacity="0.3" />
              <stop offset="25%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#Dd1764" stopOpacity="0.5" />
              <stop offset="75%" stopColor="#7c3aed" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3F2965" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          {/* Background Path */}
          <path
            d="M200,0 C350,180 50,360 200,540 C350,720 50,900 200,1080 C280,1200 200,1300 200,1400"
            stroke="rgba(63,41,101,0.08)"
            strokeWidth="50"
            strokeLinecap="round"
            fill="none"
          />

          {/* Dashed Guide Path */}
          <path
            d="M200,0 C350,180 50,360 200,540 C350,720 50,900 200,1080 C280,1200 200,1300 200,1400"
            stroke="rgba(63,41,101,0.15)"
            strokeWidth="2"
            strokeDasharray="10 10"
            fill="none"
          />

          {/* Animated Main Path */}
          <motion.path
            d="M200,0 C350,180 50,360 200,540 C350,720 50,900 200,1080 C280,1200 200,1300 200,1400"
            stroke="url(#riverGradientLight)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            style={{ pathLength }}
          />

          {/* End point circle */}
          <motion.circle
            cx="200"
            cy="1390"
            r="8"
            fill="#Dd1764"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>

        {/* Book Cards */}
        <div className="relative z-10">
          {milestones.map((step, index) => (
            <motion.div
              key={index}
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={isMobile ? {} : { duration: 0.8, type: "spring" }}
              className={`flex w-full mb-40 ${
                step.side === "left"
                  ? "justify-start pl-12"
                  : "justify-end pr-12"
              }`}
            >
              <BookCard step={step} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center pb-20 pt-8 relative z-10"
        >
          {isMobile ? (
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764] blur-xl opacity-40" />
              <Link to="/booking">
                <button className="relative px-12 py-5 rounded-full bg-gradient-to-r from-[#3F2965] via-[#5a3d7a] to-[#Dd1764] text-white font-bold text-lg shadow-2xl">
                  <span className="flex items-center gap-3">
                    Start Your Journey📖
                  </span>
                </button>
              </Link>
            </div>
          ) : (
            <motion.div
              className="relative inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Button Glow */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-[#3F2965] to-[#Dd1764] blur-xl opacity-40"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Link to="/booking">
                <button className="relative px-12 py-5 rounded-full bg-gradient-to-r from-[#3F2965] via-[#5a3d7a] to-[#Dd1764] text-white font-bold text-lg shadow-2xl hover:shadow-[#Dd1764]/30 transition-shadow duration-300">
                  <span className="flex items-center gap-3">
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Start Your Journey📖
                    </motion.span>
                  </span>
                </button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default JourneySection;