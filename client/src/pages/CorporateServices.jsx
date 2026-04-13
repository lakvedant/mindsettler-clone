import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Building2,
  Users,
  LineChart,
  ShieldCheck,
  Mail,
  Phone,
  MessageSquare,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Brain,
  Heart,
  Target,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  Star,
  Briefcase,
  TrendingUp,
  UserCheck,
  HeartHandshake,
  Lightbulb,
  Shield,
  Zap,
  CheckCircle,
  Play,
  Scroll,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer.jsx";
import API from "../api/axios";
import { ScrollProgressBar } from "../components/common/ScrollProgressBar.jsx";
import useIsMobile from "../hooks/useIsMobile";
import { CorporateSEO } from "../components/common/SEO";

const CorporateServices = () => {
  const containerRef = useRef(null);
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    employeeCount: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: "" });
  const [activeService, setActiveService] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: "" });

    try {
      await API.post("/user/corporate/send", {
        contactPerson: formData.contactPerson,
        companyName: formData.companyName,
        workEmail: formData.email,
        phone: formData.phone,
        employeeCount: formData.employeeCount,
        message: formData.message,
      });

      setStatus({ loading: false, success: true, error: "" });
      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        employeeCount: "",
        message: "",
      });
      setTimeout(() => setStatus((prev) => ({ ...prev, success: false })), 5000);
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || "Failed to send inquiry. Please try again.",
      });
    }
  };

  // Services Data
  const services = [
    {
      id: 0,
      title: "Mental Wellness Workshops",
      shortTitle: "Workshops",
      description:
        "Interactive sessions designed to equip your team with practical tools for managing stress, building emotional resilience, and maintaining work-life harmony.",
      icon: Users,
      color: "#7c3aed",
      features: [
        "Stress Management Techniques",
        "Emotional Intelligence Training",
        "Work-Life Balance Strategies",
        "Mindfulness at Work",
        "Building Resilience",
      ],
      duration: "2-4 hours",
      participants: "10-50 people",
    },
    {
      id: 1,
      title: "Leadership Wellness Coaching",
      shortTitle: "Leadership",
      description:
        "Empower your managers and leaders with the skills to recognize burnout, lead with empathy, and create psychologically safe environments for their teams.",
      icon: Award,
      color: "#Dd1764",
      features: [
        "Empathetic Leadership Skills",
        "Burnout Recognition & Prevention",
        "Team Mental Health Management",
        "Creating Safe Spaces",
        "Communication Excellence",
      ],
      duration: "6-12 weeks",
      participants: "Individual/Group",
    },
    {
      id: 2,
      title: "Employee Counseling Program",
      shortTitle: "Counseling",
      description:
        "Confidential one-on-one sessions for employees through our structured MindSettler framework, providing personalized support for mental well-being.",
      icon: HeartHandshake,
      color: "#3F2965",
      features: [
        "Confidential 1-on-1 Sessions",
        "Personalized Support Plans",
        "Crisis Intervention",
        "Ongoing Mental Health Support",
        "Progress Tracking",
      ],
      duration: "Ongoing",
      participants: "Individual",
    },

  ];

  // Stats Data
  const stats = [
    { value: "40%", label: "Reduction in Absenteeism", icon: TrendingUp },
    { value: "85%", label: "Employee Satisfaction", icon: Heart },
    { value: "3x", label: "ROI on Wellness Programs", icon: LineChart },
    { value: "10+", label: "Organizations Served", icon: Building2 },
  ];

  // Benefits Data
  const benefits = [
    {
      title: "Boost Productivity",
      description: "Mentally healthy employees are more focused, creative, and productive.",
      icon: Zap,
    },
    {
      title: "Reduce Turnover",
      description: "Investing in mental health shows employees you care, increasing retention.",
      icon: UserCheck,
    },
    {
      title: "Stronger Culture",
      description: "Foster a supportive, stigma-free environment where everyone thrives.",
      icon: Users,
    },
    {
      title: "Lower Healthcare Costs",
      description: "Proactive mental health support reduces long-term healthcare expenses.",
      icon: Shield,
    },
    {
      title: "Enhanced Leadership",
      description: "Emotionally intelligent leaders build stronger, more resilient teams.",
      icon: Award,
    },
    {
      title: "Crisis Prevention",
      description: "Early intervention prevents small issues from becoming major problems.",
      icon: ShieldCheck,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote:
        "MindSettler transformed our workplace culture. Our team is more connected, productive, and genuinely happier.",
      author: "Priya Sharma",
      role: "HR Director",
      company: "TechCorp India",
    },
    {
      quote:
        "The leadership coaching program helped our managers become more empathetic and effective. Highly recommended!",
      author: "Rahul Mehta",
      role: "CEO",
      company: "Innovate Solutions",
    },
    {
      quote:
        "Employee engagement scores increased by 45% after implementing MindSettler's wellness program.",
      author: "Ananya Patel",
      role: "People Operations",
      company: "Growth Ventures",
    },
  ];

  // Process Steps
  const processSteps = [
    {
      step: "01",
      title: "Discovery Call",
      description: "We learn about your organization's unique needs and challenges.",
    },
    {
      step: "02",
      title: "Custom Proposal",
      description: "Receive a tailored program designed specifically for your team.",
    },
    {
      step: "03",
      title: "Implementation",
      description: "We seamlessly integrate our programs into your workplace.",
    },
    {
      step: "04",
      title: "Ongoing Support",
      description: "Continuous monitoring and adjustment for lasting impact.",
    },
  ];

  return (
    <>
      <CorporateSEO />
      <ScrollProgressBar />
      <Navbar />
      <div ref={containerRef} className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Animated Background */}
          <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at 20% 20%, rgba(63,41,101,0.15) 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 80%, rgba(221,23,100,0.12) 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 70%),
                  linear-gradient(135deg, #faf5ff 0%, #f3e8ff 20%, #fce7f3 40%, #fdf2f8 60%, #f5f3ff 80%, #faf5ff 100%)
                `,
              }}
            />

            {/* Floating Elements */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${40 + i * 25}px`,
                  height: `${40 + i * 25}px`,
                  left: `${5 + i * 10}%`,
                  top: `${10 + (i % 5) * 18}%`,
                  background: `linear-gradient(135deg, rgba(63,41,101,${0.05 + i * 0.01}) 0%, rgba(221,23,100,${0.03 + i * 0.01}) 100%)`,
                }}
                animate={{
                  y: [0, -30, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 5 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.4,
                }}
              />
            ))}
          </motion.div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#3F2965]/10 shadow-lg mb-8"
                >
                  <Briefcase className="w-4 h-4 text-[#Dd1764]" />
                  <span className="text-[#3F2965] font-bold tracking-wider uppercase text-xs">
                    Corporate Wellness Solutions
                  </span>
                </motion.div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
                  <span className="text-[#3F2965]">Healthy Minds,</span>
                  <br />
                  <span className="italic bg-gradient-to-r from-[#Dd1764] via-[#7c3aed] to-[#3F2965] bg-clip-text text-transparent">
                    Thriving Business
                  </span>
                </h1>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#3F2965]/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
                >
                  Partner with MindSettler to build resilient workplace cultures. From
                  psycho-education workshops to personalized counseling, we provide the
                  tools your team needs to thrive.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-8 py-4 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
                  >
                    Request Consultation
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                  <motion.a
                    href="#services"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white/80 backdrop-blur-sm text-[#3F2965] font-bold rounded-full border border-[#3F2965]/20 hover:border-[#Dd1764]/50 transition-all flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Explore Services
                  </motion.a>
                </motion.div>


              </motion.div>

              {/* Right Content - Stats Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Main Card */}
                <div className="relative">
                  {/* Decorative Background */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-[#3F2965]/10 via-[#7c3aed]/5 to-[#Dd1764]/10 rounded-3xl blur-2xl" />

                  <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3F2965] to-[#Dd1764] flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#3F2965]">
                          Corporate Impact
                        </h3>
                        <p className="text-[#3F2965]/60 text-sm">
                          Measurable Results
                        </p>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="p-4 rounded-2xl bg-gradient-to-br from-[#3F2965]/5 to-[#Dd1764]/5 border border-[#3F2965]/10"
                        >
                          <stat.icon className="w-6 h-6 text-[#Dd1764] mb-2" />
                          <p className="text-3xl font-bold bg-gradient-to-r from-[#3F2965] to-[#Dd1764] bg-clip-text text-transparent">
                            {stat.value}
                          </p>
                          <p className="text-[#3F2965]/60 text-sm">{stat.label}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom CTA */}
                    <motion.a
                      href="#contact"
                      className="mt-6 w-full py-4 bg-gradient-to-r from-[#3F2965]/10 to-[#Dd1764]/10 rounded-xl flex items-center justify-center gap-2 text-[#3F2965] font-semibold hover:from-[#3F2965]/20 hover:to-[#Dd1764]/20 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      See How We Can Help
                      <ChevronRight className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white rounded-full text-sm font-bold shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-current" />
                    Trusted Partner
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>


        </section>

        {/* Benefits Section */}
        <section className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #faf5ff 0%, #f3e8ff 50%, #fce7f3 100%)`,
            }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 border border-[#3F2965]/10 mb-6">
                <Sparkles className="w-4 h-4 text-[#Dd1764]" />
                <span className="text-[#3F2965] font-bold tracking-wider uppercase text-xs">
                  Why Corporate Wellness
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3F2965] mb-4">
                Benefits of Investing in{" "}
                <span className="italic text-[#Dd1764]">Mental Health</span>
              </h2>
              <p className="text-[#3F2965]/60 max-w-2xl mx-auto text-lg">
                Organizations that prioritize employee mental health see measurable
                improvements across all business metrics.
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl hover:border-[#Dd1764]/20 transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3F2965]/10 to-[#Dd1764]/10 flex items-center justify-center mb-6 group-hover:from-[#3F2965] group-hover:to-[#Dd1764] transition-all">
                    <benefit.icon className="w-7 h-7 text-[#Dd1764] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-[#3F2965] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-[#3F2965]/60 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #fce7f3 0%, #fdf2f8 50%, #faf5ff 100%)`,
            }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 border border-[#3F2965]/10 mb-6">
                <Brain className="w-4 h-4 text-[#Dd1764]" />
                <span className="text-[#3F2965] font-bold tracking-wider uppercase text-xs">
                  Our Offerings
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3F2965] mb-4">
                Corporate{" "}
                <span className="italic text-[#Dd1764]">Wellness Programs</span>
              </h2>
              <p className="text-[#3F2965]/60 max-w-2xl mx-auto text-lg">
                Comprehensive solutions tailored to your organization's unique needs
                and culture.
              </p>
            </motion.div>

            {/* Services Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {services.map((service, index) => (
                <motion.button
                  key={service.id}
                  onClick={() => setActiveService(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-3 rounded-full font-semibold transition-all ${activeService === index
                    ? "bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white shadow-lg"
                    : "bg-white/80 text-[#3F2965] border border-[#3F2965]/10 hover:border-[#Dd1764]/30"
                    }`}
                >
                  {service.shortTitle}
                </motion.button>
              ))}
            </div>

            {/* Active Service Display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
              >
                <div className="grid lg:grid-cols-2">
                  {/* Left - Info */}
                  <div className="p-10 lg:p-14">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{
                        background: `linear-gradient(135deg, ${services[activeService].color}20, ${services[activeService].color}40)`,
                      }}
                    >
                      {(() => {
                        const IconComponent = services[activeService].icon;
                        return (
                          <IconComponent
                            className="w-8 h-8"
                            style={{ color: services[activeService].color }}
                          />
                        );
                      })()}
                    </div>

                    <h3 className="text-3xl font-bold text-[#3F2965] mb-4">
                      {services[activeService].title}
                    </h3>
                    <p className="text-[#3F2965]/70 text-lg leading-relaxed mb-8">
                      {services[activeService].description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-8">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#3F2965]/5 rounded-full">
                        <Clock className="w-4 h-4 text-[#Dd1764]" />
                        <span className="text-[#3F2965] text-sm font-medium">
                          {services[activeService].duration}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#3F2965]/5 rounded-full">
                        <Users className="w-4 h-4 text-[#Dd1764]" />
                        <span className="text-[#3F2965] text-sm font-medium">
                          {services[activeService].participants}
                        </span>
                      </div>
                    </div>

                    <motion.a
                      href="#contact"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white font-bold rounded-full shadow-lg"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5" />
                    </motion.a>
                  </div>

                  {/* Right - Features */}
                  <div className="bg-gradient-to-br from-[#3F2965]/5 to-[#Dd1764]/5 p-10 lg:p-14">
                    <h4 className="text-xl font-bold text-[#3F2965] mb-6">
                      What's Included
                    </h4>
                    <ul className="space-y-4">
                      {services[activeService].features.map((feature, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3F2965] to-[#Dd1764] flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[#3F2965]/80 font-medium">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #faf5ff 0%, #f5f3ff 100%)`,
            }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 border border-[#3F2965]/10 mb-6">
                <Target className="w-4 h-4 text-[#Dd1764]" />
                <span className="text-[#3F2965] font-bold tracking-wider uppercase text-xs">
                  Our Process
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3F2965] mb-4">
                How We{" "}
                <span className="italic text-[#Dd1764]">Work Together</span>
              </h2>
              <p className="text-[#3F2965]/60 max-w-2xl mx-auto text-lg">
                A simple, streamlined process to bring wellness to your workplace.
              </p>
            </motion.div>

            {/* Process Steps */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#Dd1764]/30 to-transparent" />
                  )}

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 text-center relative">
                    {/* Step Number */}
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#3F2965] to-[#Dd1764] flex items-center justify-center">
                      <span className="text-white font-bold text-xl">{step.step}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#3F2965] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#3F2965]/60">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>



        {/* Contact Form Section */}
        <section id="contact" className="py-24 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #faf5ff 0%, #f3e8ff 50%, #fce7f3 100%)`,
            }}
          />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 border border-[#3F2965]/10 mb-6">
                <MessageSquare className="w-4 h-4 text-[#Dd1764]" />
                <span className="text-[#3F2965] font-bold tracking-wider uppercase text-xs">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3F2965] mb-4">
                Let's Build a{" "}
                <span className="italic text-[#Dd1764]">Healthier Workplace</span>
              </h2>
              <p className="text-[#3F2965]/60 max-w-2xl mx-auto text-lg">
                Ready to transform your organization's mental wellness culture? Fill
                out the form and our team will be in touch within 24 hours.
              </p>
            </motion.div>

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="grid lg:grid-cols-5">
                  {/* Left - Contact Info */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#3F2965] to-[#5a3d7a] p-10 lg:p-12 text-white relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#Dd1764]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

                    <div className="relative z-10">
                      <h3 className="text-3xl font-bold mb-4">Let's Talk</h3>
                      <p className="text-white/70 mb-10 leading-relaxed">
                        Ready to transform your workplace? Our team is standing by to
                        create a custom wellness solution for you.
                      </p>

                      <div className="space-y-6">
                        <motion.a
                          href="mailto:corporate@mindsettler.com"
                          className="flex items-center gap-4 text-white/90 hover:text-white transition-colors group"
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#Dd1764]/30 transition-colors">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-white/60">Email</p>
                            <p className="font-medium">corporate@mindsettler.com</p>
                          </div>
                        </motion.a>

                        <motion.a
                          href="tel:+919974631313"
                          className="flex items-center gap-4 text-white/90 hover:text-white transition-colors group"
                          whileHover={{ x: 5 }}
                        >
                          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-[#Dd1764]/30 transition-colors">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm text-white/60">Phone</p>
                            <p className="font-medium">+91 9974631313</p>
                          </div>
                        </motion.a>
                      </div>

                      {/* Trust Badges */}
                      <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-white/60 text-sm mb-4">Trusted by</p>
                        <div className="flex flex-wrap gap-2">
                          {["HIPAA Compliant", "100% Confidential", "Evidence-Based"].map(
                            (badge, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium"
                              >
                                {badge}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right - Form */}
                  <div className="lg:col-span-3 p-10 lg:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Status Messages */}
                      <AnimatePresence>
                        {status.success && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 font-medium"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                            Partnership request submitted successfully! We'll be in touch
                            soon.
                          </motion.div>
                        )}
                        {status.error && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 font-medium"
                          >
                            <AlertCircle className="w-5 h-5" />
                            {status.error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Form Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[#3F2965] font-semibold text-sm">
                            Contact Person *
                          </label>
                          <input
                            required
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            type="text"
                            placeholder="Your full name"
                            className="w-full px-4 py-3 bg-[#3F2965]/5 border border-[#3F2965]/10 rounded-xl focus:border-[#Dd1764] focus:ring-2 focus:ring-[#Dd1764]/20 outline-none transition-all text-[#3F2965] placeholder-[#3F2965]/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[#3F2965] font-semibold text-sm">
                            Company Name *
                          </label>
                          <input
                            required
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            type="text"
                            placeholder="Your company"
                            className="w-full px-4 py-3 bg-[#3F2965]/5 border border-[#3F2965]/10 rounded-xl focus:border-[#Dd1764] focus:ring-2 focus:ring-[#Dd1764]/20 outline-none transition-all text-[#3F2965] placeholder-[#3F2965]/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[#3F2965] font-semibold text-sm">
                            Work Email *
                          </label>
                          <input
                            required
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            type="email"
                            placeholder="email@company.com"
                            className="w-full px-4 py-3 bg-[#3F2965]/5 border border-[#3F2965]/10 rounded-xl focus:border-[#Dd1764] focus:ring-2 focus:ring-[#Dd1764]/20 outline-none transition-all text-[#3F2965] placeholder-[#3F2965]/40"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[#3F2965] font-semibold text-sm">
                            Phone Number
                          </label>
                          <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            className="w-full px-4 py-3 bg-[#3F2965]/5 border border-[#3F2965]/10 rounded-xl focus:border-[#Dd1764] focus:ring-2 focus:ring-[#Dd1764]/20 outline-none transition-all text-[#3F2965] placeholder-[#3F2965]/40"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#3F2965] font-semibold text-sm">
                          Number of Employees
                        </label>
                        <select
                          name="employeeCount"
                          value={formData.employeeCount}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#3F2965]/5 border border-[#3F2965]/10 rounded-xl focus:border-[#Dd1764] focus:ring-2 focus:ring-[#Dd1764]/20 outline-none transition-all text-[#3F2965]"
                        >
                          <option value="">Select range</option>
                          <option value="1-50">1-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#3F2965] font-semibold text-sm">
                          How can we help? *
                        </label>
                        <textarea
                          required
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Tell us about your organization's wellness needs..."
                          className="w-full px-4 py-3 bg-[#3F2965]/5 border border-[#3F2965]/10 rounded-xl focus:border-[#Dd1764] focus:ring-2 focus:ring-[#Dd1764]/20 outline-none transition-all text-[#3F2965] placeholder-[#3F2965]/40 resize-none"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={status.loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                      >
                        {status.loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Partnership Request
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-[#3F2965]/50 text-sm">
                        By submitting, you agree to our{" "}
                        <a href="#" className="text-[#Dd1764] hover:underline">
                          Privacy Policy
                        </a>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, #fce7f3 0%, #fdf2f8 100%)`,
            }}
          />

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Lightbulb className="w-16 h-16 text-[#Dd1764] mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3F2965] mb-6">
                Ready to Prioritize Your Team's Mental Health?
              </h2>
              <p className="text-[#3F2965]/60 text-lg mb-10 max-w-2xl mx-auto">
                Join 100+ organizations that have transformed their workplace culture
                with MindSettler.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-[#3F2965] to-[#Dd1764] text-white font-bold rounded-full shadow-xl"
                >
                  Schedule a Call
                </motion.a>
                <motion.a
                  href="mailto:corporate@mindsettler.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-[#3F2965] font-bold rounded-full border border-[#3F2965]/20 shadow-lg"
                >
                  Email Us Directly
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default CorporateServices;