const express = require('express')
const cors = require('cors')
const app = express();
const http = require("http")
const {Server} = require("socket.io");
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config({
    path: './config.env'
})
require('./db/conn')
var port = process.env.PORT || 8080;

app.use(bodyParser.json({
    limit: '30mb',
    extended: true
}))
app.use(bodyParser.urlencoded({
    limit: '30mb',
    extended: true
}))
app.use(cors())

app.use(express.static('public'));
app.use('/usersImages', express.static('usersImages'));

app.use(express.json())

// adding routes
app.use(require('./routes/UsersRoutes'))
app.use(require('./routes/ConversationRoutes'))
app.use(require('./routes/MessagesRoutes'))


const server = app.listen(process.env.PORT || 8080, (req, res) => {
    console.log(`Express Server Running at ${port}`)
})

const {updateActiveInActiveUpoTabClose} = require("./controllers/UsersControllers")

const io = require('socket.io')(server, {
    pingTimeout : 60000,
    cors : {
        origin : "http://localhost:3000"
    }
});

// importing apis from server
//import {findIfUserIsCurntUserFreind} from './controllers/UsersControllers'

var yourFriendsOnline = [];

// socket code implementation
io.on('connection', (socket) => {

    socket.on('reconnect', () => {
        console.log("socket Id : ",socket.id)
    } ); // connection restored

    // checking if new user has friends online
    socket.on("checkFriend", (newUser) => {
        addNewUser(newUser, socket)
    });

    // updating last seen of in all online friends
    socket.on("updateMyLastSeen", (newUser) => {
        if(newUser){
            //console.log("updateMyLastSeen event caught in server", newUser.lastSeen)
            updateLastSeenToEveryOne(newUser)
        }
    });

    // updating last seen of in all online friends
    socket.on("updateMyLastSeenToOthers", (newUser) => {
        if(newUser){
            console.log("updateMyLastSeenToOthers event caught in server", newUser._id)
            updateLastSeenToOthers(newUser)
        }
    });

    // catching event when user logs out
    socket.on("disconnectUser", (newUser) => {
        removeOfflineUser(newUser)
    });

    // sending message
    socket.on("sendMsg", (msgBody) => {
        console.log("msgBody: ",msgBody)
        sendMessageTpReceiver(msgBody)
    });

    // removing user from active users' list when disconnected
    socket.on('disconnect',  async () => {
        // delete yourFriendsOnline[socket.id];
        // const gotUser = yourFriendsOnline.find(item => item.socketId === socket.id);
        // console.log("gotUser.name : ", gotUser , " socket.id : ",socket.id)
        // if(gotUser !== undefined){
        //     console.log("gotUser : ", gotUser.user.name)
        //     io.to(gotUser.socketId).emit("updateFriendStatus", gotUser.user);
        //     await updateActiveInActiveUpoTabClose(gotUser.user._id)
        // }
        // const newArr = yourFriendsOnline.filter(item => item.socketId !== socket.id);
        // yourFriendsOnline = newArr;
    });

});


// adding new user
const addNewUser = (newUser, socket) => {
    const idExist = yourFriendsOnline.find(item => item.user._id === newUser._id);
    if(idExist === undefined){
        let onlineFriendsArr = [];
        for(let i = 0; i !== yourFriendsOnline.length; i++){
            //console.log("newUser.friends : ",newUser.friends[i])
            let isFriendOnline = newUser.friends.find(item => item === yourFriendsOnline[i].user._id);
            if(isFriendOnline !== undefined){
                onlineFriendsArr.push({user : yourFriendsOnline[i].user, socketId : yourFriendsOnline[i].socketId })
            }
        }
        if(onlineFriendsArr.length > 0){
            for(let i = 0; i !== onlineFriendsArr.length; i++){
                //console.log("emitting event now to : ", onlineFriendsArr[i].socketId);
                io.to(onlineFriendsArr[i].socketId).emit("onlineFriends", newUser)
            }
        }
        yourFriendsOnline.push({user : newUser, socketId : socket.id });
        const checkIndex = yourFriendsOnline.find(item => item.user._id === newUser._id );
        //console.log("checkIndex : ", checkIndex)
        if(checkIndex){
            io.to(checkIndex.socketId).emit("connectionSuccessfull", "Connection SuccessFull");
        }
    }else{
        yourFriendsOnline.filter(item => item.user._id === newUser._id && (item.socketId = socket.id) );
    }
    for(let i = 0; i !== yourFriendsOnline.length; i++){
        console.log("outer yourFriendsOnline: ", yourFriendsOnline[i].socketId)
    }

    // emitting event
    console.log("adding newUser._id : ",newUser._id ," yourFriendsOnline : ",yourFriendsOnline.length)
    const isExistArr = yourFriendsOnline.filter(item => item.user._id !== newUser._id);
    if(isExistArr !== undefined){
        for(let i =0; i !== isExistArr.length; i++){
            let ispreset = newUser.friends.find(item => item._id === isExistArr[i].user._id);
            if(ispreset !== undefined ){
                const mySocket = yourFriendsOnline.find(item => item.user._id === ispreset._id);
                let sId = mySocket.socketId;
                io.to(sId).emit("updateMyActiveStatus" , newUser )
            }
        }
    }
}

// removing user
const removeOfflineUser = async (newUser) => {
    console.log("got suer : ", newUser)
    for(let i = 0; i !== yourFriendsOnline.length; i++){
        let isFriendOnline = newUser.friends.find(item => item === yourFriendsOnline[i].user._id);
        console.log( " newUser.friends : ",newUser.friends[i])
        if(isFriendOnline !== undefined){
            console.log("remove enet if going to be sent on : ")
            io.to(yourFriendsOnline[i].socketId).emit("RemoveOnlineFriend", newUser)
        }
    }

    // moving user from online friends
    let newArr = yourFriendsOnline.filter(item => item.user._id !== newUser._id);
    yourFriendsOnline = newArr;

    console.log("yourFriendsOnline after removing: ",yourFriendsOnline)
}

// updating last seen to everyone
const updateLastSeenToEveryOne = (newUser) => {
    //console.log("newUser._id : ",newUser._id ," yourFriendsOnline : ",yourFriendsOnline.length)
    const isExistArr = yourFriendsOnline.filter(item => item.user._id !== newUser._id);
    if(isExistArr !== undefined){
        for(let i =0; i !== isExistArr.length; i++){
            let ispreset = newUser.friends.find(item => item._id === isExistArr[i].user._id);
            const mySocket = yourFriendsOnline.find(item => item.user._id === ispreset._id);
            let rr = newUser;
            let sId = mySocket.socketId;
            if(ispreset !== undefined ){
                io.to(sId).emit("updateFriendStatus" , rr )
            }
        }
    }
}

// updating last seen to everyone
const updateLastSeenToOthers = (newUser) => {
    //console.log("newUser._id : ",newUser._id ," yourFriendsOnline : ",yourFriendsOnline.length)
    const isExistArr = yourFriendsOnline.filter(item => item.user._id !== newUser._id);
    if(isExistArr !== undefined){
        for(let i =0; i !== isExistArr.length; i++){
            let ispreset = newUser.friends.find(item => item._id === isExistArr[i].user._id);
            const mySocket = yourFriendsOnline.find(item => item.user._id === ispreset._id);
            let sId = mySocket.socketId;
            console.log("mySocket.socketId : ",sId)
            if(ispreset !== undefined ){
                console.log("emitting now");
                io.to(sId).emit("getMyActiveStatus" , newUser )
            }
        }
    }
}

// sending message to current user
const sendMessageTpReceiver = (msgBody) => {
    const isExistArr = yourFriendsOnline.find(item => item.user._id === msgBody.reciever);
    if(isExistArr !== undefined){
        io.to(isExistArr.socketId).emit("updateCurrentMessages" , msgBody )
    }
}