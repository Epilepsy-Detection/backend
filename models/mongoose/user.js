const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    maxlength: 320,
    unique: [true, "Email address ia already in use"], // Make sure this creates index
    trim: true,
    required: [true, "Please enter an email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    maxlength: 255,
    required: [true, "Please provide a user password"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["doctor", "patient", "admin"],
    default: "doctor",
  },
});

//  Generates an access token to be used to access protected routes
userSchema.methods.generateAuthToken = function (payload) {
  const token = jwt.sign(
    { _id: this._id, role: this.role, ...payload },
    process.env.JWT_SECRET
  );
  return token;
};

//  Compares the user entered password vs the hashed password in db
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Model Middleware

//  Hash the password before saving it into the db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
