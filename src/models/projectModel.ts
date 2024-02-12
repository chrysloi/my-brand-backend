import { InferSchemaType, Schema, model } from "mongoose";

const projectSchema = new Schema(
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
    owner: {
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

type Project = InferSchemaType<typeof projectSchema>;

export const project = model<Project>("Project", projectSchema);
