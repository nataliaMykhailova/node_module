import mongoose from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { UserModel } from "./user.models";

const { Schema } = mongoose;

const tokenSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },

    _userId: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Token = mongoose.model<IToken>("tokens", tokenSchema);
