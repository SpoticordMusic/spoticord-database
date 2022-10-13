import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { PRISMA_ERRORS } from "../errors";
import { unbigify } from "../util";

export default function (prisma: PrismaClient) {
  const router = Router();

  // Create a new account for a certain user
  router.post("/", async (req, res) => {
    const { user_id, type, access_token, refresh_token, expires } = req.body;

    try {
      // Filter duplicate accounts
      if (await prisma.account.findFirst({ where: { user_id, type } }))
        return res.status(400).json({ error: "Account already exists" });

      const account = await prisma.account.create({
        data: { user_id, type, access_token, refresh_token, expires },
      });

      res.status(201).json(unbigify(account));
    } catch (ex) {
      res.status(400).json({ error: "Bad Request" });
    }
  });

  // Get all accounts for a certain user
  router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
      const accounts = await prisma.account.findMany({
        where: { user_id },
      });

      res.json(accounts.map(unbigify));
    } catch (ex) {}
  });

  // Get a certain account for a certain user
  router.get("/:user_id/:type", async (req, res) => {
    const { user_id, type } = req.params;

    try {
      const account = await prisma.account.findFirst({
        where: { user_id, type },
      });

      if (!account) return res.status(404).json({ error: "Account not found" });

      res.json(unbigify(account));
    } catch (ex) {}
  });

  // Delete account by user id and type
  router.delete("/:user_id/:type", async (req, res) => {
    const { user_id, type } = req.params;

    try {
      const deleted = await prisma.account.delete({
        where: { user_id_type: { user_id, type } },
      });

      res.status(200).json(deleted);
    } catch (ex: any) {
      if (ex.code === PRISMA_ERRORS.ERROR_NOT_FOUND)
        res.status(404).json({ error: "Account not found" });
      else res.status(400).json({ error: "Bad Request" });
    }
  });

  return router;
}
