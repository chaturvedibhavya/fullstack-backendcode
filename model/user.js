const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User schema
 * - password is stored HASHED, never in plain text.
 * - `select: false` means the password field is NOT returned by default
 *   in queries (so you never accidentally send it to the client).
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can share an email
      lowercase: true, // store emails in lowercase for consistency
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // hide password from normal query results
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

/**
 * Mongoose "pre-save" hook.
 * Runs automatically BEFORE a user document is saved.
 * We hash the password here so plain-text passwords never touch the database.
 * The `if (!this.isModified("password"))` check ensures we only re-hash
 * when the password actually changed (e.g. not on every profile update).
 */
// Hash the password before saving.
// This is an async function, so Mongoose just waits for it to finish —
// we don't need (or want) a `next` callback here.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // skip if password didn't change
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method available on every user document.
 * Compares a plain-text password (from a login attempt) against the
 * stored hash. Returns true if they match.
 * Usage: const isMatch = await user.matchPassword("mypassword");
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Third argument "users" forces the collection name to be exactly "users".
module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema, "users");
