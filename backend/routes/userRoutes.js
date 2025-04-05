import express from "express";
import {getAllUsers, getUserById, createUser, deleteUser, login} from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Get a single user
router.get("/:id", getUserById);

// POST a logged in user
router.post("/login/", login);

// POST a new user
router.post("/register", createUser);

// Delete a user
router.delete("/:id", deleteUser);

/*
// Update a user
router.put("/:id", (req, res) => {
  res.json({ mssg: "update user" }); // Dummy
});
*/
export default router