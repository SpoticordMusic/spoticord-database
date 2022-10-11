import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Router } from "express";

export default function (prisma: PrismaClient) {
  const router = Router();

  // Get Spotify application information
  router.get("/appinfo", (req, res) => {
    res.json({
      client_id: process.env.SPOTIFY_CLIENT_ID,
    });
  });

  // Get Spotify access token from OAuth code
  router.post("/token/acquire", async (req, res) => {
    const { code, redirect_uri } = req.body;
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
            "utf-8"
          ).toString("base64")}`,
        },
        validateStatus: () => true,
      }
    );

    if (response.status !== 200) {
      return res.status(response.status).json(response.data);
    }

    const { access_token, refresh_token, expires_in } = response.data;

    res.json({ access_token, refresh_token, expires_in });
  });

  // Refresh Spotify access token
  router.post("/token/refresh", async (req, res) => {
    const { refresh_token } = req.body;
    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refresh_token);

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
            "utf-8"
          ).toString("base64")}`,
        },
        validateStatus: () => true,
      }
    );

    if (response.status !== 200) {
      return res.status(response.status).json(response.data);
    }

    const { access_token, expires_in } = response.data;

    res.json({ access_token, expires_in });
  });

  return router;
}
