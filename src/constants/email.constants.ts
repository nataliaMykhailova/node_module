import { EmailType } from "../enums/email-type.enum";

export const emailConstants = {
  [EmailType.WELCOME]: {
    subject: "Welcome!",
    template: "welcome",
  },
  [EmailType.FORGOT_PASSWORD]: {
    subject: "Forgot Password",
    template: "forgot-password",
  },
  [EmailType.LOGOUT]: {
    subject: "Logout",
    template: "logout",
  },
};
