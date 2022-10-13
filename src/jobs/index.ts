import { PrismaClient } from "@prisma/client";
import { CronJob } from "cron";
import { CleanJob } from "./clean";

export interface Job {
  running: boolean;
  run(): any;
}

/**
 * Create a new cron jobs which can handle multiple jobs under a single cron time
 *
 * @param cronTime The cron time to run the job at
 * @param jobs The jobs to run
 * @returns A {@link CronJob} instance
 */
function create(cronTime: string | Date, ...jobs: Job[]) {
  return new CronJob(cronTime, () => {
    jobs.forEach((job) => {
      job.running = true;

      const res = job.run();

      if (res instanceof Promise) res.then(() => (job.running = false));
      else job.running = false;
    });
  });
}

/**
 * Initialize the cron jobs
 *
 * @param prisma The prisma client to use
 */
export function initialize(prisma: PrismaClient) {
  const clean = new CleanJob(prisma);

  const daily = create("0 0 0 * * *", clean);

  daily.start();
}
