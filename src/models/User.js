const { compare, hash } = require('bcryptjs');
const { Schema, model, mongo } = require('mongoose');
const { SECRET_KEY } = require('../constants');
const { sign } = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { pick } = require('lodash');


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: String,
        required: false,
    },
    verificationCode: {
        type: String,
        required: false,
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordExpireIn: {
        type: String,
        required: false,
    },
}, {timestamps: true});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});


UserSchema.methods.comparePassword = async function (password) {
    const isMatch = await compare(password, this.password);
    // console.log('Password comparison result:', isMatch);  // Add this log
    return isMatch;
};

UserSchema.methods.generateJWT = async function() {
    const payload = {
        username: this.username,
        email: this.email,
        name: this.name,
        id: this._id,
    };
    
    // console.log('Generating token with payload:', payload); 
    return sign(payload, SECRET_KEY, { expiresIn: '1d' });
};

UserSchema.methods.generatePasswordReset = function () {
    this.resetPasswordExpireIn = Date.now() + 36000000;
    this.resetPasswordToken = randomBytes(20).toString("hex");
};

UserSchema.methods.getUserInfo = function () {
    return pick(this, ["_id", "username", "email", "name", "verified"]);
};

const User = model("users", UserSchema);
module.exports = { User };