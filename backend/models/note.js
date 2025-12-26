import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    content: {
      type: Object ,
      required: true,
      trim: true
    }

    ,

    bannerImage: {
  url: String,
  public_id: String
}
,

      images: [
      {
        url: {
          type: String,
          required: true
        },
        public_id: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
