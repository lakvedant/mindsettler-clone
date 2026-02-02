import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search } from 'lucide-react';
import FAQ_img from '../../assets/images/FAQ_img-removebg-preview.png'
import useIsMobile from '../../hooks/useIsMobile';
const faqData = [
  {
    id: 1,
    question: "What is MindSettler?",
    answer: "MindSettler is an online psycho-education and mental well-being platform that helps individuals understand their mental health and navigate life challenges through structured online/offline sessions. It focuses on awareness, guidance, and personalized support in a safe and confidential environment."
  },
  {
    id: 2,
    question: "What is the primary goal of the website?",
    answer: "Our core mission is built on four pillars: Awareness, Lead generation, Sales, and providing a seamless Booking / Consultation experience for our users."
  },
  {
    id: 3,
    question: "Is my privacy protected?",
    answer: "Absolutely. MindSettler is designed as a safe and confidential environment. We use industry-standard encryption to ensure all your sessions and personal data remain private."
  },
  {
    id: 4,
    question: "How long are the sessions?",
    answer: "Session durations vary based on the type of consultation booked. Typically, sessions range from 45 to 60 minutes to ensure a comprehensive and unhurried experience."
  }
];

const FAQSection = () => {
  const [activeId, setActiveId] = useState(1);
  const isMobile = useIsMobile();

  return (
    <div className="bg-[#FDFCF9] flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Content & Search */}
        <motion.div 
          initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={isMobile ? {} : { duration: 0.6 }}
          className="z-10"
        >
          <header className="mb-10">
            <h1 className="text-[#3F2965] text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Frequently Asked <br /> Questions
            </h1>
          </header>

          <div className="space-y-2">
            {faqData.map((item) => (
              <div key={item.id} className="border-b border-gray-100">
                <button
                  onClick={() => setActiveId(activeId === item.id ? null : item.id)}
                  className="w-full py-5 flex items-center justify-between text-left group"
                >
                  <span className={`text-lg font-bold transition-colors ${activeId === item.id ? 'text-[#Dd1764]' : 'text-[#3F2965] group-hover:text-[#Dd1764]'}`}>
                    {item.question}
                  </span>
                  <div className={`shrink-0 ml-4 transition-transform duration-300 ${activeId === item.id ? 'rotate-180' : ''}`}>
                    {activeId === item.id ? (
                      <div className="w-8 h-8 rounded-full bg-[#Dd1764]/10 flex items-center justify-center">
                        <Minus size={18} className="text-[#Dd1764]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Plus size={18} className="text-[#3F2965]/40" />
                      </div>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {activeId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <p className="pb-6 text-[#3F2965]/70 leading-relaxed text-base">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Your Image (735x490) */}
        <motion.div 
          initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={isMobile ? {} : { duration: 0.8 }}
          className="relative flex justify-center items-center"
        >
          {/* Decorative Animated Circles - Hidden on mobile */}
          {!isMobile && (
            <motion.div 
              animate={{ scale: [1, 1.1, 1], rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -z-10 w-[110%] h-[110%] border border-[#3F2965]/5 rounded-full"
            />
          )}

          {/* <div className="relative z-10 shadow-2xl rounded-2xl overflow-hidden border-8 border-white"> */}
            <img 
              src={FAQ_img}
              alt="MindSettler FAQ Illustration"
              width={735}
              height={490}
              className={`w-full h-auto object-cover ${isMobile ? '' : 'transition-transform duration-700 hover:scale-105'}`}
            />
          {/* </div> */}

          {/* Abstract floating elements - Hidden on mobile */}
          {!isMobile && (
            <>
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#F5F2ED] rounded-full filter blur-3xl opacity-80"
              />
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 6 }}
                className="absolute -top-12 -right-12 w-40 h-40 bg-[#Dd1764]/10 rounded-full filter blur-3xl opacity-50"
              />
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FAQSection;