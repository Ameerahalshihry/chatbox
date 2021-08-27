// load the module 
let mongoose = require("mongoose");

// Schema 
let chatBoxSchema = mongoose.Schema({
    name:String,
    message:String
});

// Model 
let chatBoxModel = mongoose.model("",chatBoxSchema,"ChatBox");

module.exports=chatBoxModel;
