import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import { CleanJob } from "./clean";

export interface Job {
  running: boolean;
  run(): Promise<void>;
}

export function initialize(prisma: PrismaClient) {
  const job = new CleanJob(prisma);
  const cron = new CronJob("0 0 0 * * *", () => job.run());

  cron.start();
}
