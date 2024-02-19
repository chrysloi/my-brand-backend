import { InferSchemaType, Schema, model } from "mongoose";

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    is_hide: {
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

type Comment = InferSchemaType<typeof CommentSchema>;

export const CommentModel = model<Comment>("Comment", CommentSchema);
