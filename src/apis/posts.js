const { Router } = require('express');
const { Post, User } = require('../models');
const uploader = require('../middleware/uploader.js');
const { userAuth } = require('../middleware/auth-guard.js');
const { postValidations } = require('../validators/post-validator.js');
const { validatorMiddleware } = require('../middleware/validator-middleware.js');

const router = Router();

router.post('/api/post0image-upload', userAuth, async (req, res) => {
    
})

router.post('/api/create-post', userAuth, postValidations, validatorMiddleware, async (req, res) => {
    try{

    } catch (err) {
        return res.json({
            success: false,
            message: "Unable to create post.",
        });
    }
})

module.exports = router;