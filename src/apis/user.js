const { Router } = require('express');
const { User } = require('../models/User.js');
const { randomBytes } = require('crypto');
const { RegisterValidations } = require('../validators/user-validator');
const { validatorMiddleware } = require('./../middleware/validator-middleware.js');
const sendMail = require('./../functions/email-sender.js');

const router = Router();

router.post('/api/register', RegisterValidations, validatorMiddleware, async (req, res) => {
    try {
        const { username, email } = req.body;
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Username is already taken.",
            });
        }
        user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "Email is already registered. Did you forget the password? Try resetting it.",
            });
        }
        user = new User({
            ...req.body,
            verificationCode: randomBytes(20).toString("hex")
        });
        await user.save();

        // Send the mail to the user with verification
        const html = `
            <div>
                <h1>Hello, ${user.username}</h1>
                <p>Please click the following link to verify your account</p>
                <a href="/user/verify-now/${user.verificationCode}">Verify Now</a>
            </div>
        `;
        await sendMail(user.email, "Verify Account", "Please verify your account", html);
        
        return res.status(201).json({
            success: true,
            message: "Hurray! Your account is created. Please verify your email address."
        });
    } catch (error) {
        console.error("ERROR_REGISTERING_USER", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred.",
        });
    }
});

module.exports = router;
