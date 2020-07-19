import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use(async (ctx, next) => {
	await next();

	const rt = ctx.response.headers.get("X-Response-Time");
	console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

const router = new Router();

const tokens = new Map();

router.post('/api/push-location', async context => {
	const { value: { coords, clientId, token } } = await context.request.body();

	if(!tokens.has(token)) {
		tokens.set(token, new Map());
	}

	tokens.get(token).set(clientId, coords);

	console.log(tokens);

	context.response.body = JSON.stringify([ ... tokens.get(token).values() ]);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async context => {
	await send(context, context.request.url.pathname, {
		root: `${Deno.cwd()}/static`,
		index: "index.html"
	});
});

app.listen({ port: 8000 });
