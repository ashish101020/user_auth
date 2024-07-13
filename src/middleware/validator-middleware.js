const { validationResult } = require('express-validator');

const validatorMiddleware = async (req, res, next) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({
            errors: errors.array(),
        });
    } 
    next();
}

module.exports = { validatorMiddleware };