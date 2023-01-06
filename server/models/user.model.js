const argon = require("argon2");
const crypto = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    unique: true, //TODO: "Email address already exist!" message
  },
  picture: {
    type: String,
    default:
      "http://images.fineartamerica.com/images-medium-large/alien-face-.jpg",
  },
  role: {
    type: String,
    enum: ["tourist", "guide", "lead-guide", "admin"],
    default: "tourist",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (pwdConfirm) {
        return pwdConfirm === this.password;
      },
    },
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpires: {
    type: Date,
  },
});

// Middlewares
// DOCUMENT MIDDLEWAREs

/**
 * Hashes the password before save()
 */
userSchema.pre("save", async function (next) {
  // if the password is not new, skip this middleware
  if (!this.isModified("password")) return next();

  this.password = await argon.hash(this.password);
  //   no need to save this
  this.passwordConfirm = undefined;
  next();
});

/**
 * Catches the time of changing the password
 */
userSchema.pre("save", async function (next) {
  // if the password is modified and not the first time of the user
  if (!this.isModified("password")) return next();
  this.passwordChangedAt = Date.now();

  next();
});

// INSTANCE METHOD

/**
 * Verifies the password provided with the hash stored.
 * @param {String} candiatePassword password provided by user
 * @returns {Boolean}
 */
userSchema.methods.verifyPassword = async function (candiatePassword) {
  return argon.verify(this.password, candiatePassword);
};

/**
 * Checks if the password has changed after the jwt token has been issued
 * @param {Number} JWTTimestamp
 * @returns {Boolean}
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  console.log(JWTTimestamp, this.passwordChangedAt);
  console.log(parseInt(this.passwordChangedAt.getTime() / 1000));
  return JWTTimestamp < parseInt(this.passwordChangedAt.getTime() / 1000);
};

/**
 * Generates a reset password token.
 */
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hash it and save to db
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpires = Date.now() + 60 * 1000 * 10; // date now + 10min

  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
