import { Router } from "express";
import axios from "axios";
import {
  getClient,
  RESTPostOAuth2AccessTokenResult,
  Routes,
} from "../lib/discord";
import { DiscordAPIError } from "@discordjs/rest";

export default function () {
  const router = Router();

  // Get Discord application information
  router.get("/appinfo", (req, res) => {
    res.json({
      client_id: process.env.DISCORD_CLIENT_ID,
    });
  });

  // Get Discord access token from OAuth code
  router.post("/token/acquire", async (req, res) => {
    const { code, redirect_uri } = req.body;
    const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } = process.env;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("client_id", DISCORD_CLIENT_ID!);
    params.append("client_secret", DISCORD_CLIENT_SECRET!);

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

      res.json(response);
    } catch (e) {
      const error = e as DiscordAPIError;

      res.status(error.status).json({ success: false, error: error.code });
    }
  });

  // Get the avatar url for a given user id
  router.get("/avatar/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const response = await axios.get(
        `https://discord.com/api/v9/users/${id}`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
          },
        }
      );

      const { avatar, discriminator } = response.data;

      // Check if the user has a custom avatar
      if (!avatar)
        return res.json({
          avatar: `https://cdn.discordapp.com/embed/avatars/${
            Number(discriminator) % 5
          }.png`,
        });

      res.json({
        avatar: `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`,
      });
    } catch {
      res.status(404).json({ error: "User not found" });
    }
  });

  return router;
}
