import { PrismaClient } from "@prisma/client";
import { Job } from ".";

export class CleanJob implements Job {
  public running: boolean = false;

  constructor(private readonly prisma: PrismaClient) {}

  async run() {
    // Clean expired requests
    await this.prisma.request.deleteMany({
      where: { expires: { lt: Date.now() } },
    });
  }
}
