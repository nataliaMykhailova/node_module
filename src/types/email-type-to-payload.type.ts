import { EmailType } from "../enums/email-type.enum";
import { EmailPayloadCombinedType } from "./email-payload-combined.type";
import { PickRequired } from "./pick-required.type";

export type EmailTypeToPayloadType = {
  [EmailType.WELCOME]: PickRequired<
    EmailPayloadCombinedType,
    "name" | "actionToken"
  >;

  [EmailType.FORGOT_PASSWORD]: PickRequired<
    EmailPayloadCombinedType,
    "name" | "actionToken"
  >;

  [EmailType.LOGOUT]: PickRequired<EmailPayloadCombinedType, "name">;
  [EmailType.OLD_VISIT]: PickRequired<EmailPayloadCombinedType, "name">;
};
