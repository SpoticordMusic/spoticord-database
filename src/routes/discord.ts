import { Router } from "express";
import axios from "axios";

export default function () {
  const router = Router();

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
