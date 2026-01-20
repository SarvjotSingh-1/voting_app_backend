const User = require("../models/userModel");
const { generateToken, jwtAuthMiddleware } = require("../jwt.js");

exports.signup = async (req, res) => {
  try {
    console.log("Signup route hit");
    const data = req.body;

    // Check if there is already an admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists" });
    }
    // Validate Aadhar Card Number must have exactly 12 digit
    if (!/^\d{12}$/.test(data.aadharCardNumber)) {
      return res
        .status(400)
        .json({ error: "Aadhar Card Number must be exactly 12 digits" });
    }

    // Check if a user with the same Aadhar Card Number already exists
    const existingUser = await User.findOne({
      aadharCardNumber: data.aadharCardNumber,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User with the same Aadhar Card Number already exists",
      });
    }

    const newUser = new User(data);
    const saveUser = await newUser.save();
    console.log("data saved");
    const payload = {
      id: saveUser.id,
    };
    // console.log("Payload for Token:", JSON.stringify(payload));
    const token = generateToken(payload);
    console.log("Generated Token:", token);
    res.status(200).json({ response: saveUser, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;
    const User = await user.findOne({ aadharCardNumber: aadharCardNumber });
    // if user does not exist or password not match
    if (!User || !(await User.comparePassword(password))) {
      return res
        .status(400)
        .json({ error: "Invalid aadharCardNumber or password" });
    }

    // generate token
    const payload = {
      id: User.id,
    };
    const token = generateToken(payload);

    // return token as response
    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    // console.log("Profile route hit");
    const userData = req.user; // extracted from token by jwt middleware
    // console.log("User Profile Fetched", userData);
    const userId = userData.id;
    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(foundUser);
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id; // extracted from token by jwt middleware

    const { oldPassword, newPassword } = req.body;

    const foundUser = await user.findById(userId);
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordMatch = await foundUser.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    foundUser.password = newPassword;
    await foundUser.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(`${error} Internal server err`);
    res.status(500).json({ error: "Internal server error" });
  }
};
