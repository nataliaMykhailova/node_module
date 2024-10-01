import { CronJob } from "cron";

import { configs } from "../configs/configs";
import { timeHelper } from "../helpers/time-helper";
import { tokenRepository } from "../repositories/token.repository";

const hendler = async () => {
  try {
    const [value, unit] = timeHelper.parseString(
      configs.JWT_REFRESH_EXPIRES_IN,
    );
    await tokenRepository.deleteByParams({
      createdAt: { $lte: timeHelper.subtractByParams(value, unit) },
    });
    console.log("removeOldTokensCron finished successfully.");
  } catch (err) {
    console.error("removeOldTokensCron failed", err);
  }
};
export const removeOldTokensCron = new CronJob("0 * * * * *", hendler);
