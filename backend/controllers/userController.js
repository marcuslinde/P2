import Game from "../models/game.js";
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

export const getUserById = async (req, res) => {
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

export const getUserStats = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid User Id" });
    }
  
    try {
        // 1) Antal færdige spil, hvor brugeren har deltaget
        const totalGames = await Game.countDocuments({
            status: "finished",
            "players.userId": id,
        });
        
        // 2) Antal sejre: hvor winner = brugeren
        const wins = await Game.countDocuments({
            status: "finished",
            winner: id,
        });

       // 3) Beregn winRatio
        const winRatio = totalGames > 0 ? (wins / totalGames).toFixed(2) : "0";
      
        return res.status(200).json({
            success: true,
            stats: {
              totalGames,
              wins,
              winRatio,
            },
          });
    } catch (error) {
        console.error("Error in getUserStats:", error);
        return res
            .status(500)
            .json({ success: false, message: "Server error" });
    }
};

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