const argon = require("argon2");
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
    default: "user",
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
      validator: function (passwordConfirm) {
        passwordConfirm === this.password;
      },
    },
  },
});

// Middlewares
// DOCUMENT MIDDLEWARE
userSchema.pre("save", async function (next) {
  // if the password is not new, skip this middleware
  if (this.isModified("password")) return next();

  this.password = await argon.hash(this.password);
  //   no need to save this
  passwordConfirm = undefined;
  next();
});

// INSTANCE METHOD
userSchema.methods.verifyPassword = async function (
  candiatePassword,
  realPassword
) {
  return argon.verify(realPassword, candiatePassword);
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
