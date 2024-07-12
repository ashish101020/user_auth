const mongoose = require('mongoose');
const { DB } = require("./constants/index.js")
async function connectToMongoDB(DB) {
    try {
        await mongoose.connect(DB);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error after logging it
    }
}

module.exports = connectToMongoDB;
