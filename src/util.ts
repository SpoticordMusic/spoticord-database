import axios from "axios";
import {
  getClient,
  Routes,
  RESTPostOAuth2AccessTokenResult,
} from "./lib/discord";

export const spotify = {
  /**
   * Refresh a Spotify token
   *
   * @param refresh_token The refresh token to use
   * @returns The new access token and expiry
   */
  async refresh_token(refresh_token: string) {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);

    try {
      const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        params,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
              "utf8"
            ).toString("base64")}`,
          },
        }
      );

      const { access_token, expires_in } = response.data;

      return { access_token, expires: Date.now() + expires_in * 1000 };
    } catch {
      return false;
    }
  },
};

export const discord = {
  /**
   * Refresh a Discord token
   *
   * @param refresh_token The refresh token to use
   * @returns The new access token and expiry
   */
  async refresh_token(refresh_token: string) {
    const params = new URLSearchParams();

    params.append("client_id", process.env.DISCORD_CLIENT_ID!);
    params.append("client_secret", process.env.DISCORD_CLIENT_SECRET!);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);

    const client = getClient();

    try {
      const response = (await client.post(Routes.oauth2TokenExchange(), {
        body: params,
        auth: false,
        passThroughBody: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })) as RESTPostOAuth2AccessTokenResult;

      const { access_token, expires_in } = response;

      return { access_token, expires: Date.now() + expires_in * 1000 };
    } catch {
      return false;
    }
  },
};
