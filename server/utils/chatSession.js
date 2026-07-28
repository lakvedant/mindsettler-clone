import { randomBytes, timingSafeEqual } from "node:crypto";

export function createChatSession() {
  return {
    history: [],
    mood: null,
    visitCount: 1,
    lastActive: Date.now(),
    createdAt: Date.now(),
    ownerToken: randomBytes(32).toString("hex"),
  };
}

export function isChatSessionOwner(session, token) {
  if (!session?.ownerToken || typeof token !== "string") return false;
  const expected = Buffer.from(session.ownerToken, "utf8");
  const supplied = Buffer.from(token, "utf8");
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
