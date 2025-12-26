import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    // 🔑 ROLE (user | seller)
    role: {
      type: String,
      enum: ["user", "seller"],
      default: "user"
    },

    // 🔐 Reset password
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

/* 🔐 HASH PASSWORD */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* 🔐 COMPARE PASSWORD */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
