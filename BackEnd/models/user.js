const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        minlength: 6,
        maxlenght: 20,
        unique: true
    },
    email: {
        type: String,
        require: true,
        minlength: 10,
        maxlenght: 50,
        unique: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    admin: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema);