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
        require: true
    },
    age: {
        type: Number,
    }

})

mongoose.model('user', UserSchema)
// const Mateus = mongoose.model("user")

// new Mateus({
//     firstName: "mateus",
//     lastName: "rodrigues",
//     email: "ok@gmail.com",
//     age: 12
// }).save().then( ()=> {
//     console.log("salvo")
// }).catch((err)=>{
//     console.log("erro: "+ err)
// }) 