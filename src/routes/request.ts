import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import { Router } from "express";
import { PRISMA_ERRORS } from "../errors";
import { unbigify } from "../util";

export default function (prisma: PrismaClient) {
  const router = Router();

  // Create a link request for a user
  router.post("/", async (req, res) => {
    const { user_id, token: _token, expires } = req.body;

    const token = _token || randomBytes(64).toString("hex");

    try {
      // Filter duplicate requests
      if (
        await prisma.request.findFirst({
          where: { OR: [{ user_id }, { token }] },
        })
      )
        return res.status(400).json({ error: "Request already exists" });

      // Create the request
      const request = await prisma.request.create({
        data: { user_id, token, expires },
      });

      res.status(201).json(request);
    } catch {
      res.status(400).json({ error: "Bad Request" });
    }
  });

  // Delete a request by user id
  router.delete("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
      const deleted = await prisma.request.delete({ where: { user_id } });

      res.status(200).json(unbigify(deleted));
    } catch (ex: any) {
      console.error(ex);

      if (ex.code === PRISMA_ERRORS.ERROR_NOT_FOUND)
        res.status(404).json({ error: "Request not found" });
      else res.status(400).json({ error: "Bad Request" });
    }
  });

  return router;
}
