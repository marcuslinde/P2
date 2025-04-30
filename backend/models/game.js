import mongoose from 'mongoose';
const { Schema } = mongoose;

const ShipSchema = new Schema({
  name: { type: String, required: true },       // e.g., "destroyer", "carrier"
  length: { type: Number, required: true },
  rotation: { type: String, required: true },     // e.g., "vertical", "90", "horizontal"
  coveredFields: { type: [Number] },              // An array of field numbers occupied by the ship
  hits: {type: Number, required: true},
  isSunk: {type: Boolean, required: true},
}, { _id: false });

// Schema for a player in the game
const PlayerSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: {type: String, required: true},
  ships: [ShipSchema],
  shots: { type: [Number], default: [] },  // Each shot represented as a number (e.g., 45)
  ready: { type: Boolean, default: false }
}, { _id: false });

// Main game schema
const GameSchema = new Schema({
  gameCode: { type: String, required: true, unique: true },
  players: {
    type: [PlayerSchema],
    required: true,
    // Allow one or two players in a game
    validate: {
      validator: function(v) {
        return v.length <= 2;
      },
      message: 'A game can have at most 2 players.'
    }
  },
  status: { type: String, enum: ['waiting', 'active', 'finished'], default: 'waiting' },
  currentTurn: { type: Schema.Types.ObjectId, ref: 'User' }, // Set once both players are ready
  winner: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
export default Game;