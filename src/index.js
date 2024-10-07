const cors = require('cors');
const path = require('path');
const express = require('express');
const { DB, PORT } = require('./constants/index.js');
const userRouter = require('./apis/user.js');
const connectToMongoDB = require('./connection.js');
const passport = require('passport');
const profile = require('./apis/profiles.js');
require('./middleware/passport-middleware.js');

const appRouter = express();

appRouter.use(cors()); // This sets up CORS with default options
appRouter.use(express.json());
appRouter.use(passport.initialize());
appRouter.use(express.static(path.join(__dirname, '/uploads')));

appRouter.use('/user', userRouter);
appRouter.use('/profiles', profile);

connectToMongoDB(DB)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

appRouter.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = { appRouter };
