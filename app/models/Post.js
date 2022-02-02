const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

const Post = mongoose.model("post", PostSchema)

module.exports =  Post
