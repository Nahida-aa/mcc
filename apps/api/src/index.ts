import { type WebSocketData } from "@socket.io/bun-engine";
import { engine } from "./ws/server";
import { app } from "./orpc/app";
import { env } from "./env";

const { websocket } = engine.handler();

const server = Bun.serve({
	port: 4000,
	idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds
	fetch: (req: Request, server: Bun.Server<WebSocketData>) => {
		const url = new URL(req.url);
		if (url.pathname === "/socket.io/") {
			console.debug("Handling WebSocket request");
			return engine.handleRequest(req, server);
		} else {
			return app.fetch(req);
		}
	},
	websocket,
})
if (process.send) {
	console.log('process.send')
	process.send('ready')
} else {
	console.log('not process.send')
}

console.log(env);
console.log('bun:', Bun.env.NODE_ENV, Bun.version)
console.log(`Listening on ${server.url}`);