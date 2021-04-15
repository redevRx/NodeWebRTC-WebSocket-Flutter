
let wss = new WebSocket("ws://192.168.1.42:3000")
const { RTCPeerConnection, RTCSessionDescription } = window;

let isAlreadyCalling = false;
let getCalled = false;
let users = []
let myId = []
turnConfig = {
    iceServers: [{   urls: [ "stun:bn-turn1.xirsys.com" ]}, {   username: "0kYXFmQL9xojOrUy4VFemlTnNPVFZpp7jfPjpB3AjxahuRe4QWrCs6Ll1vDc7TTjAAAAAGAG2whXZWJUdXRzUGx1cw==",   credential: "285ff060-5a58-11eb-b269-0242ac140004",   urls: [       "turn:bn-turn1.xirsys.com:80?transport=udp",       "turn:bn-turn1.xirsys.com:3478?transport=udp",       "turn:bn-turn1.xirsys.com:80?transport=tcp",       "turn:bn-turn1.xirsys.com:3478?transport=tcp",       "turns:bn-turn1.xirsys.com:443?transport=tcp",       "turns:bn-turn1.xirsys.com:5349?transport=tcp"   ]}]
}

const peerConnection = new RTCPeerConnection(turnConfig);

function myCall()
{
  callUser()
}

wss.onopen =  function () {
   console.log('connected');
   wss.send(JSON.stringify({"join":"test","message":"IO"}))
}
wss.onerror = function (e) { console.log(e); }
//Sending bye if user closes the window

wss.onclose = function (e) { console.log('closed' + e); }
wss.onmessage =  function (ms) 
{
    // console.log(ms.data);
    const message = JSON.parse(ms.data)
    if(message.offer)
    { 
      console.log("offer :",message.offer);
      onSendAnswer(message)
      getCalled = true
    }
     //acceept answer
     if(message.answer)
     {
       console.log("answer");
      onAnswer(message)
     }
    if(message.id)
    {
      console.log("id");
      myId = message.id
      console.log(myId);
    }
    if(message.to)
    {
      console.log("to");
     for (let index = 0; index < message.to.length; index++) {
       if(message.to[index] != myId)
       {
         users.push(message.to[index])
       }
     }
     console.log(users);
    }
    if(message.join)
    {
      console.log("join");
      //open local camera
        getLocalVideo()
      //  await callUser()
    }
}


 function onAnswer(message){
   peerConnection.setRemoteDescription(
    new RTCSessionDescription(message.answer)
  ).then((_)=>{

  }).catch((e)=>{

  })

  if (!isAlreadyCalling) {
    callUser()
    isAlreadyCalling = true
    // wss.send(JSON.stringify({"id":users}))
  }
}
 function onSendAnswer(message){
  //  console.log("on start send answer");
   //connection to webrtc
    peerConnection.setRemoteDescription(
    new RTCSessionDescription(message.offer)
  )
  //
   peerConnection.createAnswer().then((answer)=>{
    peerConnection.setLocalDescription(new RTCSessionDescription(answer))
     //send answer
    //  console.log("sending answer");
     wss.send(JSON.stringify({"answer":answer,"users":users}))
  })
  //
}


//
let call = document.querySelector("#call")
let remoteCall = document.querySelector("#remoteCall")

peerConnection.ontrack = function({ streams: [stream] }) {
  if (remoteCall) {
    remoteCall.srcObject = stream;
  }
 };

const getLocalVideo = ()=>{
    //get video
if(navigator.mediaDevices.getUserMedia)
{
    //
    navigator.mediaDevices.getUserMedia({ video: true }).then((st)=>{
        call.srcObject = st
        st.getTracks().forEach(track => peerConnection.addTrack(track , st))
        // call.play()
    }).catch((e)=>{
        console.log(e);
    })
}
}

//web rtc
// webRTc = new RTCPeerConnection(turnConfig)

 function callUser() {
   peerConnection.createOffer().then((offer)=>{
    peerConnection.setLocalDescription(new RTCSessionDescription(offer));
    wss.send(JSON.stringify({"offer":offer,"users":users}))
   })

  // socket.emit("call-user", {
  //   offer,
  //   to: socketId
  // });
 }
