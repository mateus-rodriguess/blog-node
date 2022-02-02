const express = require('express')
//const mongoose = require("mongoose")

const Category = require('../../models/Category')
const Post = require("../../models/Post")

const router = express.Router()

router.get('/', (req, res, next) => {
    Post.find().sort({ date: "desc" }).populate("category").sort({ date: "desc" }).then((post) => {
  
        res.render('home/index', { post: post });
    }).catch((erro) => {
        req.flash("error_msg", "Erro interno")
        res.redirect("/404")
    })

})

router.get("/post/:slug", (req, res) => {
    Post.findOne({ slug: req.params.slug }).populate("category").then((post) => {
        if (post) {
            res.render("home/post", { post: post })
        } else {
            req.flash("error_msg", "Não exite essa postagem")
            res.redirect("/")
        }

    }).catch((erro) => {
        req.flash("error_msg", "Não exite essa postagem")
        res.redirect("/404")
    })
})

router.get("/category", (req, res) => {
    Category.find().then((category) => {
        if (category) {
            res.render("home/categoryes", { category: category })
        }
        else {
            req.flash("error_msg", "Nenhuma categoria encontrada")
            res.redirect("/")
        }
    }).catch((erro) => {
        req.flash("error_msg", "Erro interno")
        res.redirect("/")
    })
})

router.get("/category/:slug", (req, res) => {

    Category.findOne({ slug: req.params.slug  }).then((category) => {
        if (category) {
            Post.find({category:category._id}).then((post) => {
                res.render("home/posts", { category: category, post:post  })
            }).catch((error) => {
                req.flash("error_msg", "Erro interno")
                res.redirect("/category")
            })
        } else {
            req.flash("error_msg", "Erro interno")
            res.redirect("/category")
        }
    }).catch((erro) => {
        req.flash("error_msg", "Erro interno")
        res.redirect("/category")
    })
})

router.get("/404", (req, res) => {
    res.send("error 404")
})


module.exports = router