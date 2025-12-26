import mongoose from "mongoose";

const templateSchema = new mongoose.Schema(
  {
    // Name shown in template bazaar
    title: {
      type: String,
      required: true
    },

    // Category grouping
    category: {
      type: String,
      required: true // Planning | Work | Personal
    },

    // Editor.js JSON (DESIGN)
    content: {
      type: Object,
      required: true
    },

    // Paid or free (later)
    isPaid: {
      type: Boolean,
      default: false
    },

    // null = example/system template
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    // Should users see it?
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Template", templateSchema);
