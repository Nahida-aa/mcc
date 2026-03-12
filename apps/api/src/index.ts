import { type WebSocketData } from "@socket.io/bun-engine";
import { engine } from "./ws/server";
import { app } from "./orpc/app";
import { env } from "./env";

const { websocket } = engine.handler();

const startServer = (port: number) => {
	try {
		const server = Bun.serve({
			port: port,
			idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
			fetch: (req: Request, server: Bun.Server<WebSocketData>) => {
				const pathname = req.url.startsWith('/')
					? req.url
					: new URL(req.url, 'http://localhost').pathname;  // 兜底基地址
				console.log(pathname)
				if (pathname === "/socket.io/" || pathname.startsWith("/socket.io/")) {
					console.debug("Handling WebSocket request");
					return engine.handleRequest(req, server);
				} else {
					console.debug("Handling RPC request");
					return app.fetch(req);
				}
			},
			websocket,
		});

		console.log(`✅ Server 运行在: http://localhost:${server.port}`);
		return server;
	} catch (e: any) {
		if (e.code === "EADDRINUSE") {
			console.log(`⚠️  端口 ${port} 已被占用，正在尝试 ${port + 1}...`);
			return startServer(port + 1); // 递归：尝试下一个端口
		} else {
			throw e; // 其他错误正常抛出
		}
	}
};

const server = startServer(4000);

if (process.send) {
	console.log('process.send')
	process.send('ready')
} else {
	console.log('not process.send')
}

// console.log(env);
console.log('bun:', Bun.env.NODE_ENV, Bun.version, env)
console.log(`Listening on ${server.url}`);