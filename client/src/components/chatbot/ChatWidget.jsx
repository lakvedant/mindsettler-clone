import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Heart,
  GripVertical,
  ExternalLink,
  BookOpen,
  Calendar,
  Phone,
  User,
  Briefcase,
  RefreshCw,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Zap,
  Coffee,
  Sun,
  Moon,
  CloudSun,
  Loader2,
} from "lucide-react";
import API from "../../api/axios.js";
import botAvatar from "../../assets/icons/ChatBotmini-removebg-preview.png";

const generateChatId = () => {
  const saved = sessionStorage.getItem("mindSettlerChatId");
  if (saved) return saved;
  const newId = crypto.randomUUID();
  sessionStorage.setItem("mindSettlerChatId", newId);
  return newId;
};

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", icon: Sun, emoji: "🌅" };
  if (hour < 17) return { text: "Good afternoon", icon: CloudSun, emoji: "☀️" };
  if (hour < 21) return { text: "Good evening", icon: Moon, emoji: "🌆" };
  return { text: "Good night", icon: Moon, emoji: "🌙" };
};

const moodConfig = {
  happy: { icon: Smile, color: "text-green-500", bg: "bg-green-50", border: "border-green-200", label: "Happy" },
  sad: { icon: Frown, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200", label: "Sad" },
  anxious: { icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200", label: "Anxious" },
  stressed: { icon: Zap, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", label: "Stressed" },
  neutral: { icon: Meh, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", label: "Neutral" },
  hopeful: { icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200", label: "Hopeful" },
  calm: { icon: Coffee, color: "text-teal-500", bg: "bg-teal-50", border: "border-teal-200", label: "Calm" },
};

const pageConfig = {
  "/": { name: "Home", icon: GripVertical, color: "from-slate-600 to-slate-800" },
  "/booking": { name: "Booking Session", icon: Calendar, color: "from-[#3F2965] to-[#DD1764]" },
  "/resources": { name: "Resources", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
  "/contact": { name: "Contact", icon: Phone, color: "from-blue-500 to-indigo-500" },
  "/profile": { name: "Profile", icon: User, color: "from-slate-600 to-slate-800" },
  "/corporate": { name: "Corporate", icon: Briefcase, color: "from-amber-500 to-orange-500" },
  "/logout": { name: "Logout", icon: ShieldCheck, color: "from-red-500 to-pink-500" },
};

const defaultQuickReplies = [
  { text: "I'm feeling anxious", emoji: "😰" },
  { text: "I need to talk", emoji: "💭" },
  { text: "Book a session", emoji: "📅" },
  { text: "I'm doing okay", emoji: "😊" },
];

const TypingIndicator = () => (
  <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-linear-to-br from-[#3F2965] via-[#5a3d8a] to-[#DD1764] p-0.5 shadow-lg">
        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
          <img src={botAvatar} alt="" className="w-5 h-5 object-contain" />
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-sm border border-white/50 shadow-lg">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 bg-linear-to-r from-[#3F2965] to-[#DD1764] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MoodBadge = ({ mood }) => {
  if (!mood || !moodConfig[mood]) return null;
  const { icon: Icon, color, bg, border, label } = moodConfig[mood];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${bg} ${border} border rounded-full mt-2`}>
      <Icon size={12} className={color} />
      <span className={`text-[10px] font-bold ${color}`}>{label}</span>
    </div>
  );
};

const QuickActions = ({ buttons, onSelect, isAnimated = true }) => {
  if (!buttons || buttons.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-2 mt-3 ${isAnimated ? "animate-in fade-in slide-in-from-bottom-2 duration-500" : ""}`}>
      {buttons.map((btn, i) => {
        const buttonText = typeof btn === "string" ? btn : btn.text;
        const buttonEmoji = typeof btn === "object" ? btn.emoji : null;

        return (
          <button
            key={i}
            onClick={() => onSelect(buttonText)}
            style={{ animationDelay: `${i * 100}ms` }}
            className="group flex items-center gap-1.5 px-3 py-2 
                       bg-white hover:bg-linear-to-r hover:from-[#3F2965] hover:to-[#DD1764] 
                       border border-slate-200 hover:border-transparent 
                       rounded-full text-xs font-bold text-slate-600 hover:text-white 
                       shadow-sm hover:shadow-lg 
                       transition-all duration-500 hover:scale-105 active:scale-95"
          >
            {buttonEmoji && <span>{buttonEmoji}</span>}
            <span>{buttonText}</span>
          </button>
        );
      })}
    </div>
  );
};

const RedirectingIndicator = ({ target }) => {
  const config = pageConfig[target] || { name: "page", icon: ExternalLink, color: "from-slate-600 to-slate-800" };
  const Icon = config.icon;

  return (
    <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className={`w-full flex items-center justify-center gap-3 py-4 px-4 bg-linear-to-r ${config.color} text-white font-bold text-sm rounded-xl shadow-lg`}>
        <Loader2 size={18} className="animate-spin" />
        <span>Redirecting to {config.name}...</span>
        <Icon size={16} className="animate-pulse" />
      </div>
      <div className="mt-2 flex justify-center">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-linear-to-r ${config.color} animate-pulse`}
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isUser, isLatest, isRedirecting, onQuickReply }) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} group animate-in fade-in ${isUser ? "slide-in-from-right-2" : "slide-in-from-left-2"
        } duration-300`}
    >
      {/* Bot Avatar */}
      {!isUser && (
        <div className="relative mr-2 mt-1 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-linear-to-br from-[#3F2965] via-[#5a3d8a] to-[#DD1764] p-0.5 shadow-lg transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center overflow-hidden">
              <img src={botAvatar} alt="" className="w-5 h-5 object-contain" />
            </div>
          </div>
          {isLatest && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          )}
        </div>
      )}

      <div className={`max-w-[80%] ${!isUser ? "space-y-1" : ""}`}>
        {/* Message Content */}
        <div
          className={`
            relative p-4 text-[13px] sm:text-sm font-medium leading-relaxed shadow-lg
            transition-all duration-300 group-hover:shadow-xl
            ${isUser
              ? "bg-linear-to-br from-[#DD1764] via-[#e83d7f] to-[#ff6b9d] text-white rounded-2xl rounded-tr-sm"
              : "bg-white/80 backdrop-blur-sm text-slate-700 rounded-2xl rounded-tl-sm border border-white/50"
            }
          `}
        >
          {!isUser && (
            <div className="absolute inset-0 rounded-2xl rounded-tl-sm bg-linear-to-br from-purple-50/30 to-pink-50/30 pointer-events-none" />
          )}
          <span className="relative z-10">{message.content}</span>
        </div>

        {/* Mood Badge */}
        {!isUser && message.mood_detected && (
          <MoodBadge mood={message.mood_detected} />
        )}

        {/* Quick Action Buttons - only show if not redirecting */}
        {!isUser && message.action?.buttons && !isRedirecting && (
          <QuickActions buttons={message.action.buttons} onSelect={onQuickReply} />
        )}

        {/* Redirecting Indicator - show instead of navigation button */}
        {!isUser && message.action?.type === "navigate" && message.action?.target && isRedirecting && (
          <RedirectingIndicator target={message.action.target} />
        )}

        {/* Timestamp & Reactions */}
        <div className={`flex items-center gap-2 mt-1.5 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-[9px] text-slate-300">
            {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {/* Reactions popup */}
        {showReactions && !isUser && (
          <div className="absolute -bottom-8 left-0 flex gap-1 p-1.5 bg-white rounded-full shadow-xl border z-10 animate-in zoom-in-95 duration-200">
            {["❤️", "👍", "😊", "🙏"].map((emoji) => (
              <button
                key={emoji}
                onClick={() => setShowReactions(false)}
                className="w-7 h-7 flex items-center justify-center hover:bg-slate-100 rounded-full transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-linear-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-sm shadow-lg ml-2 mt-1 shrink-0">
          {message.userName?.charAt(0) || "U"}
        </div>
      )}
    </div>
  );
};

const useDraggable = (initialPosition = null) => {
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("chatWidgetPosition");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return initialPosition;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (position) {
      localStorage.setItem("chatWidgetPosition", JSON.stringify(position));
    }
  }, [position]);

  const constrainPosition = useCallback((x, y) => {
    const buttonSize = 64;
    const padding = 16;
    return {
      x: Math.max(padding, Math.min(x, window.innerWidth - buttonSize - padding)),
      y: Math.max(padding, Math.min(y, window.innerHeight - buttonSize - padding)),
    };
  }, []);

  const handleDragStart = useCallback((clientX, clientY) => {
    setIsDragging(true);
    setHasMoved(false);
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      setDragStart({ x: clientX - rect.left, y: clientY - rect.top });
    }
  }, []);

  const handleDragMove = useCallback(
    (clientX, clientY) => {
      if (!isDragging) return;
      const constrained = constrainPosition(clientX - dragStart.x, clientY - dragStart.y);
      setPosition(constrained);
      setHasMoved(true);
    },
    [isDragging, dragStart, constrainPosition]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (position) {
      const snapToLeft = position.x < window.innerWidth / 2;
      const snappedX = snapToLeft ? 16 : window.innerWidth - 64 - 16;
      setPosition((prev) => ({ ...prev, x: snappedX }));
    }
  }, [position]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  }, [handleDragStart]);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  }, [handleDragStart]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    const handleEnd = () => handleDragEnd();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    const handleResize = () => {
      if (position) setPosition(constrainPosition(position.x, position.y));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [position, constrainPosition]);

  const resetPosition = useCallback(() => {
    setPosition(null);
    localStorage.removeItem("chatWidgetPosition");
  }, []);

  return { position, isDragging, hasMoved, buttonRef, handleMouseDown, handleTouchStart, resetPosition };
};

const ChatWidget = ({ user }) => {
  const navigate = useNavigate();
  const chatId = useRef(generateChatId()).current;

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [currentMood, setCurrentMood] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectTarget, setRedirectTarget] = useState(null);

  const greeting = getTimeGreeting();
  const userName = user?.name?.split(" ")[0] || "there";

  const [history, setHistory] = useState([
    {
      role: "bot",
      content: `${greeting.emoji} ${greeting.text}, ${userName}! I'm your MindSettler companion. How are you feeling today?`,
      timestamp: new Date().toISOString(),
      action: {
        type: "quick_replies",
        buttons: defaultQuickReplies,
      },
    },
  ]);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const { position, isDragging, hasMoved, buttonRef, handleMouseDown, handleTouchStart, resetPosition } = useDraggable();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history, loading, isRedirecting, isOpen]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setShowNotification(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = useCallback((path) => {
    setIsRedirecting(true);
    setRedirectTarget(path);

    setTimeout(() => {
      setIsOpen(false);
      setIsRedirecting(false);
      setRedirectTarget(null);
      navigate(path);
    }, 2500);
  }, [navigate]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsRedirecting(false);
    setRedirectTarget(null);
  }, []);

  const handleQuickReply = useCallback((text) => {
    if (!isRedirecting) {
      handleSend(text);
    }
  }, [isRedirecting]);

  const handleClearChat = useCallback(async () => {
    try {
      await API.delete(`/chat/clear/${chatId}`);
    } catch (err) {
      console.log("Clear chat error:", err);
    }

    setHistory([{
      role: "bot",
      content: `✨ Fresh start, ${userName}! What would you like to talk about?`,
      timestamp: new Date().toISOString(),
      action: { type: "quick_replies", buttons: defaultQuickReplies },
    }]);
    setCurrentMood(null);
    setMessageCount(0);
    setIsRedirecting(false);
    setRedirectTarget(null);
  }, [chatId, userName]);

  const handleSend = async (text = message) => {
    if (!text.trim() || loading || isRedirecting) return;

    const userMessage = {
      role: "user",
      content: text.trim(),
      userName: user?.name,
      timestamp: new Date().toISOString(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    setMessageCount((prev) => prev + 1);

    try {
      const res = await API.post("/chat", { message: text.trim(), chatId, user });
      const { intent, reply, action, mood_detected } = res.data;

      const botMessage = {
        role: "bot",
        content: reply,
        timestamp: new Date().toISOString(),
        action: action || { type: "none" },
        mood_detected: mood_detected,
        intent: intent,
      };

      if (!action?.buttons && action?.type !== "navigate") {
        botMessage.action = {
          ...botMessage.action,
          buttons: intent === "EMOTIONAL_SUPPORT"
            ? ["Tell me more", "Book a session", "Show resources"]
            : null,
        };
      }

      setHistory((prev) => [...prev, botMessage]);

      if (mood_detected) setCurrentMood(mood_detected);

      const navigationIntents = ["NAVIGATE_HOME", "BOOK_SESSION", "NAVIGATE_BOOKING", "NAVIGATE_RESOURCES", "NAVIGATE_CONTACT", "NAVIGATE_PROFILE", "NAVIGATE_CORPORATE", "NAVIGATE_LOGOUT"];

      if (navigationIntents.includes(intent) && action?.target) {
        handleNavigate(action.target);
      }

    } catch (err) {
      console.error("Chat error:", err);
      setHistory((prev) => [
        ...prev,
        {
          role: "bot",
          content: "I'm having a moment... 🌸 Could you try that again?",
          timestamp: new Date().toISOString(),
          action: { type: "quick_replies", buttons: ["Try again", "Book a session"] },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!hasMoved) {
      setIsOpen(!isOpen);
      setShowNotification(false);
    }
  };

  const buttonPositionStyles = position
    ? { position: "fixed", left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" }
    : { position: "fixed", left: "20px", bottom: "20px" };

  return (
    <div className="font-sans">
      {/* === CHAT WINDOW === */}
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div
            className="md:hidden fixed inset-0 bg-linear-to-b from-[#3F2965]/30 to-[#DD1764]/20 backdrop-blur-md z-40 animate-in fade-in duration-300"
            onClick={handleClose}
          />

          {/* Chat Container */}
          <div className="fixed z-50 inset-0 md:inset-auto md:bottom-24 md:left-6 md:w-95 lg:w-105 md:h-145 lg:h-155 md:rounded-3xl bg-linear-to-b from-white/95 to-white/90 backdrop-blur-xl md:shadow-2xl md:border md:border-white/50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500">

            {/* === HEADER === */}
            <div className="shrink-0 relative bg-linear-to-r from-[#3F2965] to-[#DD1764] shadow-md z-10">
              <div className="absolute inset-0 bg-black/5" />
              
              <div className="relative px-5 py-4 flex justify-between items-center safe-area-top">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center p-1 shadow-md">
                      <img src={botAvatar} alt="MindSettler" className="w-8 h-8 object-contain" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#3F2965]" />
                  </div>

                  {/* Title */}
                  <div className="text-white">
                    <h3 className="text-[15px] font-black flex items-center gap-1.5 tracking-tight">
                      MindSettler
                      <Sparkles size={14} className="text-pink-200" />
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/80">
                      {isRedirecting ? (
                        <span className="flex items-center gap-1">
                          <Loader2 size={10} className="animate-spin" />
                          Redirecting...
                        </span>
                      ) : (
                        <>
                          <span>Online</span>
                          {currentMood && (
                            <>
                              <span className="opacity-50">•</span>
                              <span className="capitalize">{currentMood}</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleClearChat}
                    disabled={isRedirecting}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                    title="Clear chat"
                  >
                    <RefreshCw size={16} className="text-white" />
                  </button>

                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* === CHAT HISTORY === */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
              {history.map((msg, i) => (
                <MessageBubble
                  key={i}
                  message={msg}
                  isUser={msg.role === "user"}
                  isLatest={i === history.length - 1 && msg.role === "bot"}
                  isRedirecting={isRedirecting && msg.action?.target === redirectTarget}
                  onQuickReply={handleQuickReply}
                />
              ))}

              {loading && <TypingIndicator />}

              {/* Show default quick replies after bot message if none provided and not redirecting */}
              {!loading &&
                !isRedirecting &&
                history.length > 0 &&
                history[history.length - 1]?.role === "bot" &&
                !history[history.length - 1]?.action?.buttons &&
                history[history.length - 1]?.action?.type !== "navigate" && (
                  <QuickActions buttons={defaultQuickReplies} onSelect={handleQuickReply} />
                )}

              {/* Privacy Badge */}
              <div className="flex justify-center pt-4 pb-2">
                <div className="flex items-center gap-1.5 px-4 py-2 bg-linear-to-r from-slate-50 to-slate-100 rounded-full border border-slate-200/50">
                  <div className="w-5 h-5 rounded-full bg-linear-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
                    <ShieldCheck size={10} className="text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    End-to-End Encrypted
                  </span>
                </div>
              </div>
            </div>

            {/* === INPUT AREA === */}
            <div className="shrink-0 p-4 bg-white/80 backdrop-blur-sm border-t border-slate-100/50 safe-area-bottom">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 items-end">
                <input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isRedirecting ? "Please wait..." : "Share what's on your mind..."}
                  disabled={isRedirecting}
                  className="flex-1 bg-slate-50/80 hover:bg-slate-50 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3F2965]/20 border border-slate-200/50 focus:border-[#3F2965]/30 transition-all placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={loading || !message.trim() || isRedirecting}
                  className={`p-3 rounded-xl transition-all duration-300 min-h-12 min-w-12 flex items-center justify-center ${message.trim() && !isRedirecting
                    ? "bg-linear-to-r from-[#3F2965] to-[#DD1764] text-white shadow-lg hover:shadow-xl active:scale-95"
                    : "bg-slate-100 text-slate-300"
                    }`}
                >
                  {isRedirecting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>

              <div className="flex justify-center gap-3 mt-2">
                <span className="text-[9px] text-slate-300">Enter to send</span>
                <span className="text-slate-200">•</span>
                <span className="text-[9px] text-slate-300 flex items-center gap-1">
                  <Heart size={8} className="text-pink-400" />
                  Be kind to yourself
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* === FLOATING BUTTON === */}
      <div
        ref={buttonRef}
        style={buttonPositionStyles}
        className={`z-60 touch-none ${isOpen ? "scale-0 md:scale-100 pointer-events-none md:pointer-events-auto" : "scale-100"} transition-transform duration-300`}
      >
        {/* Drag indicator */}
        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 bg-slate-800/80 backdrop-blur-sm text-white text-[9px] font-bold rounded-full transition-all duration-300 ${isDragging ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
          <GripVertical size={10} />
          <span>Dragging</span>
        </div>

        {/* Pulsing rings */}
        {!isOpen && !isDragging && (
          <>
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#3F2965] to-[#DD1764] animate-ping opacity-20" />
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-[#3F2965] to-[#DD1764] animate-ping opacity-10" style={{ animationDelay: "0.5s" }} />
          </>
        )}

        {/* Main button */}
        <button
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleButtonClick}
          className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl border-4 border-white select-none transition-all duration-300 ${isDragging ? "cursor-grabbing scale-110" : "cursor-grab"
            } ${isOpen ? "bg-slate-800 rotate-180" : "bg-linear-to-br from-[#3F2965] via-[#5a3d8a] to-[#DD1764] hover:shadow-purple-500/50"} ${!isDragging && !isOpen ? "hover:scale-110 active:scale-95" : ""
            }`}
          style={{ touchAction: "none" }}
        >
          {isDragging && <div className="absolute inset-0 rounded-full border-4 border-white/50 border-dashed animate-spin" style={{ animationDuration: "3s" }} />}

          {isOpen ? (
            <X size={24} className="text-white" />
          ) : (
            <img src={botAvatar} alt="Chat" className={`w-full h-full object-cover transition-transform duration-300 ${isDragging ? "scale-90" : "scale-110"}`} draggable={false} />
          )}

          {/* Online indicator */}
          {!isOpen && (
            <div className={`absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center transition-transform ${isDragging ? "scale-0" : "scale-100"}`}>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}

          {/* Message count badge */}
          {!isOpen && messageCount > 0 && (
            <div className={`absolute -bottom-1 -left-1 min-w-5 h-5 px-1.5 bg-[#DD1764] rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform ${isDragging ? "scale-0" : "scale-100"}`}>
              <span className="text-[10px] font-bold text-white">{messageCount > 99 ? "99+" : messageCount}</span>
            </div>
          )}
        </button>

        {/* Reset position button */}
        {position && !isOpen && !isDragging && (
          <button
            onClick={(e) => { e.stopPropagation(); resetPosition(); }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800/80 backdrop-blur-sm text-white text-[9px] font-bold rounded-full hover:bg-slate-700 transition-all animate-in fade-in"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;