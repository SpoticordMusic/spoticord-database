/**
 * Rather simple database API for Spoticord
 */

import express from "express";
import { PrismaClient } from "@prisma/client";
import assert from "assert";
import morgan from "morgan";
import user from "./routes/user";
import discord from "./routes/discord";
import request from "./routes/request";
import account from "./routes/account";
import spotify from "./routes/spotify";
import { initialize } from "./jobs";

assert(process.env.SPOTIFY_CLIENT_ID, "SPOTIFY_CLIENT_ID is not set");
assert(process.env.SPOTIFY_CLIENT_SECRET, "SPOTIFY_CLIENT_SECRET is not set");

const port = parseInt(process.env.PORT as string) || 3000;

const prisma = new PrismaClient();
const app = express();

app.use(morgan("common"));
app.use(express.json());

app.use("/user", user(prisma));
app.use("/request", request(prisma));
app.use("/account", account(prisma));
app.use("/spotify", spotify(prisma));
process.env.DISCORD_TOKEN && app.use("/discord", discord()); // Add some discord QoL routes if the token is set

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);

  // Initialize cron jobs
  initialize(prisma);
});
