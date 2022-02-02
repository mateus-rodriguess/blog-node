const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true,
        dropDups: true

    },
    password: {
        type: String,
        require: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('user', UserSchema)

module.exports =  User