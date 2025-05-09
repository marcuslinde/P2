import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'process';

//--------environment variable------//
dotenv.config();
// console.log("ATLAS_URI:", process.env.ATLAS_URI); // This should output your connection string
//---------------------------------//

/**
 * @function
 */
async function connectDB() {
    try {
        //.env file is processed here
        await mongoose.connect(process.env.ATLAS_URI || "");

        console.log('Connected to the DB via Mongoose');
    } catch (err) {
        console.error('Error connecting to the DB', err);

        process.exit(1);
    }
}

export default connectDB; //ES Module
