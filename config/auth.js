const localStrategy = require("passport-local").Strategy

bcrypt = require("bcryptjs")

const User = require("../app/models/User")

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: "email", passwordField: "password"}, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                return done(null, false, { message: "Esta conta não existe" })
            }
            bcrypt.compare(password, user.password, (error, knock) => {
                if (knock) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: "Credencias invalidas" })
                }
            })
        })
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}