const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Retrieve environment variables from process.env
const DB = process.env.APP_DB;
const SENDGRID_API = process.env.APP_SENDGRID_API;
const DOMAIN = process.env.APP_DOMAIN;
const PORT = process.env.APP_PORT || process.env.PORT;
const SECRET_KEY = process.env.APP_SECRET;


// Check if critical environment variables are set
if (!DB || !SENDGRID_API || !DOMAIN || !SECRET_KEY) {
    console.error('One or more required environment variables are missing.');
    console.error('DB:', DB);
    console.error('SENDGRID_API:', SENDGRID_API);
    console.error('DOMAIN:', DOMAIN);
    console.error('PORT:', PORT);
    console.error('SECRET_KEY:', SECRET_KEY);
    process.exit(1); // Exit the process with an error code
}

module.exports = { DB, SENDGRID_API, DOMAIN, PORT, SECRET_KEY };
