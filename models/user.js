const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [
            /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/, "Please provide a valid name",
        ]

    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [3, "Email must be 3 characters long"],
        maxLength: [320, "Email must not be more than 320 characters"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: [8, "Password must be atleast 8 characters long"],
        match: [
            /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/, "Your Password must contain an uppercase and a lowercase letter, a special character(symbol) and a number"
        ]
    },
    profilePicPath: {
        type: String,
        required: [true, 'Please add a Profile Pic']
    }
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();

});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);