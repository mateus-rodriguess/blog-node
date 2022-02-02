const express = require('express')
const Category = require('../../models/Category')
const Post = require("../../models/Post")
const {isAdmin} = require("../../helpers/isAdmin")
const router = express.Router()


router.get("/category", isAdmin, (req, res) => {
    Category.find().sort({ date: "desc" }).then((category) => {
        res.render("admin/categories", { category: category })
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao listar as categorias")
        res.redirect("/")
    })
})


router.get("/category/add", isAdmin, (req, res) => {
    res.render("admin/addCategory")
})

router.post("/category/new", isAdmin, (req, res) => {
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

router.get("/category/:id", isAdmin, (req, res) => {

    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render("admin/category", { category: category })
    }).catch((erro) => {
        console.log(erro)
        req.flash("error_msg", "Erro ao econtrar esta categoria")
        res.redirect("/admin/category")
    })

})

router.get("/category/edit/:id", isAdmin, (req, res) => {
    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render("admin/editCategory", { category: category })
    }).catch((erro) => {
        console.log(erro)
        req.flash("error_msg", "Erro ao econtrar esta categoria")
        res.redirect("/admin/category")
    })

})

router.post("/category/edit/", isAdmin, (req, res) => {
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

router.post("/category/delete/", isAdmin, (req, res) => {
    Category.remove({ _id: req.body.id }).then(() => {
        console.log("ok")
        req.flash("success_msg", "excluida com sucesso")
        res.redirect("/admin/category")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao excluir")
        res.redirect("/admin/category")
    })
})

router.get("/posts", isAdmin, (req, res) => {
    Post.find().sort({ date: "desc" }).populate("category").sort({ date: "desc" }).then((post) => {

        res.render("admin/posts", { post: post })
    })

})

router.get("/post/add", isAdmin, (req, res) => {
    Category.find().then((category) => {
        res.render("admin/addPost", { category: category })

    }).catch((erro) => {
        req.flash("erro_msg", "erro ao salvar a categoria")
        res.redirect("/admin/posts")
    })

})

router.post("/post/new", isAdmin, (req, res) => {

    var erros = []

    if (req.body.category == "0") {

        erros.push({ text: "Categoria não pode ser vazia" })
    }
    if (erros.length > 0) {
        res.render("admin/addPost", { erros: erros })

    } else {
        const post_new = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category,
            slug: req.body.slug,
        }
        new Post(post_new).save().then(() => {
            req.flash("success_msg", "postagem criacda com sucesso")
            res.redirect("/admin/posts")
        }).catch(() => {
            req.flash("error_msg", "erro ao salvar o post")
            res.redirect("/admin/posts")
        })
    }
})

router.get("/post/delete/:id", isAdmin, (req, res) => {
    Post.remove({ _id: req.params.id}).then(() => {
        req.flash("success_msg", "excluida com sucesso")
        res.redirect("/admin/posts")
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao excluir")
        res.redirect("/admin/posts")
    })
})

router.get("/post/edit/:id", isAdmin, (req, res) => {
    Post.findOne({ _id: req.params.id }).then((post) => {
        Category.find().then((category) => {
            res.render("admin/editPost", { post: post, category: category })
        }).catch((error) => {
            req.flash("error_msg", "Error ao lista as categorias")
            res.redirect("/admin/posts")
        })

    }).catch((erro) => {
        req.flash("error_msg", "Erro ao econtrar este post")
        res.redirect("/admin/posts")
    })

})

router.post("/post/edit", isAdmin, (req, res) => {
    var erros = []

    Post.findOne({ _id: req.body.id }).then((post) => {
        post.title = req.body.title,
            post.content = req.body.content,
            post.slug = req.body.slug,
            post.description = req.body.description,
            post.category = req.body.category

        if (!req.body.title || typeof req.body.title == undefined || req.body.title == null) {
            erros.push({ text: "Nome invalido" })
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ text: "Slug invalido" })
        }
        if (req.body.title < 2) {
            erros.push({ text: "Nome muito curto " })
        }
        if (req.body.category == "0") {
            erros.push({ text: "Categoria não pode ser vazia" })
        }
        if (erros.length > 0) {
            Category.find().then((category) => {
                res.render("admin/editPost", {erros:erros, post: post, category: category })
            })
        } else {
            post.save().then(() => {
                req.flash("success_msg", "Post editado com sucesso ")
                res.redirect("/admin/posts")
            }).catch((error) => {
                console.log(error)
                req.flash("error_msg", "Errr ao salvar o post")
                res.redirect("/admin/posts")
            })
        }

    }).catch((erro) => {
        req.flash("error_msg", "Error ao encontrar esse post")
        res.redirect("/admin/posts")
    })

})

// export
module.exports = router