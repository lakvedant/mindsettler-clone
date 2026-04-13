import { motion } from "framer-motion";
import {
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [scrollRequired, setScrollRequired] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setScrollRequired(true);
      } else {
        setScrollRequired(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const footerLinks = {
    services: [
      { name: "Online Sessions" },
      { name: "Offline Sessions" },
      { name: "Psycho-Education" },
      { name: "Mental Health Guidance" },
      { name: "Personalized Support" },
    ],
    company: [
      { name: "Who We Are", href: "/aboutus" },
      { name: "Corporate Services", href: "/corporate" },
      { name: "Contact Us", href: "/contact" },
    ],
    resources: [
      { name: "Blogs & Articles", href: "/resources" }
    ],
  };

  const socialLinks = [
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/parnika-bajaj-190719195/",
      label: "LinkedIn",
      color: "#0A66C2",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/mindsettlerbypb?igsh=MTdkeXcxaHd5dG50Ng==",
      label: "Instagram",
      color: "#E4405F",
    },
  ];

  // Animation variants - disabled on mobile
  const containerVariants = isMobile
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2,
        },
      },
    };

  const itemVariants = isMobile
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      },
    };

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative Background - MindSettler Color Palette */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                #3F2965 0%, 
                #2d1f4a 30%,
                #1f1535 60%,
                #3F2965 100%
              )
            `,
          }}
        />
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7c3aed]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#Dd1764]/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#3F2965]/30 rounded-full blur-3xl" />

        {/* Animated Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full">
            <pattern
              id="footer-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="1.5" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#footer-pattern)" />
          </svg>
        </div>
      </div>

      {/* Main Footer Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 py-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            {/* Logo */}
            <div className="mb-6">
              <motion.h2
                className="text-3xl font-bold text-white mb-1"
                whileHover={isMobile ? {} : { scale: 1.02 }}
              >
                <span className="bg-gradient-to-r from-white via-[#Dd1764] to-white bg-clip-text text-transparent">
                  MINDSETTLER
                </span>
              </motion.h2>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gradient-to-r from-[#7c3aed] to-[#Dd1764] rounded-full" />
                <p className="text-[#Dd1764] text-sm font-medium italic">
                  Be Kind To Your Mind
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300/80 leading-relaxed mb-6">
              An online psycho-education and mental well-being platform helping
              individuals understand their mental health through structured
              sessions in a safe, confidential environment.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <motion.a
                href="+91 9974631313"
                className="flex items-center gap-3 text-gray-300/80 hover:text-white transition-colors group"
                whileHover={isMobile ? {} : { x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#Dd1764]/30 transition-colors">
                  <Phone className="w-4 h-4 text-[#Dd1764]" />
                </div>
                <span>+91 9974631313</span>
              </motion.a>

              <motion.a
                href="mailto:parnika@mindsetteler.in"
                className="flex items-center gap-3 text-gray-300/80 hover:text-white transition-colors group"
                whileHover={isMobile ? {} : { x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#Dd1764]/30 transition-colors">
                  <Mail className="w-4 h-4 text-[#Dd1764]" />
                </div>
                <span>parnika@mindsetteler.in</span>
              </motion.a>

              <motion.div
                className="flex items-center gap-3 text-gray-300/80 group"
                whileHover={isMobile ? {} : { x: 5 }}
              >
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#Dd1764]/30 transition-colors">
                  <MapPin className="w-4 h-4 text-[#Dd1764]" />
                </div>
                <span>Surat, Gujarat, India</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Services Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#Dd1764]" />
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={isMobile ? {} : { type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-300/70 hover:text-[#Dd1764] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#Dd1764]" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#Dd1764]" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={isMobile ? {} : { type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-300/70 hover:text-[#Dd1764] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#Dd1764]" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#Dd1764]" />
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={isMobile ? {} : { x: 5 }}
                  transition={isMobile ? {} : { type: "spring", stiffness: 300 }}
                >
                  <a
                    href={link.href}
                    className="text-gray-300/70 hover:text-[#Dd1764] transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#Dd1764]" />
                    {link.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Follow Us Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#Dd1764]" />
              Follow Us
            </h3>

            <p className="text-gray-300/70 text-sm mb-4">
              Connect with us on social media for daily wellness tips and
              updates.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 hover:border-[#Dd1764]/50 transition-colors"
                  whileHover={isMobile ? {} : { scale: 1.1, y: -3 }}
                  whileTap={isMobile ? {} : { scale: 0.95 }}
                  initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={isMobile ? {} : { delay: index * 0.1 }}
                >
                  {/* Hover Background */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${social.color}40, ${social.color}80)`,
                    }}
                  />
                  <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white relative z-10 transition-colors" />
                </motion.a>
              ))}
            </div>

            {/* Additional CTA */}
            <motion.div
              className="mt-8 p-4 rounded-xl bg-gradient-to-r from-[#Dd1764]/20 to-[#7c3aed]/20 border border-white/10"
              whileHover={isMobile ? {} : { scale: 1.02, borderColor: "rgba(221,23,100,0.3)" }}
            >
              <p className="text-white font-medium text-sm mb-2">
                Need Support?
              </p>
              <p className="text-gray-300/70 text-xs mb-3">
                We're here to help you on your mental wellness journey.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 text-[#Dd1764] text-sm font-medium hover:text-white transition-colors"
                whileHover={isMobile ? {} : { x: 3 }}
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Divider */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#Dd1764]/50 to-transparent" />
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <motion.p
              className="text-gray-400 text-sm flex items-center gap-2"
              initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © {currentYear} MindSettler. Made with
              {isMobile ? (
                <Heart className="w-4 h-4 text-[#Dd1764] fill-[#Dd1764]" />
              ) : (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-4 h-4 text-[#Dd1764] fill-[#Dd1764]" />
                </motion.span>
              )}
              for mental wellness.
            </motion.p>

            {/* Legal Links */}
            <motion.div
              className="flex flex-wrap items-center gap-4 text-sm"
              initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              {[
                "Privacy Policy",
                "Terms of Service",
                "Non-Refund Policy",
                "Confidentiality",
              ].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-[#Dd1764] transition-colors relative group"
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#7c3aed] to-[#Dd1764] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {scrollRequired && (
        isMobile ? (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-7 right-5 w-12 h-12 rounded-full bg-linear-to-r from-[#3F2965] to-[#Dd1764] text-white shadow-lg shadow-[#Dd1764]/30 flex items-center justify-center z-30"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        ) : (
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-7 right-5 w-12 h-12 rounded-full bg-linear-to-r from-[#3F2965] to-[#Dd1764] text-white shadow-lg shadow-[#Dd1764]/30 flex items-center justify-center z-30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </motion.svg>
          </motion.button>
        )
      )}
    </footer>
  );
}
