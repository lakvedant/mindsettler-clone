import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useInView,
} from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Heart,
  Bookmark,
  TrendingUp,
  Star,
  ExternalLink,
  Brain,
  Users,
  Smile,
  Lightbulb,
  Target,
  Sparkles,
  Filter,
  X,
  ChevronDown,
  Eye,
  Share2,
  ArrowUpRight,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { ResourcesSEO } from "../components/common/SEO";
import { useAuth } from "../context/AuthContext";
import {
  IsLoginUser,
  IsVerifiedUser,
  IsProfileCompleteUser,
} from "../components/auth/Verification";
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
const MagneticButton = ({ children, className, onClick, href, target, isMobile = false }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  // On mobile, render simple button/link
  if (isMobile) {
    const Component = href ? 'a' : 'button';
    return (
      <Component
        ref={ref}
        href={href}
        target={target}
        onClick={onClick}
        className={className}
      >
        {children}
      </Component>
    );
  }

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      href={href}
      target={target}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15, mass: 0.5 }}
      className={className}
      data-hover
    >
      {children}
    </Component>
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

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = "", duration = 2 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value);
      const incrementTime = Math.max((duration * 1000) / end, 20);

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

// Floating Particles Component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 8,
            height: 4 + Math.random() * 8,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background:
              i % 2 === 0 ? "rgba(221,23,100,0.3)" : "rgba(63,41,101,0.3)",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
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
    </div>
  );
};

// Glowing Card Component
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

  return (
    <motion.div
      ref={ref}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
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

// Category Button with Enhanced Animation
const CategoryButton = ({ category, isActive, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all overflow-hidden ${
        isActive
          ? "text-white shadow-lg"
          : "bg-white text-[#3F2965] hover:bg-[#3F2965]/5 border border-[#3F2965]/10"
      }`}
      data-hover
    >
      {/* Active background gradient */}
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#3F2965] to-[#Dd1764]"
          layoutId="activeCategoryBg"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.6 }}
      />

      <motion.div
        className="relative z-10"
        animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <category.icon className="w-4 h-4" />
      </motion.div>
      <span className="font-medium text-sm relative z-10">{category.name}</span>
      <motion.span
        className={`relative z-10 text-xs px-2 py-0.5 rounded-full ${
          isActive ? "bg-white/20" : "bg-[#3F2965]/10"
        }`}
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {category.count}
      </motion.span>
    </motion.button>
  );
};

// Enhanced Article Card Component
const ArticleCard = ({
  article,
  index,
  featured = false,
  onLike,
  onSave,
  isLiked,
  isSaved,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [5, -5]);
  const rotateY = useTransform(mouseX, [-150, 150], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      {/* Glowing border on hover */}
      <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] rounded-3xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-500" />

      <div className="relative bg-white rounded-3xl overflow-hidden">
        {/* Image */}
        <div
          className={`relative overflow-hidden ${
            featured ? "h-64 md:h-80" : "h-48"
          }`}
        >
          <motion.img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Overlay with gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            animate={{ opacity: isHovered ? 1 : 0.8 }}
          />

          {/* Floating particles on hover */}
          <AnimatePresence>
            {isHovered && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/60 rounded-full"
                    initial={{
                      x: "50%",
                      y: "100%",
                      opacity: 0,
                    }}
                    animate={{
                      y: `${20 + i * 15}%`,
                      x: `${30 + i * 10}%`,
                      opacity: [0, 1, 0],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Category Badge */}
          <motion.div
            className="absolute top-4 left-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <motion.span
              className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs font-bold text-[#3F2965] capitalize shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              {article.category.replace("-", " ")}
            </motion.span>
          </motion.div>

          {/* Actions */}
          <motion.div
            className="absolute top-4 right-4 flex gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                onLike(article.id);
              }}
              whileHover={{ scale: 1.15, rotate: isLiked ? 0 : 10 }}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isLiked
                  ? "bg-[#Dd1764] text-white"
                  : "bg-white/95 backdrop-blur-sm text-gray-600 hover:text-[#Dd1764]"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </motion.button>
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                onSave(article.id);
              }}
              whileHover={{ scale: 1.15, rotate: isSaved ? 0 : -10 }}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isSaved
                  ? "bg-[#3F2965] text-white"
                  : "bg-white/95 backdrop-blur-sm text-gray-600 hover:text-[#3F2965]"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
              />
            </motion.button>
          </motion.div>

          {/* Source & Read Time */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
            <motion.span
              className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <ExternalLink className="w-3 h-3" />
              {article.source}
            </motion.span>
            <motion.span
              className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Clock className="w-3 h-3" />
              {article.readTime}
            </motion.span>
          </div>

          {/* Featured Badge */}
          {article.featured && (
            <motion.div
              className="absolute top-4 left-4 z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white text-xs font-bold rounded-full shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(221,23,100,0.4)",
                    "0 0 0 8px rgba(221,23,100,0)",
                    "0 0 0 0 rgba(221,23,100,0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Star className="w-3 h-3 fill-current" />
                Featured
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.h3
            className={`font-bold text-[#3F2965] mb-3 line-clamp-2 transition-colors ${
              featured ? "text-xl md:text-2xl" : "text-lg"
            }`}
            animate={{ color: isHovered ? "#Dd1764" : "#3F2965" }}
            transition={{ duration: 0.3 }}
          >
            {article.title}
          </motion.h3>

          <p
            className={`text-gray-600 mb-4 line-clamp-2 ${
              featured ? "text-base" : "text-sm"
            }`}
          >
            {article.excerpt}
          </p>

          {/* Tags with animation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: "rgba(63,41,101,0.1)",
                }}
                className="px-2.5 py-1 bg-[#3F2965]/5 text-[#3F2965] text-xs rounded-full cursor-pointer transition-colors"
              >
                #{tag}
              </motion.span>
            ))}
          </div>

          {/* Read More Link */}
          <motion.a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#Dd1764] font-semibold text-sm group/link"
            whileHover={{ x: 5 }}
            data-hover
          >
            Read Full Article
            <motion.span
              animate={{ x: isHovered ? [0, 5, 0] : 0 }}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            >
              <ArrowUpRight className="w-4 h-4" />
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, value, label, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50"
    >
      <motion.div
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3F2965]/10 to-[#Dd1764]/10 flex items-center justify-center"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Icon className="w-6 h-6 text-[#Dd1764]" />
      </motion.div>
      <div>
        <motion.p className="text-2xl font-bold bg-gradient-to-r from-[#3F2965] to-[#Dd1764] bg-clip-text text-transparent">
          <AnimatedCounter value={value} suffix="+" />
        </motion.p>
        <p className="text-sm text-[#3F2965]/60">{label}</p>
      </div>
    </motion.div>
  );
};

// Empty State Component
const EmptyState = ({ onClear }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20"
    >
      <motion.div
        className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#3F2965]/10 to-[#Dd1764]/10 flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Search className="w-12 h-12 text-[#3F2965]/40" />
      </motion.div>
      <TextReveal>
        <h3 className="text-2xl font-bold text-[#3F2965] mb-3">
          No articles found
        </h3>
      </TextReveal>
      <motion.p
        className="text-[#3F2965]/60 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Try adjusting your search or filter criteria
      </motion.p>
      <MagneticButton
        onClick={onClear}
        className="px-6 py-3 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white font-bold rounded-full shadow-lg overflow-hidden group relative"
      >
        <motion.span className="absolute inset-0 bg-gradient-to-r from-[#Dd1764] to-[#3F2965] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="relative">Clear Filters</span>
      </MagneticButton>
    </motion.div>
  );
};

// Main Resources Page Component
const ResourcesPage = () => {
  const containerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [savedArticles, setSavedArticles] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);
  const { user, loading: authLoading } = useAuth();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false, // Prevents the hydration error
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Categories
  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen, count: 24 },
    { id: "anxiety", name: "Anxiety & Stress", icon: Brain, count: 6 },
    { id: "depression", name: "Depression", icon: Heart, count: 5 },
    { id: "relationships", name: "Relationships", icon: Users, count: 4 },
    { id: "self-care", name: "Self-Care", icon: Smile, count: 5 },
    { id: "mindfulness", name: "Mindfulness", icon: Target, count: 4 },
  ];

  // Articles data (keeping your existing data)
  const articles = [
    {
      id: 1,
      title: "Understanding Anxiety: Causes, Symptoms, and Coping Strategies",
      excerpt:
        "Learn about the different types of anxiety disorders and evidence-based techniques to manage anxiety in your daily life.",
      category: "anxiety",
      source: "Psychology Today",
      sourceUrl: "https://www.psychologytoday.com/us/basics/anxiety",
      readTime: "8 min read",
      date: "2024",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800",
      tags: ["Anxiety", "Mental Health", "Coping Skills"],
    },
    {
      id: 2,
      title: "10 Science-Backed Ways to Reduce Stress",
      excerpt:
        "Discover practical, research-proven methods to lower your stress levels and improve your overall well-being.",
      category: "anxiety",
      source: "Harvard Health",
      sourceUrl:
        "https://www.health.harvard.edu/mind-and-mood/top-ways-to-reduce-daily-stress",
      readTime: "6 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      tags: ["Stress Management", "Wellness", "Research"],
    },
    {
      id: 3,
      title: "The Connection Between Anxiety and Sleep",
      excerpt:
        "Explore how anxiety affects your sleep quality and learn strategies to break the cycle of sleepless nights.",
      category: "anxiety",
      source: "Sleep Foundation",
      sourceUrl:
        "https://www.sleepfoundation.org/mental-health/anxiety-and-sleep",
      readTime: "7 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
      tags: ["Sleep", "Anxiety", "Health"],
    },
    {
      id: 4,
      title: "Breathing Exercises for Anxiety Relief",
      excerpt:
        "Master simple breathing techniques that can help calm your nervous system in moments of anxiety.",
      category: "anxiety",
      source: "Healthline",
      sourceUrl:
        "https://www.healthline.com/health/breathing-exercises-for-anxiety",
      readTime: "5 min read",
      date: "2024",
      featured: false,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      tags: ["Breathing", "Techniques", "Anxiety Relief"],
    },
    {
      id: 5,
      title:
        "Social Anxiety: How to Feel More Comfortable in Social Situations",
      excerpt:
        "Practical tips and strategies for managing social anxiety and building confidence in social settings.",
      category: "anxiety",
      source: "Verywell Mind",
      sourceUrl:
        "https://www.verywellmind.com/social-anxiety-disorder-tips-3024209",
      readTime: "9 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
      tags: ["Social Anxiety", "Confidence", "Social Skills"],
    },
    {
      id: 6,
      title: "Workplace Stress: Strategies for a Healthier Work Life",
      excerpt:
        "Learn how to manage work-related stress and create boundaries for better mental health at work.",
      category: "anxiety",
      source: "Mind",
      sourceUrl:
        "https://www.mind.org.uk/information-support/tips-for-everyday-living/workplace-mental-health/",
      readTime: "7 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800",
      tags: ["Work Stress", "Boundaries", "Productivity"],
    },
    {
      id: 7,
      title: "Depression: What You Need to Know",
      excerpt:
        "A comprehensive guide to understanding depression, its symptoms, causes, and treatment options.",
      category: "depression",
      source: "National Institute of Mental Health",
      sourceUrl: "https://www.nimh.nih.gov/health/topics/depression",
      readTime: "12 min read",
      date: "2024",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
      tags: ["Depression", "Mental Health", "Treatment"],
    },
    {
      id: 8,
      title: "Cognitive Behavioral Therapy for Depression",
      excerpt:
        "Understand how CBT works and why it's one of the most effective treatments for depression.",
      category: "depression",
      source: "American Psychological Association",
      sourceUrl:
        "https://www.apa.org/ptsd-guideline/patients-and-families/cognitive-behavioral",
      readTime: "8 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800",
      tags: ["CBT", "Therapy", "Depression Treatment"],
    },
    {
      id: 9,
      title: "The Role of Exercise in Managing Depression",
      excerpt:
        "Discover how physical activity can be a powerful tool in combating depression and improving mood.",
      category: "depression",
      source: "Mayo Clinic",
      sourceUrl:
        "https://www.mayoclinic.org/diseases-conditions/depression/in-depth/depression-and-exercise/art-20046495",
      readTime: "6 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      tags: ["Exercise", "Depression", "Physical Health"],
    },
    {
      id: 10,
      title: "Supporting a Loved One with Depression",
      excerpt:
        "Practical advice on how to help someone you care about who is struggling with depression.",
      category: "depression",
      source: "HelpGuide",
      sourceUrl:
        "https://www.helpguide.org/articles/depression/helping-someone-with-depression.htm",
      readTime: "10 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800",
      tags: ["Support", "Family", "Caregiving"],
    },
    {
      id: 11,
      title: "Seasonal Affective Disorder: Light Therapy and Beyond",
      excerpt:
        "Learn about SAD and effective treatments including light therapy, lifestyle changes, and more.",
      category: "depression",
      source: "Cleveland Clinic",
      sourceUrl:
        "https://my.clevelandclinic.org/health/diseases/9293-seasonal-depression",
      readTime: "7 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800",
      tags: ["SAD", "Light Therapy", "Seasonal"],
    },
    {
      id: 12,
      title: "Building Healthy Communication in Relationships",
      excerpt:
        "Master the art of effective communication to strengthen your personal and professional relationships.",
      category: "relationships",
      source: "Gottman Institute",
      sourceUrl:
        "https://www.gottman.com/blog/category/column/relationship-research/",
      readTime: "9 min read",
      date: "2024",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800",
      tags: ["Communication", "Relationships", "Connection"],
    },
    {
      id: 13,
      title: "Setting Healthy Boundaries in Relationships",
      excerpt:
        "Learn why boundaries are essential and how to establish them while maintaining loving connections.",
      category: "relationships",
      source: "Psychology Today",
      sourceUrl: "https://www.psychologytoday.com/us/basics/boundaries",
      readTime: "8 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
      tags: ["Boundaries", "Self-Respect", "Relationships"],
    },
    {
      id: 14,
      title: "Attachment Styles and How They Affect Your Relationships",
      excerpt:
        "Understanding your attachment style can transform how you relate to others and yourself.",
      category: "relationships",
      source: "Verywell Mind",
      sourceUrl: "https://www.verywellmind.com/attachment-styles-2795344",
      readTime: "11 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800",
      tags: ["Attachment", "Psychology", "Self-Awareness"],
    },
    {
      id: 15,
      title: "Navigating Conflict in Relationships",
      excerpt:
        "Healthy conflict resolution strategies that can strengthen rather than damage your relationships.",
      category: "relationships",
      source: "HelpGuide",
      sourceUrl:
        "https://www.helpguide.org/articles/relationships-communication/conflict-resolution-skills.htm",
      readTime: "8 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
      tags: ["Conflict", "Resolution", "Communication"],
    },
    {
      id: 16,
      title: "The Science of Self-Care: Why It Matters for Mental Health",
      excerpt:
        "Explore the research behind self-care practices and how they contribute to psychological well-being.",
      category: "self-care",
      source: "American Psychological Association",
      sourceUrl: "https://www.apa.org/monitor/2022/01/special-self-care",
      readTime: "7 min read",
      date: "2024",
      featured: true,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      tags: ["Self-Care", "Wellness", "Research"],
    },
    {
      id: 17,
      title: "Creating a Self-Care Routine That Actually Works",
      excerpt:
        "Practical steps to build a sustainable self-care routine that fits your lifestyle and needs.",
      category: "self-care",
      source: "Mind",
      sourceUrl:
        "https://www.mind.org.uk/information-support/tips-for-everyday-living/self-care/",
      readTime: "6 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800",
      tags: ["Routine", "Habits", "Self-Care"],
    },
    {
      id: 18,
      title: "Digital Detox: Reclaiming Your Mental Space",
      excerpt:
        "Learn how to create healthy boundaries with technology for better mental health and presence.",
      category: "self-care",
      source: "Healthline",
      sourceUrl: "https://www.healthline.com/health/digital-detox",
      readTime: "8 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
      tags: ["Digital Wellness", "Technology", "Balance"],
    },
    {
      id: 19,
      title: "The Power of Journaling for Mental Health",
      excerpt:
        "Discover how journaling can help process emotions, reduce stress, and improve self-awareness.",
      category: "self-care",
      source: "Positive Psychology",
      sourceUrl: "https://positivepsychology.com/journaling-for-mindfulness/",
      readTime: "7 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800",
      tags: ["Journaling", "Writing", "Self-Reflection"],
    },
    {
      id: 20,
      title: "Sleep Hygiene: The Foundation of Mental Wellness",
      excerpt:
        "Improve your sleep quality with these evidence-based sleep hygiene practices.",
      category: "self-care",
      source: "Sleep Foundation",
      sourceUrl: "https://www.sleepfoundation.org/sleep-hygiene",
      readTime: "9 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
      tags: ["Sleep", "Rest", "Health"],
    },
    {
      id: 21,
      title: "Getting Started with Mindfulness Meditation",
      excerpt:
        "A beginner's guide to mindfulness meditation and how to incorporate it into your daily routine.",
      category: "mindfulness",
      source: "Mindful",
      sourceUrl:
        "https://www.mindful.org/meditation/mindfulness-getting-started/",
      readTime: "10 min read",
      date: "2024",
      featured: true,
      image:
        "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      tags: ["Meditation", "Mindfulness", "Beginners"],
    },
    {
      id: 22,
      title: "The Neuroscience of Mindfulness",
      excerpt:
        "Explore how mindfulness practice actually changes your brain structure and function.",
      category: "mindfulness",
      source: "Harvard Gazette",
      sourceUrl:
        "https://news.harvard.edu/gazette/story/2018/04/harvard-researchers-study-how-mindfulness-may-change-the-brain-in-depressed-patients/",
      readTime: "8 min read",
      date: "2024",
      featured: false,
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800",
      tags: ["Neuroscience", "Brain", "Research"],
    },
    {
      id: 23,
      title: "Mindful Eating: A Path to a Healthier Relationship with Food",
      excerpt:
        "Learn how mindful eating can transform your relationship with food and improve overall well-being.",
      category: "mindfulness",
      source: "Harvard Health",
      sourceUrl:
        "https://www.health.harvard.edu/staying-healthy/mindful-eating",
      readTime: "6 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
      tags: ["Mindful Eating", "Nutrition", "Awareness"],
    },
    {
      id: 24,
      title: "Body Scan Meditation for Stress Relief",
      excerpt:
        "A step-by-step guide to body scan meditation, a powerful technique for releasing tension.",
      category: "mindfulness",
      source: "Greater Good Science Center",
      sourceUrl:
        "https://greatergood.berkeley.edu/article/item/a_five_minute_body_scan_meditation",
      readTime: "5 min read",
      date: "2024",
      featured: false,
      image:
        "https://images.unsplash.com/photo-1447452001602-7090c7ab2db3?w=800",
      tags: ["Body Scan", "Relaxation", "Meditation"],
    },
  ];

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      activeCategory === "all" || article.category === activeCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  // Featured articles
  const featuredArticles = articles.filter((article) => article.featured);

  // Toggle save article
  const toggleSave = (articleId) => {
    setSavedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  // Toggle like article
  const toggleLike = (articleId) => {
    setLikedArticles((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId]
    );
  };

  return (
    <IsLoginUser user={user} loading={authLoading}>
      <IsVerifiedUser user={user}>
        <IsProfileCompleteUser user={user}>
          <>
            <ResourcesSEO />
            <ScrollProgressBar />
            <Navbar />

            <div ref={containerRef} className="min-h-screen overflow-hidden">
              {/* Hero Section */}
              <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Animated Background */}
                <motion.div
                  className="absolute inset-0 z-0"
                  style={{ y: backgroundY }}
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

                  {/* Floating Elements with Enhanced Animation */}
                  {[...Array(10)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        background: `linear-gradient(135deg, rgba(63,41,101,${
                          0.1 + i * 0.02
                        }), rgba(221,23,100,${0.1 + i * 0.02}))`,
                        width: `${50 + i * 25}px`,
                        height: `${50 + i * 25}px`,
                        left: `${5 + i * 10}%`,
                        top: `${10 + (i % 5) * 18}%`,
                        filter: "blur(1px)",
                      }}
                      animate={{
                        y: [0, -30, 0],
                        x: [0, i % 2 === 0 ? 15 : -15, 0],
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 6 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3,
                      }}
                    />
                  ))}

                  <FloatingParticles />
                </motion.div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16 text-center">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 mb-6"
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <BookOpen size={16} className="text-[#Dd1764]" />
                    </motion.div>
                    <span className="text-xs sm:text-sm font-semibold text-[#3F2965]">
                      Curated Mental Health Resources
                    </span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Sparkles size={14} className="text-yellow-500" />
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <div className="overflow-hidden mb-6">
                    <motion.h1
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 50,
                        damping: 20,
                      }}
                      className="text-5xl md:text-7xl font-serif font-bold"
                    >
                      <motion.span
                        className="text-[#3F2965] inline-block"
                        whileHover={{ scale: 1.02 }}
                      >
                        Blogs &{" "}
                      </motion.span>
                      <motion.span
                        className="italic bg-gradient-to-r from-[#Dd1764] via-[#7c3aed] to-[#3F2965] bg-clip-text text-transparent inline-block"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        style={{ backgroundSize: "200% 200%" }}
                      >
                        Articles
                      </motion.span>
                    </motion.h1>
                  </div>

                  {/* Subtitle */}
                  <StaggerText
                    text="Curated mental health resources from trusted sources to support your wellness journey"
                    className="text-[#3F2965]/70 text-lg md:text-xl max-w-2xl mx-auto mb-10"
                    delay={0.3}
                  />

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-4 md:gap-6"
                  >
                    <StatsCard
                      icon={BookOpen}
                      value="24"
                      label="Articles"
                      delay={0.9}
                    />
                    <StatsCard
                      icon={Filter}
                      value="5"
                      label="Categories"
                      delay={1.0}
                    />
                    <StatsCard
                      icon={Star}
                      value="12"
                      label="Trusted Sources"
                      delay={1.1}
                    />
                  </motion.div>
                </div>
              </section>

              {/* Categories Section - Sticky */}
              <section className="py-6 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-[#3F2965]/10 shadow-sm">
                <div className="max-w-7xl mx-auto px-6">
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((category, index) => (
                      <CategoryButton
                        key={category.id}
                        category={category}
                        isActive={activeCategory === category.id}
                        onClick={() => setActiveCategory(category.id)}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              </section>

              {/* Featured Articles */}
              <section className="py-20 bg-gradient-to-b from-[#faf5ff] to-white relative overflow-hidden">
                <FloatingParticles />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  {/* Section Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between mb-12"
                  >
                    <div>
                      <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <TrendingUp className="w-5 h-5 text-[#Dd1764]" />
                        </motion.div>
                        <span className="text-[#Dd1764] font-bold tracking-wider uppercase text-sm">
                          Featured
                        </span>
                      </motion.div>
                      <TextReveal>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3F2965]">
                          Editor's{" "}
                          <motion.span
                            className="italic text-[#Dd1764]"
                            animate={{
                              textShadow: [
                                "0 0 0px rgba(221,23,100,0)",
                                "0 0 20px rgba(221,23,100,0.3)",
                                "0 0 0px rgba(221,23,100,0)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            Picks
                          </motion.span>
                        </h2>
                      </TextReveal>
                    </div>
                  </motion.div>

                  {/* Featured Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredArticles.slice(0, 3).map((article, index) => (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        index={index}
                        featured={index === 0}
                        onLike={toggleLike}
                        onSave={toggleSave}
                        isLiked={likedArticles.includes(article.id)}
                        isSaved={savedArticles.includes(article.id)}
                      />
                    ))}
                  </div>
                </div>
              </section>
              {/* All Articles */}
              <section className="py-20 bg-white relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                  {/* Section Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4"
                  >
                    <div>
                      <motion.div
                        className="flex items-center gap-2 mb-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <BookOpen className="w-5 h-5 text-[#Dd1764]" />
                        </motion.div>
                        <span className="text-[#Dd1764] font-bold tracking-wider uppercase text-sm">
                          All Resources
                        </span>
                      </motion.div>
                      <TextReveal>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3F2965]">
                          Browse{" "}
                          <motion.span
                            className="italic text-[#Dd1764]"
                            animate={{
                              color: ["#Dd1764", "#7c3aed", "#Dd1764"],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                          >
                            {activeCategory === "all"
                              ? "All Articles"
                              : categories.find((c) => c.id === activeCategory)
                                  ?.name}
                          </motion.span>
                        </h2>
                      </TextReveal>
                    </div>

                    {/* Results count with animation */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3"
                    >
                      <motion.div
                        className="px-4 py-2 bg-gradient-to-r from-[#3F2965]/5 to-[#Dd1764]/5 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        <motion.span
                          className="text-[#3F2965] font-medium"
                          key={filteredArticles.length}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {filteredArticles.length} article
                          {filteredArticles.length !== 1 ? "s" : ""} found
                        </motion.span>
                      </motion.div>

                      {/* View toggle (optional) */}
                      <motion.div
                        className="hidden md:flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-[#3F2965]/10"
                        whileHover={{ borderColor: "#Dd1764" }}
                      >
                        <motion.button
                          className="p-1.5 rounded-md bg-[#3F2965]/10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg
                            className="w-4 h-4 text-[#3F2965]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  </motion.div>

                  {/* Active filters indicator */}
                  <AnimatePresence>
                    {(searchQuery || activeCategory !== "all") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm text-[#3F2965]/60">
                            Active filters:
                          </span>

                          {searchQuery && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-[#3F2965]/10 rounded-full"
                            >
                              <Search className="w-3 h-3 text-[#3F2965]" />
                              <span className="text-sm text-[#3F2965] font-medium">
                                "{searchQuery}"
                              </span>
                              <motion.button
                                onClick={() => setSearchQuery("")}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-1"
                              >
                                <X className="w-3 h-3 text-[#3F2965]/60 hover:text-[#Dd1764]" />
                              </motion.button>
                            </motion.div>
                          )}

                          {activeCategory !== "all" && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="flex items-center gap-2 px-3 py-1.5 bg-[#Dd1764]/10 rounded-full"
                            >
                              <Filter className="w-3 h-3 text-[#Dd1764]" />
                              <span className="text-sm text-[#Dd1764] font-medium capitalize">
                                {activeCategory.replace("-", " ")}
                              </span>
                              <motion.button
                                onClick={() => setActiveCategory("all")}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                className="ml-1"
                              >
                                <X className="w-3 h-3 text-[#Dd1764]/60 hover:text-[#Dd1764]" />
                              </motion.button>
                            </motion.div>
                          )}

                          <motion.button
                            onClick={() => {
                              setSearchQuery("");
                              setActiveCategory("all");
                            }}
                            className="text-sm text-[#3F2965]/60 hover:text-[#Dd1764] underline transition-colors"
                            whileHover={{ scale: 1.05 }}
                          >
                            Clear all
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Articles Grid */}
                  <AnimatePresence mode="wait">
                    {filteredArticles.length > 0 ? (
                      <motion.div
                        key="articles-grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                      >
                        {filteredArticles.map((article, index) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            index={index}
                            onLike={toggleLike}
                            onSave={toggleSave}
                            isLiked={likedArticles.includes(article.id)}
                            isSaved={savedArticles.includes(article.id)}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <EmptyState
                        onClear={() => {
                          setSearchQuery("");
                          setActiveCategory("all");
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Load More Button (Optional) */}
                  {filteredArticles.length > 0 &&
                    filteredArticles.length >= 6 && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mt-16 text-center"
                      >
                        <MagneticButton className="group relative px-8 py-4 bg-white border-2 border-[#3F2965]/20 text-[#3F2965] font-bold rounded-full overflow-hidden hover:border-[#Dd1764]/50 transition-colors">
                          <motion.span className="absolute inset-0 bg-gradient-to-r from-[#3F2965]/5 to-[#Dd1764]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative flex items-center gap-2">
                            Explore More Articles
                            <motion.span
                              animate={{ y: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ChevronDown className="w-5 h-5" />
                            </motion.span>
                          </span>
                        </MagneticButton>
                      </motion.div>
                    )}
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute top-1/4 -right-32 w-64 h-64 bg-[#Dd1764]/5 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-1/4 -left-32 w-64 h-64 bg-[#3F2965]/5 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, delay: 4 }}
                  />
                </div>
              </section>

              {/* Resources CTA */}
              <section className="py-24 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, #3F2965 0%, #5a3d7a 50%, #Dd1764 100%)`,
                  }}
                />

                {/* Animated mesh background */}
                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute border border-white/10 rounded-full"
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
                        rotate: {
                          duration: 20 + i * 5,
                          repeat: Infinity,
                          ease: "linear",
                        },
                        scale: { duration: 4 + i, repeat: Infinity },
                      }}
                    />
                  ))}
                </div>

                {/* Floating particles */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 50 }}
                  >
                    {/* Icon */}
                    <motion.div
                      className="w-20 h-20 mx-auto mb-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Lightbulb className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <TextReveal>
                      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
                        Need Personalized Support?
                      </h2>
                    </TextReveal>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                      While these resources are helpful, sometimes we need
                      personalized guidance. Book a session with our mental
                      wellness experts.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                      <MagneticButton
                        href="/booking"
                        className="group relative px-8 py-4 bg-white text-[#3F2965] font-bold rounded-full shadow-xl overflow-hidden"
                      >
                        {/* Shine effect */}
                        <motion.span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#Dd1764]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative flex items-center gap-2">
                          Book a Session
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <ArrowRight className="w-5 h-5" />
                          </motion.span>
                        </span>
                      </MagneticButton>

                      <MagneticButton
                        href="/aboutus"
                        className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-full border border-white/30 overflow-hidden hover:bg-white/20 transition-colors"
                      >
                        <span className="relative flex items-center gap-2">
                          Learn About Us
                          <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.span>
                        </span>
                      </MagneticButton>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.7 }}
                      className="flex flex-wrap justify-center gap-6 mt-12"
                    >
                      {[
                        { icon: "🔒", text: "100% Confidential" },
                        { icon: "💜", text: "Evidence-Based" },
                        { icon: "⭐", text: "Expert Guidance" },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center gap-2 text-white/70 text-sm"
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
                            {item.icon}
                          </motion.span>
                          <span>{item.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              </section>

              {/* Newsletter / Social Section */}
              <section className="py-20 bg-gradient-to-b from-white to-[#faf5ff] relative overflow-hidden">
                <FloatingParticles />

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 50 }}
                    className="relative"
                  >
                    {/* Glowing background */}
                    <motion.div
                      className="absolute -inset-4 bg-gradient-to-r from-[#3F2965]/10 via-[#Dd1764]/10 to-[#3F2965]/10 rounded-[50px] blur-xl"
                      animate={{ opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#3F2965]/5 overflow-hidden">
                      {/* Decorative gradient line */}
                      <motion.div
                        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3F2965] via-[#Dd1764] to-[#3F2965]"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      />

                      {/* Background decoration */}
                      <motion.div
                        className="absolute -top-20 -right-20 w-40 h-40 bg-[#Dd1764]/5 rounded-full blur-3xl"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 6, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#3F2965]/5 rounded-full blur-3xl"
                        animate={{ scale: [1.2, 1, 1.2] }}
                        transition={{ duration: 6, repeat: Infinity }}
                      />

                      <div className="text-center relative">
                        {/* Icon */}
                        <motion.div
                          className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#3F2965]/10 to-[#Dd1764]/10 flex items-center justify-center"
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        >
                          <BookOpen className="w-8 h-8 text-[#Dd1764]" />
                        </motion.div>

                        {/* Title */}
                        <TextReveal>
                          <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#3F2965] mb-4">
                            Stay Updated with Mental Wellness Tips
                          </h3>
                        </TextReveal>

                        {/* Description */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          className="text-[#3F2965]/60 mb-8 max-w-lg mx-auto"
                        >
                          Follow us on social media for daily insights,
                          resources, and support on your wellness journey.
                        </motion.p>

                        {/* Social Buttons */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 }}
                          className="flex justify-center gap-4"
                        >
                          {/* Instagram */}
                          <motion.a
                            href="https://www.instagram.com/mindsettlerbypb"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6, type: "spring" }}
                            whileHover={{
                              scale: 1.15,
                              y: -5,
                              rotate: [0, -10, 10, 0],
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center text-white shadow-lg shadow-pink-500/30 relative overflow-hidden group"
                            data-hover
                          >
                            {/* Shine effect */}
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <svg
                              className="w-7 h-7 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          </motion.a>

                          {/* LinkedIn */}
                          <motion.a
                            href="https://www.linkedin.com/in/parnika-bajaj-190719195/"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ scale: 0, rotate: 180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7, type: "spring" }}
                            whileHover={{
                              scale: 1.15,
                              y: -5,
                              rotate: [0, 10, -10, 0],
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-2xl bg-[#0A66C2] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 relative overflow-hidden group"
                            data-hover
                          >
                            {/* Shine effect */}
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <svg
                              className="w-7 h-7 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </motion.a>

                          {/* WhatsApp */}
                          <motion.a
                            href="https://wa.me/919974631313"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, type: "spring" }}
                            whileHover={{
                              scale: 1.15,
                              y: -5,
                              rotate: [0, -10, 10, 0],
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] flex items-center justify-center text-white shadow-lg shadow-green-500/30 relative overflow-hidden group"
                            data-hover
                          >
                            {/* Shine effect */}
                            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <svg
                              className="w-7 h-7 relative z-10"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </motion.a>
                        </motion.div>

                        {/* Additional text */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1 }}
                          className="text-xs text-[#3F2965]/40 mt-6"
                        >
                          Join our community of{" "}
                          <span className="font-semibold text-[#Dd1764]">
                            1,000+
                          </span>{" "}
                          wellness seekers
                        </motion.p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Saved Articles Indicator (floating) */}
              <AnimatePresence>
                {savedArticles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className="fixed bottom-24 right-6 z-40"
                  >
                    <motion.div
                      className="flex items-center gap-3 px-4 py-3 bg-white rounded-full shadow-xl border border-[#3F2965]/10"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.div
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3F2965] to-[#Dd1764] flex items-center justify-center"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bookmark className="w-4 h-4 text-white fill-current" />
                      </motion.div>
                      <span className="text-sm font-bold text-[#3F2965]">
                        {savedArticles.length} saved
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Footer />
          </>
        </IsProfileCompleteUser>
      </IsVerifiedUser>
    </IsLoginUser>
  );
};

export default ResourcesPage;
