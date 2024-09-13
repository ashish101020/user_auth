const cors = require('cors');
const express = require('express');
const { DB, PORT } = require('./constants/index.js');
const userRouter = require('./apis/user.js');
const connectToMongoDB = require('./connection.js');
const passport = require('passport');
// const { json } = require('body-parser'); // No need to import body-parser as express has built-in JSON parsing
require('./middleware/passport-middleware.js')

const appRouter = express();


appRouter.use(cors());
appRouter.use(express.json());
appRouter.use(passport.initialize());

appRouter.use('/user', userRouter);

connectToMongoDB(DB)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

appRouter.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

module.exports = { appRouter };