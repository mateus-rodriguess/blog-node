const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const User = require("../models/User")
const validator = require("email-validator");
const bcript = require("bcryptjs")
const passPort = require("passport")

router.get('/register', (req, res) => {
    res.render("user/register")

})

router.post("/register", (req, res) => {
    var erros = []

    if (!req.body.first_name || typeof req.body.first_name == undefined || req.body.first_name == null) {
        erros.push({ text: "Nome não definido" })
    }
    if (!req.body.last_name || typeof req.body.last_name == undefined || req.body.last_name == null) {
        erros.push({ text: "Sobrenome não definido" })
    }
    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null || !validator.validate(req.body.email)) {
        erros.push({ text: "Email invalido" })
    }
    if (!req.body.password1 || typeof req.body.password1 == undefined || req.body.password1 == null ||
        !req.body.password2 || typeof req.body.password2 == undefined || req.body.password2 == null) {
        erros.push({ text: "Senha invalida" })
    }
    if (req.body.password1.length < 4) {
        erros.push({ text: "Senha muito curta" })
    }
    if (req.body.password1 != req.body.password2) {
        erros.push({ text: "Senhas diferentes" })
    }
    if (erros.length > 0) {
        res.render("user/register", { erros: erros })
    }
    else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                req.flash("error_msg", "Email ja registrado")
                res.redirect("/account/register")
            } else {
                const newUser = new User({
                    firstName: req.body.first_name,
                    lastName: req.body.last_name,
                    email: req.body.email,
                    password: req.body.password1,
                    isAdmin: true
                })
                bcript.genSalt(10, (erro, salt) => {
                    bcript.hash(newUser.password, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect("/")
                        }
                        newUser.password = hash

                        newUser.save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso")
                            res.redirect("/")
                        }).catch((error) => {
                            console.log("erro: " + error)
                            req.flash("error_msg", "Erro interno")
                            res.redirect("/")
                        })

                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Erro interno")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res)=>{
    res.render("user/login")
})

router.post("/login", (req, res, next)=>{
    
    passPort.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/account/login",
        failureMessage: true
    })(req, res, next)

})

router.get("/logout", (req, res)=>{
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso")
    res.redirect("/")
})
module.exports = router
