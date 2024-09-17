import Joi from "joi";

import { regexConstant } from "../constants/regex.constants";
import { RoleEnum } from "../enums/role.enum";

export class UserValidator {
  private static username = Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .trim()
    .required()
    .messages({
      "string.base": "Username must be a string",
      "string.alphanum": "Username must only contain letters and numbers",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be less than or equal to 30 characters",
      "any.required": "Username is required",
    });

  private static age = Joi.number()
    .integer()
    .min(0)
    .max(120)
    .required()
    .messages({
      "number.base": "Age must be a number",
      "number.integer": "Age must be an integer",
      "number.min": "Age must be at least 0",
      "number.max": "Age must be less than or equal to 120",
      "any.required": "Age is required",
    });

  private static email = Joi.string()
    .email()
    .min(5)
    .max(50)
    .required()
    .lowercase()
    .trim()
    .regex(regexConstant.EMAIL)
    .messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "string.pattern.base": "Email must contain @ and follow a valid format",
      "any.required": "Email is required",
    });

  private static password = Joi.string()
    .min(8)
    .max(50)
    .required()
    .trim()
    .regex(regexConstant.PASSWORD)
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must be less than or equal to 50 characters",
      "string.pattern.base":
        "Password must contain at least one letter and one digit",
      "any.required": "Password is required",
    });

  private static phone = Joi.string()
    .optional()
    .trim()
    .regex(regexConstant.PHONE)
    .messages({
      "string.base": "Phone must be a string",
      "string.pattern.base": "Phone must only contain numbers",
    });

  private static role = Joi.string()
    .valid(...Object.values(RoleEnum))
    .optional()
    .messages({
      "string.base": "Role must be a string",
      "string.valid": "Role must be one of the valid roles",
    });

  public static createUser = Joi.object({
    username: UserValidator.username.required(),
    age: UserValidator.age.required(),
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
    phone: UserValidator.phone.required(),
    role: UserValidator.role.required(),
  });

  public static updateUser = Joi.object({
    username: UserValidator.username,
    age: UserValidator.age,
    email: UserValidator.email,
    phone: UserValidator.phone,
  });
}
