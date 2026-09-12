import { DurableObject } from "cloudflare:workers";

export interface Env {
  ROOM: DurableObjectNamespace;
  ASSETS: Fetcher;
}

type ClientState = {
  id: string;
  name: string;
  studentId?: string;
  group?: string;
  x: number;
  y: number;
  facing?: string;
  avatar?: unknown;
  lastSeenMs: number;
};

export class DokdoRoom extends DurableObject<Env> {
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("WebSocket required", { status: 426 });
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);

    const player: ClientState = {
      id: crypto.randomUUID(),
      name: "",
      x: 50,
      y: 86,
      lastSeenMs: Date.now(),
    };
    server.serializeAttachment(player);

    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    if (typeof message !== "string") return;
    let data: any;
    try { data = JSON.parse(message); } catch { return; }

    const player = (ws.deserializeAttachment() || {}) as ClientState;

    if (data.type === "join") {
      Object.assign(player, {
        name: String(data.name || "학생").slice(0, 20),
        studentId: String(data.studentId || "").slice(0, 30),
        group: String(data.group || "").slice(0, 20),
        x: Number(data.x) || 50,
        y: Number(data.y) || 86,
        facing: String(data.facing || "down"),
        avatar: data.avatar || null,
        lastSeenMs: Date.now(),
      });
      ws.serializeAttachment(player);

      const players = this.ctx.getWebSockets()
        .filter(s => s !== ws)
        .map(s => s.deserializeAttachment() as ClientState)
        .filter(p => p && p.name);

      ws.send(JSON.stringify({ type: "welcome", id: player.id, players }));
      this.broadcast({ type: "playerJoined", player }, ws);
      return;
    }

    if (data.type === "move") {
      player.x = Number(data.x) || player.x;
      player.y = Number(data.y) || player.y;
      player.facing = String(data.facing || player.facing || "down");
      player.avatar = data.avatar ?? player.avatar;
      player.lastSeenMs = Date.now();
      ws.serializeAttachment(player);
      this.broadcast({ type: "move", player }, ws);
      return;
    }

    if (data.type === "chat") {
      const text = String(data.text || "").trim().slice(0, 120);
      if (!text) return;
      this.broadcast({
        type: "chat",
        message: {
          id: crypto.randomUUID(),
          ownerUid: player.id,
          name: player.name || "학생",
          text,
          createdAtMs: Date.now(),
        }
      });
      return;
    }

    if (data.type === "reaction") {
      this.broadcast({
        type: "reaction",
        id: player.id,
        reaction: String(data.reaction || "").slice(0, 10),
        reactionAt: Date.now(),
      });
    }
  }

  webSocketClose(ws: WebSocket) {
    const player = ws.deserializeAttachment() as ClientState | null;
    if (player?.id) this.broadcast({ type: "playerLeft", id: player.id }, ws);
  }

  webSocketError(ws: WebSocket) {
    const player = ws.deserializeAttachment() as ClientState | null;
    if (player?.id) this.broadcast({ type: "playerLeft", id: player.id }, ws);
  }

  private broadcast(data: unknown, except?: WebSocket) {
    const text = JSON.stringify(data);
    for (const socket of this.ctx.getWebSockets()) {
      if (socket === except) continue;
      try { socket.send(text); } catch {}
    }
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/ws") {
      const room = url.searchParams.get("room") || "dokdo-main";
      return env.ROOM.getByName(room).fetch(request);
    }

    if (url.pathname === "/api/health") {
      return Response.json({ ok: true, app: "dokdo-ullim", backend: "cloudflare" });
    }

    return env.ASSETS.fetch(request);
  }
} satisfies ExportedHandler<Env>;
