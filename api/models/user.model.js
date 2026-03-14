import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    image: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(
          this.name,
        )}&background=random&color=ffffff&bold=true&size=128`;
      },
    },
    role: {
      type: String,
      enum: ["superadmin", "admin"],
      default: "admin",
    },
    suspended: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// pre-save hook for hashing the password before user / admin save to DB

userSchema.pre("save", async function (next) {
  // ✅ Change to regular function
  if (!this.isModified("password")) return next(); // `this` will now refer to the document
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// check if the user has a password that has already been in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
