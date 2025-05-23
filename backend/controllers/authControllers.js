import User from "../models/User.js";
import { comparePassword, hashPassword } from './encryption.js';

// Login: Check provided credentials and return the user data (without the password)
export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Provide all fields" });
  }

  try {
    // Adjust the query if you use email or another field for login
    const user = await User.findOne({ name: username }, "name email _id password");
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid username or password" });
    }

    const isPasswordMatch = await comparePassword(user.password, password);

    if (!isPasswordMatch) {
      return res.status(404).json({ success: false, message: "Invalid username or password" });
    }
    // You can also add token generation here if needed, e.g.:
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: "User logged in", user /*, token*/ });
  } catch (error) {
    console.error("Error in login:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Register: Create a new user after validating input
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Provide all fields" });
  
  }

  try {
    // Hash password
    const hashedPassword = await hashPassword(password);
    // Create a new user
    const newUser = new User({ name, email, password: hashedPassword }); 
    await newUser.save();

    // Remove sensitive fields before sending the responsz
    const { password, ...safeUser } = newUser.toObject();
    res.status(201).json({ success: true, newUser: safeUser });
    return true;
  } catch (error) {
    console.error("Error in creating user:", error.message);
    res.status(500).json({ success: false, message: "Server error"});
    return false;
  }
};

