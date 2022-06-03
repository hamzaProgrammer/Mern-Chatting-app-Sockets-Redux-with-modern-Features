
import 'antd/dist/antd.css';
import {notification} from 'antd';
import { Routes , Route} from 'react-router-dom'
import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {assignOnlineFreinds, assignOflineFreinds , updateMyLastSeen , updateLastSeenOfOthers , ActiveNowUser , updateCurntUserInOtherUsers , sendNewForReceiver , addNewNotification} from './redux/actions/UserActions'
import {getUser, addMsgNotifications} from './server_api/Api'

// Home Page
import Home from './pages/home/Home'

// Sign in
import SignIn from './pages/signin/SignIn'

// Sign Up
import SignUp from './pages/signUp/SignUp'
import './App.css';

// sockets implementation
import io from 'socket.io-client';
var connectionOptions =  {
  "force new connection" : true,
  "reconnectionAttempts": "Infinity",
  "timeout" : 10000,
  "transports" : ["websocket"]
};
const socket = io.connect('http://localhost:8080',connectionOptions);



function App() {
    const dispatch = useDispatch();
    const {errMsg, userSignInSuccess ,currentUser ,currentFriend } = useSelector(state => state.usersReducer);

    useEffect(() => {
        if(userSignInSuccess === true){
            console.log("sent an event")
            socket.emit("checkFriend", currentUser )
            openNotification("success" , "Sign In SuccessFull")
        }
        if(errMsg !== ""){
            openNotification("error" , errMsg)
        }
    },[userSignInSuccess,errMsg])

    const openNotification = (type, msg) => {
        notification[type]({
            message: msg,
        });
    };

    const msgNotification = (type, msg) => {
        notification[type]({
            message: msg,
        });
    };

    const msgNotificationOne = (type, msg, desc) => {
        notification[type]({
            message: msg,
            description : desc
        });
    };

    // for last seen of user and also checking if tab is active or not
    useEffect(() => {
          window.onfocus = () => {
                // for removing ofline friend to top of friends list
                if(currentUser !== null){
                  dispatch(ActiveNowUser(currentUser?._id), dispatch)
                  socket.emit("updateMyLastSeenToOthers", currentUser);
                }
          }

          window.onblur = () => {
              const d = new Date();
              console.log("Tab is blurred or unFocused on : ", d);
              if(currentUser !== null){
                dispatch(updateMyLastSeen(currentUser._id , d), dispatch);
                socket.emit("updateMyLastSeen", currentUser);
              }
          };
    }, []);

    // all catch events of emit
    useEffect(() => {
        // event which trigers when user connection becomes connected
        socket.on('connect', function() {
          if(currentUser !== null){
            dispatch(ActiveNowUser(currentUser?._id), dispatch);
            socket.emit("updateMyLastSeenToOthers", currentUser);
            console.log("Successfully connected! using connect event");
          }
        });

        // CLIENT CODE
        socket.on('disconnect', function(){
            console.log("disconnect event caught in client side")
        });

        // updating last seen of current user's friends
        socket.on("updateFriendStatus", (data) => {
          console.log("updateFriendStatus caught : ", data)
          dispatch(updateLastSeenOfOthers(data), dispatch);
        })

        // successfull connection
        socket.on("connectionSuccessfull", () => {
            console.log("connectionSuccessfull notifications showing")
            openNotification("success", "From Sockets Connection SuccessFull")
            //dispatch(ActiveNowUser(currentUser?._id), dispatch);
        })

        // updating last seen
        socket.on("updateMyActiveStatus", (data) => {
            console.log("updateMyActiveStatus : ", data)
            dispatch(updateCurntUserInOtherUsers(data), dispatch);
        })

        // updating active status to every friend online
        socket.on("getMyActiveStatus", (data) => {
            console.log("getMyActiveStatus : ", data)
            dispatch(updateCurntUserInOtherUsers(data), dispatch);
        })

        // for adding new online friend to top of friends list
        socket.on("onlineFriends", (data) => {
            console.log("data freind of online friends : ", data)
            dispatch(assignOnlineFreinds(data), dispatch);
        })

        // for removing ofline friend to top of friends list
        socket.on("RemoveOnlineFriend", (data) => {
            console.log("event of offline is caught", data)
            dispatch(assignOflineFreinds(data), dispatch);
        })

        // for receiving message
        socket.on("updateCurrentMessages", async (myData) => {
          console.log("myData : ", myData , " currentFriend._id :", currentFriend._id)
            if(myData?.sender === currentFriend._id ){
              console.log("got in if" , myData)
                dispatch(sendNewForReceiver(myData), dispatch)
            }else{
                const isPresent = currentUser?.friends.find(item => item._id === myData?.sender )
                console.log("isPresent : ", isPresent)
                if(isPresent){
                  const {data} = await getUser(myData?.sender);
                  console.log("got in else")
                  if(data?.success === true){
                      let NotifiBody = {
                          reciever : myData?.reciever,
                          sender : myData?.sender,
                          msg : myData?.MsgText
                      }
                      const notiResponse = await addMsgNotifications(NotifiBody);
                      console.log("data?.newlyNotification: ",notiResponse?.data?.newlyNotification)
                      if(notiResponse?.data?.success === true){
                        console.log("dispatching...")
                          dispatch(addNewNotification(notiResponse?.data?.newlyNotification), dispatch);
                          msgNotificationOne("success", `New Message Received from ${notiResponse?.data?.newlyNotification?.Name}` , `${notiResponse?.data?.newlyNotification?.msg}`)
                      }else{
                        msgNotification("error", `Some error Occurred` )
                      }

                  }
                }
            }
        })
    },[])

  return (
    <>
        <Routes>
            <Route exact path="/"
              element={
                userSignInSuccess ? <Home/> : <SignIn/>
              }
            />

            <Route exact path="/signin"
              element={
                userSignInSuccess ? <Home/> : <SignIn/>
              }
            />

            <Route exact path="/signup"
              element={
                userSignInSuccess ? <Home/> : <SignUp/>
              }
            />

        </Routes>
    </>
  );
}

export default App;
