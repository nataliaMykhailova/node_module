import { CronJob } from "cron";

import { EmailType } from "../enums/email-type.enum";
import { timeHelper } from "../helpers/time-helper";
import { userRepository } from "../repositories/user.repository";
import { emailService } from "../services/email.service";

const handler = async () => {
  try {
    console.log("[oldVisitorCron] Cron is running");
    const date = timeHelper.subtractByParams(7, "day");
    const users = await userRepository.findWithOutActivityAfter(date);

    await Promise.all(
      users.map(async (user) => {
        console.log(user.email);
        await emailService.sendEmail(EmailType.OLD_VISIT, user.email, {
          name: user.username,
        });
      }),
    );
    console.log("[oldVisitorCron] Cron finished");
  } catch (error) {
    console.error("[oldVisitorCron] Cron failed", error);
  }
};

export const oldVisitorCron = new CronJob("0 * * * * *", handler);
