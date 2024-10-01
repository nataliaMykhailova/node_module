import mongoose from "mongoose";

import { IOldPassword } from "../interfaces/old-password.interface";
import { UserModel } from "./user.models";

const { Schema } = mongoose;

const oldPasswordSchema = new Schema(
  {
    password: { type: String, required: true },
    _userId: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const OldPassword = mongoose.model<IOldPassword>(
  "old-passwords",
  oldPasswordSchema,
);
