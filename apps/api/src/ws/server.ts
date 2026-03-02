import { DefaultEventsMap, Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-streams-adapter";
import { instrument } from "@socket.io/admin-ui";
import { Server as Engine } from "@socket.io/bun-engine";
// import { redis } from "bun"; // bun 内置 redis api 缺少 xadd 等命令
import { Redis } from "ioredis";
import { cookieToKV } from "../auth/utils";
import { decrypt } from "../auth/jwt";
import { SocketData } from "./types";
import { env } from "../env";
const redis = new Redis(env.REDIS_URL)

export const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>({
	adapter: createAdapter(redis),
	// addTrailingSlash: false, // 是否添加尾部斜线, default: true
	// path: "/api/ws",
	cors: {
		origin: [
			"https://联合创作平台.cn",
			"https://xn--2qqt0eizbxcx84dyq3c.cn",
			"https://api.xn--2qqt0eizbxcx84dyq3c.cn",
			"https://admin.socket.io",
			"http://localhost:4000",
			"http://localhost:3000",
			"http://localhost:3001",
			"http://localhost:3002",
		],
		// methods: ["GET", "POST", "OPTIONS"],
		credentials: true,
	},
	// maxHttpBufferSize: 1e6, // 1MB 限请求体
	// pingTimeout: 15000, // 15s 心跳，防 zombie
	allowEIO3: true, // 兼容旧客户端，减 polling 开销
});
export const engine = new Engine();

io.bind(engine);
io.use(async (socket, next) => {

	const userId = await (async () => {
		const token: string | undefined = socket.handshake.auth.token
		if (token) {
			const payload = await decrypt(token)
			return payload?.userId as string | undefined
		}

		const cookie = socket.request.headers.cookie;
		const jwt = cookieToKV(cookie)['mcc.session_data']
		const payload = (await decrypt(jwt)) as { user: { id: string } } | undefined
		return payload?.user?.id
	})()

	socket.data.userId = userId
	// console.log({
	// 	// handshakeQuery: socket.handshake.query,
	// 	// handshakeHeaders: socket.handshake.headers,
	// 	userId
	// })
	return next();
})
// status values mirror ws/readme.md
export type OnlineStatus = 'online' | 'idle' | 'dnd' | 'invisible' | 'offline';

/**
 * write status to redis and optionally broadcast to interested parties
 */
async function setStatus(
	userId: string,
	status: OnlineStatus,
	broadcast = true
) {
	await redis.hset(`user:status:${userId}`, "status", status, "ts", Date.now());
	if (!broadcast) return;

	if (status === "invisible") {
		// 向自己发送真实状态
		io.to(`user:${userId}`).emit("user_status", { userId, status: "invisible", self: true });
		// 向别人发送假状态（离线）
		io.to(`presence:${userId}`).emit("user_status", { userId, status: "offline", self: false });
	} else {
		// 向自己发送真实状态
		io.to(`user:${userId}`).emit("user_status", { userId, status, self: true });
		// 向别人发送真实状态
		io.to(`presence:${userId}`).emit("user_status", { userId, status, self: false });
	}
}

/**
 * fetch single or batch statuses from redis
 */
async function getStatus(userId: string): Promise<OnlineStatus | null> {
	const v = await redis.hget(`user:status:${userId}`, "status");
	return (v as OnlineStatus) || null;
}

type OnlineStatuses = {
	[userId: string]: OnlineStatus;
}
async function getStatuses(userIds: string[]) {
	if (userIds.length === 0) return {};
	const pipeline = redis.pipeline();
	for (const id of userIds) pipeline.hget(`user:status:${id}`, "status");
	const results = await pipeline.exec();
	if (!results) return {};
	return userIds.reduce<OnlineStatuses>((acc, id, i) => {
		const res = results[i][1] as OnlineStatus | null;
		if (res) acc[id] = res === "invisible" ? "offline" : res;
		return acc;
	}, {});
}

io.on("connection", async (socket) => {
	const userId = socket.data.userId;


	// 客户端负责发送实时状态更新，如 idle 计时通过 React 挂载 hook 完成
	// 服务端只接收 status:set 事件并写入 redis
	socket.on("join", async (roomPrefix: string, ids: string[], cb?: (res: boolean | OnlineStatuses) => void) => {
		// 可选：权限验证（比如用户是否在该社群）
		// const hasAccess = await validateRoomAccess(userId, roomPrefix, ids);
		// if (!hasAccess) {
		//   cb?.(false);
		//   return;
		// }

		for (const id of ids) {
			socket.join(`${roomPrefix}:${id}`);
		}

		// 如果是 presence 前缀，立即返回这些用户的状态
		if (roomPrefix === "presence") {
			const statuses = await getStatuses(ids);
			// socket.emit("users_status", statuses);
			cb?.(statuses);
			return
		}

		cb?.(true);
	});

	if (!userId) {
		console.log("anonymous connection", socket.id);
		// anonymous connection; no presence state will be recorded
		// still useful for read-only channels like comments
		// e.g. socket.join(`comments:${postId}`) elsewhere
		socket.on("disconnect", () => {
			console.log("anonymous disconnect", socket.id)
		});
		return
	}
	console.log(userId, "connection", socket.id);
	// increment connection count so multiple tabs/clients are handled
	redis.incr(`user:sockets:${userId}`);
	socket.join(`user:${userId}`); // room for all sockets of this user

	// initialize status: use client's stored status if valid, otherwise 'online'
	const storedStatus = socket.handshake.auth?.status as OnlineStatus | undefined;
	const initialStatus = (storedStatus && storedStatus !== 'offline') ? storedStatus : 'online';
	setStatus(userId, initialStatus, true);

	socket.on("setStatus", (status: OnlineStatus) => {
		// 客户端可能会在各种场景发送状态（idle、dnd 等），服务端只负责写入并广播
		if (status === "invisible") {
			redis.hset(`user:status:${userId}`, "status", "invisible", "ts", Date.now());
			setStatus(userId, "invisible"); // send to self/others appropriately
			return;
		}
		setStatus(userId, status);
	});

	// batch query
	socket.on("getStatuses", async (ids: string[], cb: (res: OnlineStatuses) => void) => {
		const res = await getStatuses(ids);
		cb(res);
	});



	socket.on("leave", (roomPrefix: string, ids: string[], cb?: (success: boolean) => void) => {
		for (const id of ids) {
			socket.leave(`${roomPrefix}:${id}`);
		}
		cb?.(true);
	});
	socket.on("disconnect", async () => {
		console.log(userId, "disconnect", socket.id)
		const rem = await redis.decr(`user:sockets:${userId}`);
		if (rem <= 0) {
			setStatus(userId, "offline");
		}
	});
});

instrument(io, {
	// https://admin.socket.io/
	// auth: {
	// 	type: "basic",
	// 	username: "admin",
	// 	password: bcryptjs.hashSync(adminPassword, 10),
	// },
	auth: false,
	mode: "development",
}); // https://socket.io/docs/v4/admin-ui/#available-options