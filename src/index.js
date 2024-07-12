const cors = require('cors');
const express = require('express');
const { DB, SENDGRID_API, DOMAIN, PORT, SECRET_KEY } = require('./constants/index.js');
const userRouter = require('./apis/user.js');
const connectToMongoDB = require('./connection.js');
// const { json } = require('body-parser'); // No need to import body-parser as express has built-in JSON parsing

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRouter);

connectToMongoDB(DB)
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
