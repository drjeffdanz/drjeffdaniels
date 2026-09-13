import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";
function handler() {
  if (process.env.NODE_ENV === "production" &&
    (!process.env.KEYSTATIC_GITHUB_CLIENT_ID || !process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || !process.env.KEYSTATIC_SECRET)) return null;
  return makeRouteHandler({ config });
}
export async function GET(request: Request) {
  const routes = handler();
  return routes ? routes.GET(request) : Response.json({ error: "Publishing is not configured yet." }, { status: 503 });
}
export async function POST(request: Request) {
  const routes = handler();
  return routes ? routes.POST(request) : Response.json({ error: "Publishing is not configured yet." }, { status: 503 });
}
