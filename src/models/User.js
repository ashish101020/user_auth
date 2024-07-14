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

UserSchema.pre('save', async function(next){
    let user = this;
    if(!user.isModified("password")) return next();
    user.password = await hash(user.password, 10);
    next();
});

UserSchema.methods.comparePassword = async function (password) {
    return await compare( password, this.password);
}

UserSchema.methods.generateJWT = async function() {
    let payload = {
        username: this.username,
        email: this.email,
        name: this.name,
        id: this._id,
    }
    return await sign(payload, SECRET_KEY, { expiresIn: "1 day"});
};

UserSchema.methods.generatePasswordReset = function () {
    this.resetPasswordExpireIn = Date.now() + 36000000;
    this.resetPasswordToken = randomBytes(20).toString("hex");
};

UserSchema.methods.getUserInfo = function () {
    return pick(this, ["_id", "username", "email", "name"]);
};

const User = model("users", UserSchema);
module.exports = { User };