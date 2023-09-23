import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },

    image: { type: String },

    message: { type: String },
  },

  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
