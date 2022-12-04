class SpotifyAPI {

  constructor(client_id, client_secret) {

    this.api = "https://api.spotify.com/v1";
    this.api_token = "https://accounts.spotify.com/api/token";

    this.access_token = null;
    this.client_id = client_id;
    this.client_secret = client_secret;
    
  }

  async generateToken() {
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

  getAccessToken() {
    return this.access_token;
  }

  async getArtist(id) {
    const response = await fetch(`${this.api}/artists/${id}`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.access_token}`
      }
    });
    return response.json();
  }

}

export default SpotifyAPI;
