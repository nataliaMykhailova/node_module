import { CronJob } from "cron";

const handler = () => {
  console.log("Running cron job...");
};

export const testCron = new CronJob("1 * * * * *", handler);
