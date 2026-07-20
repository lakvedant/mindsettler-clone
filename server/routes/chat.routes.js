// routes/chat.routes.js

import express from "express";
import { geminiReply } from "../utils/ai.js";
import { chatLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// In-memory chat storage (use Redis in production)
const chatSessions = new Map();

// Session cleanup (remove old sessions after 30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const MAX_SESSIONS = 1_000;

const cleanupOldSessions = () => {
  const now = Date.now();
  for (const [chatId, session] of chatSessions.entries()) {
    if (now - session.lastActive > SESSION_TIMEOUT) {
      chatSessions.delete(chatId);
    }
  }
};

// Run cleanup every 10 minutes
setInterval(cleanupOldSessions, 10 * 60 * 1000);

// Get or create session
const getSession = (chatId) => {
  if (!chatSessions.has(chatId)) {
    if (chatSessions.size >= MAX_SESSIONS) {
      chatSessions.delete(chatSessions.keys().next().value);
    }
    chatSessions.set(chatId, {
      history: [],
      mood: null,
      visitCount: 1,
      lastActive: Date.now(),
      createdAt: Date.now(),
    });
  }
  return chatSessions.get(chatId);
};

// Main chat endpoint
router.post("/", chatLimiter, async (req, res) => {
  const { message, chatId, user } = req.body;
  const userName = typeof user?.name === "string"
    ? user.name.trim().split(" ")[0].slice(0, 50) || "Friend"
    : "Friend";

  // Validate input
  if (typeof chatId !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(chatId)) {
    return res.status(400).json({
      intent: "ERROR",
      reply: "Something went wrong. Please refresh and try again.",
      action: { type: "none" },
    });
  }

  if (typeof message !== "string" || message.trim().length === 0 || message.length > 2_000) {
    return res.status(400).json({
      intent: "ERROR",
      reply: "I didn't catch that. Could you say that again?",
      action: { type: "none" },
    });
  }

  // Get session
  const session = getSession(chatId);
  session.lastActive = Date.now();

  try {
    // Context for AI
    const context = {
      mood: session.mood,
      visitCount: session.visitCount,
      userId: undefined,
    };

    // Get AI response
    const aiResponse = await geminiReply(message, userName, session.history, context);

    // Update session
    if (aiResponse._history) {
      session.history = aiResponse._history;
      delete aiResponse._history;
    }

    if (aiResponse._mood) {
      session.mood = aiResponse._mood;
      delete aiResponse._mood;
    }

    // Process navigation intents
    const navigationMap = {
      NAVIGATE_HOME: "/",
      NAVIGATE_BOOKING: "/booking",
      NAVIGATE_RESOURCES: "/resources",
      NAVIGATE_CONTACT: "/contact",
      NAVIGATE_PROFILE: "/profile",
      NAVIGATE_CORPORATE: "/corporate",
      NAVIGATE_LOGOUT: "/logout",
      BOOK_SESSION: "/booking",
    };

    // Add navigation target if intent matches
    if (navigationMap[aiResponse.intent]) {
      aiResponse.action = {
        ...aiResponse.action,
        type: "navigate",
        target: navigationMap[aiResponse.intent],
      };
    }

    // Add default quick replies if none provided
    if (!aiResponse.action?.buttons && aiResponse.intent === "EMOTIONAL_SUPPORT") {
      aiResponse.action = {
        ...aiResponse.action,
        type: "quick_replies",
        buttons: ["Tell me more", "Book a session", "Show resources"],
      };
    }

    // Send response
    res.json({
      ...aiResponse,
      sessionId: chatId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({
      intent: "ERROR",
      reply: `I'm here with you, ${userName}. Let's keep talking. 💜`,
      action: { type: "none" },
      timestamp: new Date().toISOString(),
    });
  }
});

// Get chat history
router.get("/history/:chatId", async (req, res) => {
  const { chatId } = req.params;
  
  if (!chatSessions.has(chatId)) {
    return res.json({ history: [], mood: null });
  }

  const session = chatSessions.get(chatId);
  res.json({
    history: session.history,
    mood: session.mood,
    visitCount: session.visitCount,
  });
});

// Clear chat session
router.delete("/clear/:chatId", async (req, res) => {
  const { chatId } = req.params;
  
  if (chatSessions.has(chatId)) {
    chatSessions.delete(chatId);
  }
  
  res.json({ success: true, message: "Chat cleared" });
});

// Get suggested responses
router.get("/suggestions", async (req, res) => {
  const suggestions = [
    "I'm feeling anxious today",
    "I need someone to talk to",
    "Book a therapy session",
    "Show me some resources",
    "I'm doing okay, just checking in",
  ];
  res.json({ suggestions });
});

export default router;
