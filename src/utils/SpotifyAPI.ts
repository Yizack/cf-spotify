export class SpotifyAPI {
  api: string;
  api_token: string;
  access_token: string;
  client_id: string;
  client_secret: string;
  constructor (client_id: string, client_secret: string) {

    this.api = "https://api.spotify.com/v1";
    this.api_token = "https://accounts.spotify.com/api/token";

    this.access_token = null;
    this.client_id = client_id;
    this.client_secret = client_secret;
  }

  async generateToken () {
    const response = await fetch(this.api_token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + (btoa(this.client_id + ":" + this.client_secret).toString())
      },
      body: "grant_type=client_credentials"
    });

    const { access_token } = await response.json();
    this.access_token = access_token;
  }

  getAccessToken () {
    return this.access_token;
  }

  async getArtist (id: string) {
    const response = await $fetch(`${this.api}/artists/${id}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.access_token}`
      }
    }).catch(() => null);
    return response;
  }

}
