import { InferSchemaType, Schema, model } from "mongoose";

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    detailed: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_published: {
      type: Boolean,
      required: true,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: new Date().toISOString(),
    },
  },
  { timestamps: true }
);

type Article = InferSchemaType<typeof articleSchema>;

export const article = model<Article>("Article", articleSchema);
