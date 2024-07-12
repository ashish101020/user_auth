const { Router } = require('express');
const { RegisterValidations } = require('../validators/user-validator');
const { validationResult } = require('express-validator');

const router = Router();

router.post('/api/register', async (req, res) => {
    // Registration logic goes here
});

module.exports = router;
