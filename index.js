const { appRouter } = require('./src/index.js');
const express = require('express');

const app = express();

app.use('/', appRouter);
