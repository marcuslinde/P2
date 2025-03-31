import User from "../models/User.js";
import mongoose from "mongoose";


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});//empty means all
        res.status(200).json({ success: true, data: users })

    } catch (error) {
        console.log("error fetching users :", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const getUser = async (req, res) => {
    const { id } = req.params;
    console.log("id: ", id); //debugging to see in terminal


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try {
        const user = await User.findById(id);
        res.status(200).json({ success: true, message: "User found", user: user });
    } catch (error) {
        res.status(404).json({ success: false, message: "User not found" });
    }
}

export const login = async (req, res) => { //async so we can call await
    const username = req.body.username; //user sending data
    const password = req.body.password; //user sending data

    if (!username || !password) {//middleware
        return res.status(400).json({ success: false, message: "Provide all fields" });
    }

    try {
        /* find user with password and username*/
        const user = await User.findOne({ 'name': `${username}`, 'password': `${password}` }, 'name password');

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid username or password" });
        }

        res.status(200).json({ success: true, message: "User found", user: user });

    } catch (error) {
        res.status(404).json({ success: false, message: "User not found" });
    }
}

export const createUser = async (req, res) => { //async so we can call await
    const user = req.body; //user sending data

    if (!user.name || !user.email || !user.password) {//middleware
        return res.status(400).json({ success: false, message: "Provide all fields" });
    }
    const newUser = new User(user);

    try {
        await newUser.save();

        // Convert mongoose document to a plain object and remove password field
        const { password, ...safeUser } = newUser.toObject();

        res.status(201).json({ success: true, newUser: safeUser });//201 means something created


    } catch (error) {
        console.log("Error in creating user :", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    console.log("id: ", id); //debugging to see in terminal
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}