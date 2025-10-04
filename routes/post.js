const mongoose = require('mongoose');


const postScheme = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title: String,
    Description: String,
    image:String,

});


module.exports = mongoose.model("post", postScheme);