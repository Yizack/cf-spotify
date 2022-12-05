import { Router } from "itty-router";
import SpotifyAPI from "./SpotifyAPI";

const router = Router();

class JsonResponse extends Response {
  constructor(body) {
    const jsonBody = JSON.stringify(body);
    const options = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "s-maxage=86400"
      }
    };
    super(jsonBody, options);
  }
}

router.get("/followers", async (req, API, cacheManager, ctx) => {
  const { cache, key } = cacheManager;
  const { id } = req.query;
  const { name, followers } = await API.getArtist(id);
  if (followers?.total) {
    const response = new JsonResponse({ name, id, followers: followers.total });
    console.log("Stored in cache!");
    ctx.waitUntil(cache.put(key, response.clone()));
    return response;
  }
  return new JsonResponse({});
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

export default {
  async fetch(req, env, ctx) {
    const cacheUrl = new URL(req.url);
    const cacheManager = {
      key: new Request(cacheUrl.toString(), req),
      cache: caches.default
    };

    const { cache, key } = cacheManager;

    let response = await cache.match(key);
    if (response) {
      console.log("Found in cache!");
      return response;
    }

    const API = new SpotifyAPI(env.CLIENT_ID, env.CLIENT_SECRET);
    await API.generateToken();
    return router.handle(req, API, cacheManager, ctx);
  }
};
