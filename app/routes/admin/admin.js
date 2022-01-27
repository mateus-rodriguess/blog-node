const express = require('express')
//const mongoose = require("mongoose")

const Category = require('../../models/Category')

const router = express.Router()

router.get("/posts", (req, res) => {
    res.send("ok")
})

router.get("/category", (req, res) => {
    Category.find().sort({ date: "desc" }).then((category) => {
        res.render("admin/categories", { category: category })
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao listar as categorias")
        res.redirect("/")
    })
})


router.get("/category/add", (req, res) => {
    res.render("admin/addCategory")
})

router.post("/category/new", (req, res) => {
    var erros = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({ text: "Nome invalido" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ text: "Slug invalido" })
    }
    if (req.body.name < 2) {
        erros.push({ text: "Nome muito curto " })
    }
    if (erros.length > 0) {
        res.render("admin/addCategory", { erros: erros })
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }
        var category = new Category(req.body)
        category.save().then(() => {
            req.flash("success_msg", "categoria " + req.body.name + " criada")
            res.redirect("/admin/category")
        }).catch((erro) => {
            req.flash("error_msg", "Error salvar a categoria" + req.body.name)
            res.redirect("/admin/categories")
        })
    }
})

router.get("/category/:id", (req, res) => {

    Category.findOne({ _id: req.params.id }).then((category) => {
        console.log(req.params.id)
        res.render("admin/category", { category: category })
    }).catch((erro) => {
        console.log(erro)
        req.flash("error_msg", "Erro ao econtrar esta categoria")
        res.redirect("/admin/category")
    })

})

router.get("/category/edit/:id", (req, res) => {
    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render("admin/editCategory", { category: category })
    }).catch((erro) => {
        console.log(erro)
        req.flash("error_msg", "Erro ao econtrar esta categoria")
        res.redirect("/admin/category")
    })

})

router.post("/category/edit/", (req, res) => {
    var erros = []

    if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
        erros.push({ text: "Nome invalido" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ text: "Slug invalido" })
    }
    if (req.body.name < 2) {
        erros.push({ text: "Nome muito curto " })
    }
    if (erros.length > 0) {
        res.render("admin/editCategory", { erros: erros, category: req.body })
    } else {
        Category.findOne({ _id: req.body.id }).then((category) => {

            category.name = req.body.name
            category.slug = req.body.slug

            category.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso")
                res.redirect("/admin/category")
            }).catch((err) => {
                console.log(err)
                req.flash("error_msg", "Erro ao salvar a categoria")
                res.redirect("/admin/category")
            })
        }).catch((err) => {
            req.flash("error_msg", "Erro ao editar a categoria")
            res.redirect("/admin/category")
        })
    }
})

router.post("/category/delete/", (req, res)=>{
    Category.remove({_id: req.body.id}).then(()=>{
        console.log("ok")
        req.flash("success_msg", "excluida com sucesso")
        res.redirect("/admin/category")
    }).catch((erro)=>{
        req.flash("error_msg", "Erro ao excluir")
        res.redirect("/admin/category")
    })
})
module.exports = router