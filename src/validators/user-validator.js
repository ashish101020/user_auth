const { check } = require('express-validator');

const name = check('name', 'Name is required.').not().isEmpty();
const username = check('username', 'Username is required.').not().isEmpty();
const email = check('email', 'Please provide a valid email address.').isEmail();
const password = check('password', 'Password is required of minimum length of 8.').isLength({ min: 8 });

const RegisterValidations = [password, name, username, email];
const AuthenticateValidations = [password, username];

module.exports = { RegisterValidations, AuthenticateValidations };
