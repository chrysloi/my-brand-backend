import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    article: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    is_deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_anonymous: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

type User = InferSchemaType<typeof userSchema>;

export const user = model<User>("User", userSchema);
