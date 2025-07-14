const mongoose = require('mongoose');
async function connectToMongoDB(DB) {
    try {
        await mongoose.connect(DB);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error after logging it
    }
}

module.exports = connectToMongoDB;
