import { EmailType } from "../enums/email-type.enum";
import { EmailPayloadCombinedType } from "./email-payload-combined.type";
import { PickRequired } from "./pick-required.type";

export type EmailTypeToPayloadType = {
  [EmailType.WELCOME]: PickRequired<
    EmailPayloadCombinedType,
    "name" | "actionToken" | "frontUrl"
  >;

  [EmailType.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombinedType,
    "name" | "actionToken" | "frontUrl"
  >;

  [EmailType.OLD_VISIT]: PickRequired<
    EmailPayloadCombinedType,
    "name" | "frontUrl"
  >;

  [EmailType.LOGOUT]: PickRequired<
    EmailPayloadCombinedType,
    "name" | "frontUrl"
  >;
};
