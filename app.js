const express = require("express")
const app = express()
const cors = require("cors")
const bodyParser = require("body-parser")
const http = require('http')
const WebSocket = require("ws")

const server = http.createServer(app)
const wss = new WebSocket.Server({server:server})

//env
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
const port = 3000

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '--_--' + s4();
  };


  wss.on('connection',ws=>{
    ws.room=[];

    ws.send(JSON.stringify({msg:"user joined"}));
    console.log('connected :',ws.client);

    //data
    ws.on('message', message=>{
        console.log(wss.clients);
        console.log(wss.clients.room);
    console.log('message: ',message);
    //try{
    var messag= JSON.parse(message);
    //}catch(e){console.log(e)}
    if(messag.join){ws.room.push(messag.join)}
    if(messag.room){broadcast(message);}
    // if(messag.msg){console.log('message: ',messag.msg)}
    })
    
    ws.on('error',e=>console.log(e))
    ws.on('close',(e)=>console.log('websocket closed'+e))
    
    })
    
    function broadcast(message){
    wss.clients.forEach(client=>{
    if(client.room.indexOf(JSON.parse(message).room)>-1){
    client.send(JSON.parse(message).msg)
    }
    })
    }

//
server.listen(port,(req,res)=>{
    console.log("start ",port);
})
