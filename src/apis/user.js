const { Router } = require('express');
const { User } = require('../models/User');
const { randomBytes } = require('crypto');
const path = require('path');
const { RegisterValidations, AuthenticateValidations } = require('../validators/user-validator');
const { validatorMiddleware } = require('../middleware/validator-middleware');
const sendMail = require('../functions/email-sender');
const { DOMAIN } = require('../constants/index');
const userAuth = require('../middleware/auth-guard.js');

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
                <a href="${DOMAIN}/user/verify-now/${user.verificationCode}">Verify Now</a>
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

router.get('/verify-now/:verificationCode', async (req, res) => {
    try {
        let { verificationCode } = req.params;
        let user = await User.findOne({ verificationCode });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access. Invalid verification code.",
            });
        }
        user.verified = true;
        user.verificationCode = undefined;
        await user.save();
        return res.sendFile(path.join(__dirname, "../templetes/verification-success.html"));
    } catch (error) {
        console.error("ERROR_VERIFYING_USER", error);
        return res.sendFile(path.join(__dirname, "../templetes/error.html"));
    }
});

router.post('/api/authenticate', AuthenticateValidations, validatorMiddleware, async (req, res) => {
    try {
        let { username, password } = req.body;
        
        // Ensure password is a string
        password = String(password);
        
        console.log('Login attempt with:', { username, password });
        
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Username not found.",
            });
        }

        if (!(await user.comparePassword(password))) {
            return res.status(404).json({
                success: false,
                message: "Incorrect password.",
            });
        }

        let token = await user.generateJWT();
        return res.status(200).json({
            user: user.getUserInfo(),
            token: `Bearer ${token}`,
            success: true,
            message: "Hurray, you are now logged in.",
        });
    } catch (error) {
        console.error('Error during authentication:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred.",
        });
    }
});



router.get("/api/authenticate", userAuth, async (req, res) =>{
    console.log("REQ", req);
    return res.status(200).json({
        user: req.user,
    });
});

module.exports = router;
