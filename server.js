const express = require("express");
const app = express();

const path = require("path");
const http = require("http");
const {Server} = require("socket.io");


const server = http.createServer(app);

const io = new Server(server);
app.use(express.static(path.resolve("")))

let arr=[]
let playingArray=[]
io.on("connection", (socket) => {
    socket.on("find",(e)=>{
        if(e.name!=null){
            arr.push(e.name)

            if(arr.length>=2){
                let p1obj={
                    p1name:arr[0],
                    p1value:"X",
                    p1move:"",
                    socketId:socket.id
                }
                let p2obj={
                    p2name:arr[1],
                    p2value:"O",
                    p2move:"",
                    socketId:socket.id
                }
                let obj ={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }
                playingArray.push(obj)

                arr.splice(0,2)

                io.emit("find",{allPlayers:playingArray})
            }
        }
    })

    socket.on("playing",(e)=>{
        if(e.value=="X"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)

            objToChange.p1.p1move=e.id
            objToChange.sum++
        }
        if(e.value=="O"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)

            objToChange.p2.p2move=e.id
            objToChange.sum++
        }

        io.emit("playing",{allPlayers:playingArray})
    })
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);


        arr = arr.filter(name => name !== socket.name);


        playingArray = playingArray.filter(game =>
            game.p1.socketId !== socket.id &&
            game.p2.socketId !== socket.id
        );
    });
})

app.get("/", (req, res) => {
    return res.sendFile("./index.html");
})

server.listen(3000,()=>{
    console.log("Server started on port 3000")
});