const express = require("express")
const app = express()
const http = require('http').Server(app)
const webSocket = require("websocket")

const wss = new webSocket.server({ httpServer: http })

const port = 3000

app.use("/public",express.static(__dirname+"/public"))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})


//
const Clients = {
    "client":[],
    "id":[],
    "room":[]
}
const getId = () =>{
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '--_--' + s4();
}

//room 
const clients =[Clients]
let id = []
wss.on("request",(ws)=>{

    const userId = getId()
    let connection = ws.accept(null,ws.origin)
    console.log(userId);
    connection.send(JSON.stringify({"id":userId ,}))
    id.push(userId)

    iread = clients.length == 3 ? true : false
    //message
    connection.on("message",(data)=>{
        const message = JSON.parse(data.utf8Data)
        if(message.join)
        {
            //join room
            clients.push({"client":connection , "id":userId,"room":message.join})
            // console.log(clients);
            if(clients.length > 1)
            {clients.forEach((it)=>{
                if(it.room != "")
                {
                 it.client.send(JSON.stringify({"to":id}))
                }
             })}
        }
        if(message.message)
        {
            console.log(message.join);
            //send user join room to other clients
        //    if(message){
            clients.forEach((it)=>{
                if(it.room == message.join)
                {
                 //    console.log(message.message);
                    it.client.send(data.utf8Data)
                }
             })
        //    }
        }
        if(message.offer)
        {
            console.log("offer start");
            for (let index = 1; index < clients.length; index++) {
                if(clients[index].id == message.users)
                {
                    console.log(clients[index].id+" : "+message.users);
                    clients[index].client.send(data.utf8Data)
                }
            }
        }
        if(message.answer)
        {
            console.log("answer start");
            for (let index = 1; index < clients.length; index++) {
                if(clients[index].id == message.users)
                {
                    console.log(clients[index].id+" : "+message.users);
                    clients[index].client.send(data.utf8Data)
                }
            }
        }
       
        console.log("conn :",clients.length);
        
    })

    //close room
    connection.on("close",(data)=>{
        //remove user from room
        console.log("close :",userId , data);
        clients.splice(clients.indexOf(a => a.id == userId))
        id.splice(id.indexOf(a => a == userId))
        console.log(clients.length);
    })
})

http.listen(port,(req,res)=>{
    console.log('starting server :',port);
})