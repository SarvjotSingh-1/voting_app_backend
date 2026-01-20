const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    mobile: {
      type: String,
    },
    address: {
      type: String,
    },
    aadharCardNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  const user = this;
  // hash password only if it is modified or new
  if (!user.isModified("password")) return;
  try {
    // hash the password before saving the user model
    const salt = await bcrypt.genSalt(10); // salt generat kr rhe h
    // hash password
    const hashedPassword = await bcrypt.hash(user.password, salt);
    // replace plain text password with hashed password
    user.password = hashedPassword;
    // next();
  } catch (error) {
    return error;
  }
});

// ye password compare krne k liye h ki jo password user ne dala h login krte time wo db me jo hashed password h usse match krta h ya nhi
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // compare candidate password with stored hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
