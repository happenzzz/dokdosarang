import { DurableObject } from "cloudflare:workers";

export interface Env {
  ROOM: DurableObjectNamespace;
  ASSETS: Fetcher;
  FIREBASE_PROJECT_ID?: string;
  TEACHER_EMAILS?: string;
}

type Avatar = {
  face: number;
  hair: number;
  hairColor: number;
  outfit: number;
  accessory: number;
};

type ClientState = {
  connectionId: string;
  id: string;
  resumeTokenHash: string;
  sessionId: string;
  joined: boolean;
  superseded: boolean;
  leftAnnounced: boolean;
  name: string;
  studentId: string;
  group: string;
  x: number;
  y: number;
  facing: "up" | "down" | "left" | "right";
  avatar: Avatar;
  lastSeenMs: number;
  sequence: number;
  canModerate: boolean;
  rateWindowMs: number;
  rateCount: number;
  lastMoveMs: number;
  lastChatMs: number;
  lastJoinMs: number;
};

type ChatMessage = {
  id: string;
  ownerUid: string;
  name: string;
  text: string;
  createdAtMs: number;
  clientMessageId?: string;
};

const CHAT_HISTORY_KEY = "chat-history-v1";
const CHAT_HISTORY_LIMIT = 40;
const MAX_MESSAGE_BYTES = 8_192;
const DEFAULT_ROOM_NAME = "dokdo-ullim-museum-v1";
const IDENTITY_PREFIX = "player-identity-v1:";
const HEARTBEAT_TIMEOUT_MS = 60_000;
const ALARM_INTERVAL_MS = 30_000;
const FIREBASE_JWK_URL = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";
const DEFAULT_AVATAR: Avatar = { face: 0, hair: 0, hairColor: 0, outfit: 0, accessory: 0 };

let cachedFirebaseKeys: { expiresAt: number; keys: JsonWebKey[] } | null = null;

function objectValue(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function cleanText(value: unknown, maxLength: number): string {
  return String(value ?? "").trim().slice(0, maxLength);
}

function cleanId(value: unknown, maxLength = 96): string {
  return cleanText(value, maxLength).replace(/[^a-zA-Z0-9_-]/g, "");
}

function validId(value: unknown, minLength = 1, maxLength = 96): string {
  const id = String(value ?? "");
  return id.length >= minLength && id.length <= maxLength && /^[a-zA-Z0-9_-]+$/.test(id)
    ? id
    : "";
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64UrlBytes(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function jwtPart(value: string): Record<string, unknown> | null {
  try {
    return objectValue(JSON.parse(new TextDecoder().decode(base64UrlBytes(value))));
  } catch {
    return null;
  }
}

async function firebaseKeys(): Promise<JsonWebKey[]> {
  if (cachedFirebaseKeys && cachedFirebaseKeys.expiresAt > Date.now()) return cachedFirebaseKeys.keys;
  const response = await fetch(FIREBASE_JWK_URL);
  if (!response.ok) throw new Error("Unable to load Firebase signing keys");
  const body = await response.json() as { keys?: JsonWebKey[] };
  const keys = Array.isArray(body.keys) ? body.keys : [];
  const maxAge = Number(response.headers.get("cache-control")?.match(/max-age=(\d+)/)?.[1]) || 3_600;
  cachedFirebaseKeys = { expiresAt: Date.now() + maxAge * 1_000, keys };
  return keys;
}

async function verifyTeacherToken(token: string, env: Env): Promise<boolean> {
  const projectId = cleanText(env.FIREBASE_PROJECT_ID, 100);
  const allowedEmails = new Set(
    String(env.TEACHER_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
  if (!projectId || !allowedEmails.size || token.length < 100 || token.length > 4_096) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const header = jwtPart(parts[0]);
  const payload = jwtPart(parts[1]);
  if (!header || !payload || header.alg !== "RS256" || typeof header.kid !== "string") return false;

  const now = Math.floor(Date.now() / 1_000);
  if (payload.aud !== projectId || payload.iss !== `https://securetoken.google.com/${projectId}`) return false;
  if (typeof payload.sub !== "string" || !payload.sub || payload.sub.length > 128) return false;
  if (typeof payload.exp !== "number" || payload.exp <= now) return false;
  if (typeof payload.iat !== "number" || payload.iat > now + 300) return false;
  if (payload.email_verified !== true || typeof payload.email !== "string") return false;
  if (!allowedEmails.has(payload.email.toLowerCase())) return false;

  const jwk = (await firebaseKeys()).find((key) => key.kid === header.kid);
  if (!jwk) return false;
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    base64UrlBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
}

function finiteNumber(value: unknown, fallback: number, min: number, max: number): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
}

function integerInRange(value: unknown, fallback: number, max: number): number {
  return Math.round(finiteNumber(value, fallback, 0, max));
}

function normalizeAvatar(value: unknown): Avatar {
  const avatar = objectValue(value) ?? {};
  return {
    face: integerInRange(avatar.face, 0, 7),
    hair: integerInRange(avatar.hair, 0, 11),
    hairColor: integerInRange(avatar.hairColor, 0, 11),
    outfit: integerInRange(avatar.outfit, 0, 11),
    accessory: integerInRange(avatar.accessory, 0, 8),
  };
}

function normalizeFacing(value: unknown, fallback: ClientState["facing"]): ClientState["facing"] {
  return value === "up" || value === "down" || value === "left" || value === "right"
    ? value
    : fallback;
}

function publicPlayer(player: ClientState) {
  return {
    id: player.id,
    uid: player.id,
    sessionId: player.sessionId,
    studentId: player.studentId,
    name: player.name,
    group: player.group,
    x: player.x,
    y: player.y,
    facing: player.facing,
    avatar: player.avatar,
    lastSeenMs: player.lastSeenMs,
    sequence: player.sequence,
  };
}

export class DokdoRoom extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return new Response("WebSocket required", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);

    const player: ClientState = {
      connectionId: crypto.randomUUID(),
      id: "",
      resumeTokenHash: "",
      sessionId: "",
      joined: false,
      superseded: false,
      leftAnnounced: false,
      name: "",
      studentId: "",
      group: "",
      x: 50,
      y: 86,
      facing: "down",
      avatar: DEFAULT_AVATAR,
      lastSeenMs: Date.now(),
      sequence: 0,
      canModerate: false,
      rateWindowMs: Date.now(),
      rateCount: 0,
      lastMoveMs: 0,
      lastChatMs: 0,
      lastJoinMs: 0,
    };
    server.serializeAttachment(player);
    await this.ctx.storage.setAlarm(Date.now() + ALARM_INTERVAL_MS);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    if (
      typeof message !== "string" ||
      new TextEncoder().encode(message).byteLength > MAX_MESSAGE_BYTES
    ) return;

    let data: Record<string, unknown> | null;
    try {
      data = objectValue(JSON.parse(message));
    } catch {
      return;
    }
    if (!data) return;

    const player = this.readPlayer(ws);
    const eventType = typeof data.type === "string" ? data.type : "unknown";
    if (!this.allowEvent(ws, player, eventType)) {
      const requestId = eventType === "chat"
        ? validId(data.clientMessageId, 1, 96)
        : validId(data.requestId, 1, 96);
      if (eventType === "chat" || eventType === "deleteChat" || eventType === "clearChat") {
        this.sendError(ws, eventType, requestId, "rate_limited");
      }
      return;
    }

    if (data.type === "join") {
      await this.join(ws, player, data);
      return;
    }

    if (!player.joined || player.superseded || player.leftAnnounced) return;

    if (data.type === "authenticate") {
      let canModerate = false;
      try {
        canModerate = await verifyTeacherToken(String(data.token ?? ""), this.env);
      } catch {
        canModerate = false;
      }
      const current = this.readPlayer(ws);
      if (
        current.connectionId !== player.connectionId ||
        current.id !== player.id ||
        !current.joined ||
        current.superseded ||
        current.leftAnnounced
      ) return;
      current.canModerate = canModerate;
      current.lastSeenMs = Date.now();
      ws.serializeAttachment(current);
      this.send(ws, { type: "moderation", enabled: canModerate });
      return;
    }

    if (data.type === "move" || data.type === "heartbeat") {
      player.x = finiteNumber(data.x, player.x, 0, 100);
      player.y = finiteNumber(data.y, player.y, 0, 100);
      player.facing = normalizeFacing(data.facing, player.facing);
      if (data.avatar !== undefined) player.avatar = normalizeAvatar(data.avatar);
      player.lastSeenMs = Date.now();
      player.sequence = Math.max(
        player.sequence + 1,
        integerInRange(data.sequence, player.sequence + 1, Number.MAX_SAFE_INTEGER),
      );
      ws.serializeAttachment(player);
      this.broadcast({ type: "move", player: publicPlayer(player) }, ws);
      return;
    }

    if (data.type === "chat") {
      const text = cleanText(data.text, 120);
      if (!text) return;
      const clientMessageId = validId(data.clientMessageId, 1, 96);
      const chat: ChatMessage = {
        id: crypto.randomUUID(),
        ownerUid: player.id,
        name: player.name || "학생",
        text,
        createdAtMs: Date.now(),
        ...(clientMessageId ? { clientMessageId } : {}),
      };
      try {
        await this.appendChat(chat);
        this.broadcast({ type: "chat", message: chat });
      } catch {
        this.sendError(ws, "chat", clientMessageId, "store_failed");
      }
      return;
    }

    if (data.type === "deleteChat") {
      const id = validId(data.id, 1, 96);
      const requestId = validId(data.requestId, 1, 96);
      if (!player.canModerate) {
        this.sendError(ws, "deleteChat", requestId, "forbidden");
        return;
      }
      if (!id) {
        this.sendError(ws, "deleteChat", requestId, "invalid_request");
        return;
      }
      try {
        const removed = await this.deleteChat(id);
        if (!removed) this.sendError(ws, "deleteChat", requestId, "not_found");
        else this.broadcast({ type: "chatDeleted", id, requestId });
      } catch {
        this.sendError(ws, "deleteChat", requestId, "store_failed");
      }
      return;
    }

    if (data.type === "clearChat") {
      const requestId = validId(data.requestId, 1, 96);
      if (!player.canModerate) {
        this.sendError(ws, "clearChat", requestId, "forbidden");
        return;
      }
      const cutoff = finiteNumber(data.cutoff, Date.now(), 0, Date.now() + 60_000);
      try {
        await this.clearChat(cutoff);
        this.broadcast({ type: "chatCleared", cutoff, requestId });
      } catch {
        this.sendError(ws, "clearChat", requestId, "store_failed");
      }
      return;
    }

    if (data.type === "reaction") {
      const reaction = cleanText(data.reaction, 10);
      if (!reaction) return;
      player.lastSeenMs = Date.now();
      ws.serializeAttachment(player);
      this.broadcast({
        type: "reaction",
        id: player.id,
        reaction,
        reactionAt: player.lastSeenMs,
      });
    }
  }

  webSocketClose(ws: WebSocket, _code: number, _reason: string, _wasClean: boolean): void {
    this.announceDeparture(ws);
  }

  webSocketError(ws: WebSocket, _error: unknown): void {
    this.announceDeparture(ws);
    try { ws.close(1011, "WebSocket error"); } catch {}
  }

  async alarm(): Promise<void> {
    const now = Date.now();
    let hasOpenSocket = false;

    for (const socket of this.ctx.getWebSockets()) {
      if (socket.readyState !== WebSocket.OPEN) continue;
      const player = this.readPlayer(socket);
      if (now - player.lastSeenMs > HEARTBEAT_TIMEOUT_MS) {
        this.announceDeparture(socket);
        try { socket.close(4000, "Connection timed out"); } catch {}
      } else {
        hasOpenSocket = true;
      }
    }

    if (hasOpenSocket) {
      await this.ctx.storage.setAlarm(now + ALARM_INTERVAL_MS);
    }
  }

  private async join(
    ws: WebSocket,
    player: ClientState,
    data: Record<string, unknown>,
  ): Promise<void> {
    const resumeToken = validId(data.playerToken, 20, 160);
    if (!resumeToken) {
      this.sendError(ws, "join", "", "invalid_identity");
      this.announceDeparture(ws);
      try { ws.close(1008, "A private player token is required"); } catch {}
      return;
    }

    const resumeTokenHash = await sha256Hex(resumeToken);
    let playerId: string;
    if (player.joined && !player.superseded && !player.leftAnnounced) {
      if (!player.id || player.resumeTokenHash !== resumeTokenHash) {
        this.sendError(ws, "join", "", "identity_changed");
        this.announceDeparture(ws);
        try { ws.close(1008, "Identity cannot change on an active socket"); } catch {}
        return;
      }
      playerId = player.id;
    } else {
      const requestedId = validId(data.playerId, 8, 96);
      playerId = await this.resolvePlayerId(requestedId, resumeTokenHash);
    }
    const sessionId = validId(data.sessionId, 1, 96) || player.connectionId;

    for (const socket of this.ctx.getWebSockets()) {
      if (socket === ws) continue;
      const other = this.readPlayer(socket);
      if (!other.joined || other.superseded || other.leftAnnounced || other.id !== playerId) continue;
      other.superseded = true;
      other.joined = false;
      other.leftAnnounced = true;
      other.canModerate = false;
      socket.serializeAttachment(other);
      try {
        this.send(socket, { type: "replaced", id: other.id });
        socket.close(4001, "A newer connection replaced this one");
      } catch {
        // The close hook ignores this socket because it is marked superseded.
      }
    }

    Object.assign(player, {
      id: playerId,
      resumeTokenHash,
      sessionId,
      joined: true,
      superseded: false,
      leftAnnounced: false,
      name: cleanText(data.name, 20) || "학생",
      studentId: cleanText(data.studentId, 30),
      group: cleanText(data.group, 20),
      x: finiteNumber(data.x, 50, 0, 100),
      y: finiteNumber(data.y, 86, 0, 100),
      facing: normalizeFacing(data.facing, "down"),
      avatar: normalizeAvatar(data.avatar),
      lastSeenMs: Date.now(),
      sequence: 0,
      canModerate: false,
    });
    ws.serializeAttachment(player);

    const playersById = new Map<string, ReturnType<typeof publicPlayer>>();
    for (const socket of this.ctx.getWebSockets()) {
      if (socket === ws) continue;
      const other = this.readPlayer(socket);
      if (
        socket.readyState !== WebSocket.OPEN ||
        !other.joined ||
        other.superseded ||
        other.leftAnnounced ||
        !other.id ||
        !other.name
      ) continue;
      const existing = playersById.get(other.id);
      if (!existing || existing.lastSeenMs < other.lastSeenMs) {
        playersById.set(other.id, publicPlayer(other));
      }
    }

    const messages = await this.loadChat();
    this.send(ws, {
      type: "welcome",
      id: player.id,
      player: publicPlayer(player),
      players: [...playersById.values()],
      messages,
      serverTimeMs: Date.now(),
    });
    this.broadcast({ type: "playerJoined", player: publicPlayer(player) }, ws);
    await this.ctx.storage.setAlarm(Date.now() + ALARM_INTERVAL_MS);
  }

  private async resolvePlayerId(requestedId: string, resumeTokenHash: string): Promise<string> {
    return this.ctx.storage.transaction(async (transaction) => {
      if (requestedId) {
        const knownHash = await transaction.get<string>(IDENTITY_PREFIX + requestedId);
        if (knownHash === resumeTokenHash) return requestedId;
        if (knownHash === undefined) {
          await transaction.put(IDENTITY_PREFIX + requestedId, resumeTokenHash);
          return requestedId;
        }
      }

      for (let attempt = 0; attempt < 5; attempt++) {
        const generatedId = `player-${crypto.randomUUID()}`;
        const knownHash = await transaction.get<string>(IDENTITY_PREFIX + generatedId);
        if (knownHash !== undefined) continue;
        await transaction.put(IDENTITY_PREFIX + generatedId, resumeTokenHash);
        return generatedId;
      }
      throw new Error("Unable to allocate a player identity");
    });
  }

  private readPlayer(ws: WebSocket): ClientState {
    const stored = objectValue(ws.deserializeAttachment()) ?? {};
    const now = Date.now();
    return {
      connectionId: validId(stored.connectionId, 1, 96) || crypto.randomUUID(),
      id: validId(stored.id, 1, 96),
      resumeTokenHash: validId(stored.resumeTokenHash, 64, 64),
      sessionId: validId(stored.sessionId, 1, 96),
      joined: stored.joined === true,
      superseded: stored.superseded === true,
      leftAnnounced: stored.leftAnnounced === true,
      name: cleanText(stored.name, 20),
      studentId: cleanText(stored.studentId, 30),
      group: cleanText(stored.group, 20),
      x: finiteNumber(stored.x, 50, 0, 100),
      y: finiteNumber(stored.y, 86, 0, 100),
      facing: normalizeFacing(stored.facing, "down"),
      avatar: normalizeAvatar(stored.avatar),
      lastSeenMs: finiteNumber(stored.lastSeenMs, now, 0, Number.MAX_SAFE_INTEGER),
      sequence: integerInRange(stored.sequence, 0, Number.MAX_SAFE_INTEGER),
      canModerate: stored.canModerate === true,
      rateWindowMs: finiteNumber(stored.rateWindowMs, now, 0, Number.MAX_SAFE_INTEGER),
      rateCount: integerInRange(stored.rateCount, 0, 10_000),
      lastMoveMs: finiteNumber(stored.lastMoveMs, 0, 0, Number.MAX_SAFE_INTEGER),
      lastChatMs: finiteNumber(stored.lastChatMs, 0, 0, Number.MAX_SAFE_INTEGER),
      lastJoinMs: finiteNumber(stored.lastJoinMs, 0, 0, Number.MAX_SAFE_INTEGER),
    };
  }

  private allowEvent(ws: WebSocket, player: ClientState, eventType: string): boolean {
    const now = Date.now();
    if (now - player.rateWindowMs >= 1_000) {
      player.rateWindowMs = now;
      player.rateCount = 0;
    }
    player.rateCount++;

    let allowed = player.rateCount <= 80;
    if ((eventType === "move" || eventType === "heartbeat") && now - player.lastMoveMs < 35) {
      allowed = false;
    } else if (eventType === "move" || eventType === "heartbeat") {
      player.lastMoveMs = now;
    } else if (eventType === "chat" && now - player.lastChatMs < 400) {
      allowed = false;
    } else if (eventType === "chat") {
      player.lastChatMs = now;
    } else if (eventType === "join" && now - player.lastJoinMs < 250) {
      allowed = false;
    } else if (eventType === "join") {
      player.lastJoinMs = now;
    }

    if (player.joined && !player.superseded && !player.leftAnnounced) player.lastSeenMs = now;
    ws.serializeAttachment(player);
    return allowed;
  }

  private send(ws: WebSocket, data: unknown): boolean {
    if (ws.readyState !== WebSocket.OPEN) return false;
    try {
      ws.send(JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  }

  private sendError(
    ws: WebSocket,
    action: string,
    requestId: string,
    code: string,
  ): void {
    this.send(ws, { type: "actionError", action, requestId, code });
  }

  private announceDeparture(ws: WebSocket): void {
    const player = this.readPlayer(ws);
    if (!player.joined || player.leftAnnounced || !player.id) return;

    const replacementExists = this.ctx.getWebSockets().some((socket) => {
      if (socket === ws) return false;
      const other = this.readPlayer(socket);
      return socket.readyState === WebSocket.OPEN &&
        other.joined &&
        !other.superseded &&
        !other.leftAnnounced &&
        other.id === player.id;
    });

    const shouldBroadcast = !player.superseded && !replacementExists;
    player.joined = false;
    player.leftAnnounced = true;
    player.canModerate = false;
    try { ws.serializeAttachment(player); } catch {}
    if (shouldBroadcast) this.broadcast({ type: "playerLeft", id: player.id }, ws);
  }

  private async loadChat(): Promise<ChatMessage[]> {
    const messages = await this.ctx.storage.get<ChatMessage[]>(CHAT_HISTORY_KEY);
    return Array.isArray(messages) ? messages.slice(-CHAT_HISTORY_LIMIT) : [];
  }

  private async appendChat(message: ChatMessage): Promise<void> {
    await this.ctx.storage.transaction(async (transaction) => {
      const current = await transaction.get<ChatMessage[]>(CHAT_HISTORY_KEY);
      const messages = Array.isArray(current)
        ? current.filter((item) => item && item.id !== message.id)
        : [];
      messages.push(message);
      await transaction.put(CHAT_HISTORY_KEY, messages.slice(-CHAT_HISTORY_LIMIT));
    });
  }

  private async deleteChat(id: string): Promise<boolean> {
    let removed = false;
    await this.ctx.storage.transaction(async (transaction) => {
      const current = await transaction.get<ChatMessage[]>(CHAT_HISTORY_KEY);
      const messages = Array.isArray(current) ? current : [];
      const next = messages.filter((message) => message && message.id !== id);
      removed = next.length !== messages.length;
      if (removed) await transaction.put(CHAT_HISTORY_KEY, next);
    });
    return removed;
  }

  private async clearChat(cutoff: number): Promise<void> {
    await this.ctx.storage.transaction(async (transaction) => {
      const current = await transaction.get<ChatMessage[]>(CHAT_HISTORY_KEY);
      const messages = Array.isArray(current) ? current : [];
      await transaction.put(
        CHAT_HISTORY_KEY,
        messages.filter((message) => message && message.createdAtMs > cutoff),
      );
    });
  }

  private broadcast(data: unknown, except?: WebSocket): void {
    const text = JSON.stringify(data);
    for (const socket of this.ctx.getWebSockets()) {
      if (socket === except) continue;
      const player = this.readPlayer(socket);
      if (
        socket.readyState !== WebSocket.OPEN ||
        !player.joined ||
        player.superseded ||
        player.leftAnnounced
      ) continue;
      try { socket.send(text); } catch {}
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      if (request.method !== "GET" || request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
        return new Response("WebSocket required", { status: 426 });
      }
      const origin = request.headers.get("Origin");
      if (origin) {
        try {
          if (new URL(origin).origin !== url.origin) {
            return new Response("Origin not allowed", { status: 403 });
          }
        } catch {
          return new Response("Origin not allowed", { status: 403 });
        }
      }
      const requestedRoom = cleanId(url.searchParams.get("room"), 80);
      const room = requestedRoom === DEFAULT_ROOM_NAME ? requestedRoom : DEFAULT_ROOM_NAME;
      return env.ROOM.getByName(room).fetch(request);
    }

    if (url.pathname === "/api/health") {
      return Response.json({
        ok: true,
        app: "dokdo-ullim",
        backend: "cloudflare",
        realtime: "durable-object-websocket",
      });
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
