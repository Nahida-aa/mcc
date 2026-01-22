import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { instrument } from "@socket.io/admin-ui"
import { Server as Engine, type WebSocketData } from "@socket.io/bun-engine";

// import { redis } from "bun"; // bun 内置 redis api 缺少 xadd 等命令
import { Redis } from "ioredis";
const redis = new Redis();

import app from "./app";
const io = new Server({
  adapter: createAdapter(redis),
  cors: {
  origin: ["https://admin.socket.io"],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true
},
  pingTimeout: 15000, // 15s 心跳，防 zombie
  allowEIO3: true, // 兼容旧客户端，减 polling 开销
});
const engine = new Engine();

io.bind(engine);

io.on("connection", (socket) => {
  // ...
});
const adminPassword = process.env.SOCKET_IO_ADMIN_PASSWORD
if (!adminPassword) throw new Error('Missing SOCKET_IO_ADMIN_PASSWORD')
instrument(io, {
  auth: {
    type: "basic",
    username: "admin",
    password: await Bun.password.hash(adminPassword, {
      algorithm: 'bcrypt',
      cost: 10, // salt rounds，1-31（默认 10）
    }), // https://socket.io/docs/v4/admin-ui/#available-options
  }, // https://admin.socket.io/
  mode: "development",
})

const { websocket } = engine.handler();

// bun 标准
export default {
  port: 8080,
  idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
  fetch: (req: Request, server: Bun.Server<WebSocketData>) => {
    const url = new URL(req.url);
    if (url.pathname === "/socket.io/") {
      console.debug("Handling WebSocket request");
      return engine.handleRequest(req, server);
    } else {
      return app.fetch(req, server);
    }
  },
  websocket
}

