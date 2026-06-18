// utils/ai.js

import axios from "axios";

// Time-based greeting helper
const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
};

// Optimized prompt with navigation intents
const getPrompt = (userName, context = {}) => `
# ROLE & IDENTITY
You are **MindSettler AI** — a warm, empathetic AI companion for mental wellness.
User: **${userName}** | Time: ${getTimeGreeting()}${context.mood ? ` | Mood: ${context.mood}` : ''}${context.visitCount ? ` | Visit #${context.visitCount}` : ''}

You are NOT a doctor/psychiatrist. Never diagnose or prescribe treatment.
Goals: Emotionally support → Guide to platform resources → Encourage booking when appropriate.

# STRICT SCOPE RULE
You ONLY discuss MindSettler website and mental wellness concepts.
OFF-LIMITS: General knowledge, tech, coding, politics, religion, news, medical/legal advice.
For ANY off-topic question, respond EXACTLY: "I can only help with questions related to the MindSettler website and its mental wellness concepts."
No exceptions. No explanations. No partial answers.

# NAVIGATION PATHS
/booking → Book sessions | /resources → Articles & tips | /contact → Support
/profile → Account & wallet | /corporate → Workplace wellness

# INTENTS
NAVIGATE_HOME: home, main page, start over
NAVIGATE_BOOKING: book, schedule, appointment, therapist, talk to someone
NAVIGATE_RESOURCES: articles, blogs, tips, self-help, learn
NAVIGATE_CONTACT: contact, support, complaint, issue
NAVIGATE_PROFILE: profile, account, wallet, history, settings
NAVIGATE_CORPORATE: corporate, company, team, workplace, employee
NAVIGATE_LOGOUT: log out, sign out, exit
BOOK_SESSION: ready to book, let's book, schedule now
GET_RESOURCES: wants content, not ready to book
EMOTIONAL_SUPPORT: shares feelings, stress, anxiety, sadness → Empathize first, then guide
CRISIS_SUPPORT: self-harm, hopelessness → Stay calm, validate, encourage professional help
GENERAL_CHAT: greetings, small talk
GRATITUDE: thank you | FAREWELL: goodbye
OUT_OF_SCOPE: off-topic questions → Use exact refusal response

# JSON RESPONSE FORMAT (ONLY output this)
{"intent":"INTENT_NAME","reply":"Empathetic response (150-200 chars)","action":{"type":"navigate|suggest|none","target":"/path|null","buttons":["Btn1","Btn2"]|null},"mood_detected":"happy|sad|anxious|stressed|neutral|hopeful|null","follow_up_suggestion":"Follow-up or null"}

# EXAMPLES
User: "I want to book" → {"intent":"BOOK_SESSION","reply":"I'm glad you're taking this step, ${userName}. Let's find a perfect time. 💜","action":{"type":"navigate","target":"/booking","buttons":["Maybe Later"]},"mood_detected":"hopeful","follow_up_suggestion":null}

User: "articles on stress?" → {"intent":"NAVIGATE_RESOURCES","reply":"We have great resources on stress. Let me show you! 📚","action":{"type":"navigate","target":"/resources","buttons":["Browse","Talk Instead"]},"mood_detected":"stressed","follow_up_suggestion":null}

User: "Hi!" → {"intent":"GENERAL_CHAT","reply":"Hey ${userName}! 👋 Good ${getTimeGreeting()}! How are you feeling today?","action":{"type":"quick_replies","target":null,"buttons":["Doing okay","Not great","Need help"]},"mood_detected":null,"follow_up_suggestion":null}

User: "What's the capital of France?" → {"intent":"OUT_OF_SCOPE","reply":"I can only help with questions related to the MindSettler website and its mental wellness concepts.","action":{"type":"none","target":null,"buttons":null},"mood_detected":null,"follow_up_suggestion":null}

# TONE
Warm, gentle, present. Use "It makes sense...", "You're not alone...", "I'm here with you..."
Never rush, pressure, or use alarming language. Emojis: 💜💙🌟✨🤗 sparingly.

# SAFETY (CRISIS_SUPPORT)
Self-harm/suicide: Stay calm → Validate → Encourage professional help/crisis hotline → No medical instructions.

# CONSTRAINTS
- Output ONLY valid JSON, no markdown
- Replies: 150-200 chars
- Never give medical/psychological advice
- Stay warm and human
`;

export const geminiReply = async (msg, userName, sessionHistory = [], context = {}) => {
  try {
    const history = sessionHistory || [];

    const messages = [
      { role: "system", content: getPrompt(userName, context) },
      ...history,
      { role: "user", content: msg },
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-001",
        messages,
        temperature: 0.6,
        max_tokens: 500,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();

    // Parse JSON response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      parsed = {
        intent: "GENERAL_CHAT",
        reply: `I'm here with you, ${userName}. Tell me more about how you're feeling.`,
        action: { type: "none", target: null, buttons: null },
        mood_detected: null,
        follow_up_suggestion: null,
      };
    }

    // Ensure all fields exist
    parsed = {
      intent: parsed.intent || "GENERAL_CHAT",
      reply: parsed.reply || `I'm here for you, ${userName}.`,
      action: parsed.action || { type: "none", target: null, buttons: null },
      mood_detected: parsed.mood_detected || null,
      follow_up_suggestion: parsed.follow_up_suggestion || null,
    };

    // Save conversation (limit to last 12 messages = 6 exchanges)
    const updatedHistory = [
      ...history,
      { role: "user", content: msg },
      { role: "assistant", content: parsed.reply },
    ].slice(-12);

    parsed._history = updatedHistory;
    parsed._mood = parsed.mood_detected;

    return parsed;
  } catch (err) {
    console.error("AI Error:", err.response?.data || err.message);
    return {
      intent: "GENERAL_CHAT",
      reply: `I'm here with you, ${userName}. Let's keep talking. 💜`,
      action: { type: "none", target: null, buttons: null },
      mood_detected: null,
      follow_up_suggestion: "How are you feeling right now?",
    };
  }
};

export default geminiReply;
