import { NextFunction, Request, Response } from "express";
import { ObjectSchema, Schema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";

class CommonMiddleware {
  public isValidId(paramName: string) {
    return (request: Request, response: Response, next: NextFunction) => {
      try {
        const id = request.params[paramName];
        if (!isObjectIdOrHexString(id)) {
          throw new ApiError("Invalid ID", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
  public isValidCreateDto(validator: ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error } = validator.validate(req.body);
      if (error) {
        throw new ApiError(
          error.details.map((el) => el.message).join(","),
          400,
        );
      } else {
        next();
      }
    };
  }
  public isValidUpdateDto(schema: Schema, allowedFields: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const updateFields = Object.keys(req.body);
        const unknownFields = updateFields.filter(
          (field) => !allowedFields.includes(field),
        );
        if (unknownFields.length > 0) {
          throw new ApiError(
            `Cannot update fields: ${unknownFields.join(", ")}. These fields are not allowed to be updated.`,
            400,
          );
        }
        const { error } = schema.validate(req.body);
        if (error) {
          throw new ApiError(
            error.details.map((detail) => detail.message).join(", "),
            400,
          );
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
