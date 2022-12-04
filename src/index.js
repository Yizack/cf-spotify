import { Router } from "itty-router";
import SpotifyAPI from "./SpotifyAPI";

const router = Router();

class JsonResponse extends Response {
  constructor(body, init) {
    const jsonBody = JSON.stringify(body);
    init = init || {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    super(jsonBody, init);
  }
}

router.get("/followers", async (req, API) => {
  const { id } = req.query;
  const { name, followers } = await API.getArtist(id);
  return new JsonResponse({ name, id, followers: followers.total });
});

export default {
  async fetch(request, env) {
    const API = new SpotifyAPI(env.CLIENT_ID, env.CLIENT_SECRET);
    await API.generateToken();
    return router.handle(request, API);
  },
};
