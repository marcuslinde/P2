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

export const getUserStats = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid User Id" });
    }
  
    try {
      // Find all games where the user is a player
      const games = await Game.find({ 'players.userId': id });
      
      let wins = 0;
      
      // Her implementeres logik for count wins
      /* games.forEach(game => {
        if (game.status === 'finished') {
          const userPlayer = game.players.find(
            p => p.userId.toString() === id.toString()
          );
          const opponentPlayer = game.players.find(
            p => p.userId.toString() !== id.toString()
          );
          if (userPlayer && opponentPlayer) {
            const allOpponentShipsSunk = opponentPlayer.ships.every(ship => ship.isSunk);
            if (allOpponentShipsSunk) {
              wins++;
            }
          }
        }
      });*/
      
      const totalGames = games.length;
      const winRatio = totalGames > 0 ? wins / totalGames : 0;
      
      return res.status(200).json({
        success: true,
        stats: {
          totalGames,
          wins,
          winRatio: winRatio.toFixed(2)
        }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
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