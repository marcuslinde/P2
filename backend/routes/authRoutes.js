import express from "express";
import { login, register } from "../controllers/authControllers.js";

const router = express.Router();

// POST to log in user
router.post("/login/", login);

// POST to register new user
router.post("/register", register);

export default router;