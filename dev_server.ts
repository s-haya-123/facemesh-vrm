import { dirname, join } from "https://deno.land/std/path/mod.ts";
import { opine, serveStatic } from "https://deno.land/x/opine@0.4.0/mod.ts";
import {
  Request,
  Response,
  NextFunction,
} from "https://deno.land/x/opine@0.4.0/src/types.ts";
const __dirname = dirname(import.meta.url);

// const s = serve({ port: 8080 });
const app = opine();
app.use("/static", serveStatic(join(__dirname, "static")));
const browserBundlePath = "/static/index.js";
const html =
  `<html><head><script type="module" src="${browserBundlePath}"></script><style>* { font-family: Helvetica; }</style></head><body></body></html>`;
app.use("/", (req: Request, res: Response, next: NextFunction) => {
  res.type("text/html").send(html);
});

  
console.log("http://localhost:3000/");
app.listen({ port: 3000 });