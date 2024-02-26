import { InferSchemaType, Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

type Message = InferSchemaType<typeof MessageSchema>;

export const MessageModel = model<Message>("Message", MessageSchema);
