import express from "express";
import { getAllUsers, getUser, getUserStats, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", getAllUsers);

// Get a single user
router.get("/:id", getUser);

// Get a user's stats
router.get("/:id/stats", getUserStats);

// Delete a user
router.delete("/:id", deleteUser);

/*
// Update a user
router.put("/:id", (req, res) => {
  res.json({ mssg: "update user" }); // Dummy
});
*/
export default router