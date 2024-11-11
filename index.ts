import { toWebHandler, createApp, createRouter, defineEventHandler } from "h3";
import {
  createIPX,
  createIPXH3Handler,
  ipxFSStorage,
  ipxHttpStorage,
} from "ipx";

const app = createApp();
const router = createRouter();

app.use(router);

router.get(
  "/ping",
  defineEventHandler((event) => {
    return "pong";
  })
);

const domainList = process.env.HOSTNAME_LIST!;

const ipx = createIPX({
  storage: ipxFSStorage({ dir: "./public" }),
  httpStorage: ipxHttpStorage({ domains: [...domainList?.split(",")] }),
});

app.use("/", createIPXH3Handler(ipx));

const server = Bun.serve({
  port: 8000,
  fetch: toWebHandler(app),
});

console.log(`Listening on http://${server.hostname}:${server.port}`);
