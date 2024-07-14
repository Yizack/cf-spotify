export default defineCachedEventHandler(async (event) => {
  const { id } = await getValidatedQuery(event, z.object({
    id: z.string()
  }).parse);

  const { spotify } = useRuntimeConfig(event);
  const API = new SpotifyAPI(spotify.clientId, spotify.clientSecret);
  await API.generateToken();

  const artist = await API.getArtist(id);

  setResponseHeader(event, "Access-Control-Allow-Origin", "*");

  return { name: artist.name, id: artist.id, followers: artist.followers.total };
}, { maxAge: 86400 });
