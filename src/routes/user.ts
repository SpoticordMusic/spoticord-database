import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import * as util from "../util";

export default function (prisma: PrismaClient) {
  const router = Router();

  // Get a user by their Discord id
  router.get("/:id", async (req, res) => {
    const { id } = req.params;

    const result = await prisma.user.findFirst({
      where: { id },
      include: { request: true, accounts: true },
    });

    if (!result) return res.status(404).json({ error: "User not found" });

    res.json(result);
  });

  // Get the user's Spotify access token
  // This will automatically refresh the token if it's expired
  router.get("/:id/spotify/access_token", async (req, res) => {
    const { id } = req.params;

    const result = await prisma.account.findFirst({
      where: { user_id: id, type: "spotify" },
    });

    if (!result)
      return res
        .status(404)
        .json({ error: `No Spotify account found for user: ${id}` });

    // If the token has expired, attempt to refresh it
    if (!result.expires || Date.now() > result.expires - 60000) {
      const refresh_result = await util.spotify.refresh_token(
        result.refresh_token
      );

      if (!refresh_result) {
        return res.status(400).json({ error: "User token has expired" });
      }

      // Put new access token and expiry in the database
      await prisma.account.update({
        where: { user_id_type: { user_id: id, type: "spotify" } },
        data: refresh_result,
      });

      return res.json({ id, access_token: refresh_result.access_token });
    }

    return res.json({ id, access_token: result.access_token });
  });

  // Get the user's Discord access token
  // This will automatically refresh the token if it's expired
  router.get("/:id/discord/access_token", async (req, res) => {
    const { id } = req.params;

    const result = await prisma.account.findFirst({
      where: { user_id: id, type: "discord" },
    });

    if (!result)
      return res
        .status(404)
        .json({ error: `No Discord account found for user: ${id}` });

    // If the token has expired, attempt to refresh it
    if (!result.expires || Date.now() > result.expires - 60000) {
      const refresh_result = await util.discord.refresh_token(
        result.refresh_token
      );

      if (!refresh_result) {
        return res.status(400).json({ error: "User token has expired" });
      }

      // Put new access token and expiry in the database
      await prisma.account.update({
        where: { user_id_type: { user_id: id, type: "discord" } },
        data: refresh_result,
      });

      return res.json({ id, access_token: refresh_result.access_token });
    }

    return res.json({ id, access_token: result.access_token });
  });

  // Find user by request token
  router.get("/by-request/:token", async (req, res) => {
    const { token } = req.params;

    const result = await prisma.user.findFirst({
      where: { request: { token } },
      include: { accounts: true, request: true },
    });

    if (!result) return res.status(404).json({ error: "Not Found" });

    res.json(result);
  });

  // Create a new user
  router.post("/new", async (req, res) => {
    const { id } = req.body;

    try {
      const user = await prisma.user.create({ data: { id } });

      res.status(201).json(user);
    } catch (ex) {
      res.status(400).json({ error: "User already exists" });
    }
  });

  // Add Spotify credentials linked to user
  router.post("/:id/spotify", async (req, res) => {
    return res.status(400).json({ error: "Not implemented" });

    const { id } = req.params;
    const { access_token, refresh_token } = req.body;

    try {
      // Check for duplicate Spotify account
      if (
        await prisma.account.findFirst({
          where: { user_id: id, type: "spotify" },
        })
      ) {
        return res
          .status(400)
          .json({ error: "User already has a spotify account" });
      }

      const result = await prisma.account.create({
        data: {
          user_id: id,
          type: "spotify",
          access_token,
          refresh_token,
          expires: 0,
        },
      });

      res.status(201).json(result);
    } catch {
      res.status(400).json({ error: "Bad request" });
    }
  });

  return router;
}
