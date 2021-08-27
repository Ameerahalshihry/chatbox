// 1 load all the modules 
let express = require("express")
let mongoose = require("mongoose")
let bodyParser = require("body-parser")
let cors = require("cors")
let chatBoxModel = require("./models/model")


// 2 database URL 
let url = "mongodb://localhost:27017/merndb";

//3 create the reference of express 
let app = express()
let http = require("http").Server(app)
let io =require("socket.io")(http)

//4 add middleware 
app.use(bodyParser.json());     // enable data from request body
app.use(cors());                // enable cors features. 

// to avoid database connection warning 
let options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
//5 connect the database 
mongoose.connect(url,options).
then(res=>console.log("connected db")).
catch(err=>console.log(err));

//6 match main path and pass to router file 
app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

io.on("connection", (socket) => {
    console.log("client connected");
    // Get chats from mongo collection
    chatBoxModel.find({}, (err,result)=>{
        if(!err){
            console.log(result);
            socket.emit('output',result)
        }else{
            console.log(err);
        }
    })
    //to get the message from a client 
    socket.on("obj",(data)=> {
        console.log(data);
        let name = data.name
        let message = data.message
        //here will store data in db
            chatBoxModel.insertMany({name:name, message:message},()=>{
                io.emit('output',[data])
            })
    })
    socket.emit("servermsg","Server: Hello, thank you for visiting, enjoy chatting =) ")
})
http.listen(9980,console.log("server running on port 9980"))


