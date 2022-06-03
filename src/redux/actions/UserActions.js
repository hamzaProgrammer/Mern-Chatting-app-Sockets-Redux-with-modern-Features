import {
    signInUser,
    showProfPicSetting,
    showProfInSearchSetting,
    anyOneCanSendReq,
    updateUserPic,
    updateUserProfDet,
    getAllFreindsOfUser,
    getMatchedFreinds,
    getFreindDetails,
    deleteAllChatBetUsers,
    getAllChatBetUsers,
    deleteSingleMsg,
    updateLastSeen,
    activeNow,
    sendUserNewMsg,
    setMsgsNotificationCount
} from '../../server_api/Api'
import {
    loginStart,
    loginSuccess,
    loginFailure,
    showProfPicSuccess,
    userActionsFailure,
    showHideProfWhileSearchSuccess,
    canAnyOneSendMeRequest,
    updateUserProfPic,
    updateUserProfDeatils,
    assignAllFriendsOfUser,
    hideFriendsSec,
    showFriendsSec,
    showFriendsOnSearch,
    hideMyChatSecreen,
    showMyChatSecreen,
    getCrntFriendOrUser,
    getChatBetTwoUsers,
    getChatFailure,
    deleteSingleMesg,
    deleteAllChat,
    logout,
    moveOnlineFriendsToTop,
    moveOutOflineFriendToBottom,
    updateLastSeenOfCrntUser,
    updateLastSeenOfOtherUsers,
    updateActiveNowOfCurntUser,
    updateActiveOfUser,
    addNewMesgOnSending,
    addNewMesg,
    addMesgToNotifications,
    setMesgToNotifications,
    sendConnectRequest,
    newOne
} from '../reducers/UsersReducers'

// sockets implementation
import io from 'socket.io-client';
var connectionOptions =  {
    "force new connection" : true,
    "reconnectionAttempts": "Infinity",
    "timeout" : 10000,
    "transports" : ["websocket"]
};
const socket = io.connect('http://localhost:8080',connectionOptions);



// logging in
export const LoginUser = (userData) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await signInUser(userData);
        if(data?.success === true){
            dispatch(loginSuccess(data?.myResult))
        }else{
            dispatch(loginFailure(data?.message))
        }
    }catch (error) {
        dispatch(loginFailure(error))
    }
}

// show/hide profile pic to strangers status
export const showProfPicToStrangersFunc = (id) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await showProfPicSetting(id);
        if(data?.success === true){
            dispatch(showProfPicSuccess(data?.newStatus))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// show/hide profile while searching
export const showProfWhileSearch = (id) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await showProfInSearchSetting(id);
        if(data?.success === true){
            dispatch(showHideProfWhileSearchSuccess(data?.newStatus))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// can any one send request
export const canAnyOneSendRequest = (id) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await anyOneCanSendReq(id);
        if(data?.success === true){
            dispatch(canAnyOneSendMeRequest(data?.newStatus))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// update user profile pic
export const updateMyProfPic = (userData, id) => async (dispatch) => {
    let formData = new FormData();
    formData.append("profilePic", userData )

    dispatch(loginStart())
    try{
        const {data} = await updateUserPic(formData,id);
        if(data?.success === true){
            dispatch(updateUserProfPic(data?.newPic))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// update user profile data
export const updateMyProfData = (userData, id) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await updateUserProfDet(userData,id);
        if(data?.success === true){
            dispatch(updateUserProfDeatils({name : data?.name , status : data?.status}))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// assigning all friends of a user
export const getMyAllFriends = (id) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await getAllFreindsOfUser(id);
        console.log("data got frinds in user actions : ", data)
        if(data?.success === true){
            dispatch(assignAllFriendsOfUser(data?.AllFriends))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// hide friends section
export const hideMyFriendsSec = () => async (dispatch) => {
    try{
        dispatch(hideFriendsSec())
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// show friends section
export const showMyFriendsSec = () => async (dispatch) => {
    try{
        dispatch(showFriendsSec())
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// get all matching friends
export const getAllMatchingFreinds = (text, id) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await getMatchedFreinds(text, id);
        console.log("data got : ", data)
        let Strangers = data?.Strangers
        let AllMsgs = data?.AllMsgs
        let Freinds = data?.Freinds
        if(data?.success === true){
            dispatch(showFriendsOnSearch({Strangers, AllMsgs, Freinds }))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// show chat screen
export const shoeChatScreen = () => async (dispatch) => {
    try{
        dispatch(showMyChatSecreen())
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// hide chat screen
export const hideChatScreen = () => async (dispatch) => {
    try{
        dispatch(hideMyChatSecreen())
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// getting current friend or user
export const getCrntUserOrFriend = (id) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await getFreindDetails(id);
        if(data?.success === true){
            dispatch(getCrntFriendOrUser(data?.User))
        }else{
            dispatch(userActionsFailure(data?.message))
        }
    }catch (error) {
        dispatch(userActionsFailure("Some Server Side Error"))
    }
}

// getting chat between two friend or user
export const getMyChatBetTwoUsers = (senderId,recieverId) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await getAllChatBetUsers(senderId,recieverId);
        if(data?.success === true){
            console.log("data of chats : ", data?.AllMsgs[0]?.allMsgs)
            dispatch(getChatBetTwoUsers(data?.AllMsgs[0]?.allMsgs))
        }else{
            dispatch(getChatFailure(data?.message))
        }
    }catch (error) {
        console.log("error in getMyChatBetTwoUsers : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

// deleting any message
export const deleteMyMsg = (userId,msgId) => async (dispatch) => {
    //dispatch(loginStart())
    try{
        const {data} = await deleteSingleMsg(userId,msgId);
        if(data?.success === true){
            dispatch(deleteSingleMesg(msgId))
        }else{
            dispatch(getChatFailure(data?.message))
        }
    }catch (error) {
        console.log("error in deleteMyMsg : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

// deleting all messages between two users
export const deleteMyAllMsgs = (senderId,recieverId) => async (dispatch) => {
    dispatch(loginStart())
    try{
        const {data} = await deleteAllChatBetUsers(senderId,recieverId);
        console.log("res : ", data)
        if(data?.success === true){
            dispatch(deleteAllChat())
        }else{
            dispatch(getChatFailure(data?.message))
        }
    }catch (error) {
        console.log("error in deleteMyAllMsgs : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

// logout
export const logMeout = () => async (dispatch) => {
    dispatch(loginStart())
    try{
        dispatch(logout())
    }catch (error) {
        console.log("error in logMeout : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

// moving online frinds to top
export const assignOnlineFreinds = (allUsers) => async (dispatch) => {
    dispatch(loginStart())
    try{
        console.log("assignOnlineFreinds in user Actions : ", allUsers)
        dispatch(moveOnlineFriendsToTop(allUsers))
    }catch (error) {
        console.log("error in assignOnlineFreinds : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

// moving out ofline friends to bottom
export const assignOflineFreinds = (userId) => async (dispatch) => {
    dispatch(loginStart())
    try{
        console.log("assignOflineFreinds : assignOflineFreinds")
        dispatch(moveOutOflineFriendToBottom(userId))
    }catch (error) {
        console.log("error in assignOflineFreinds : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

//  updating last seen of current user
export const updateMyLastSeen = (id, lastSeen) => async (dispatch) => {
    dispatch(loginStart())
    console.log("last seen updating")
    try{
        const {data} = await updateLastSeen(id, lastSeen);
        if(data.success === false){
            dispatch(getChatFailure(data?.message))
        }else{
            dispatch(updateLastSeenOfCrntUser(data?.LastSeen))
        }
    }catch (error) {
        console.log("error in updateMyLastSeen : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

//  updating last seen of other user
export const updateLastSeenOfOthers = (user) => async (dispatch) => {
    let newUser = user;
    const d = new Date();
    newUser.lastSeen = d
    console.log("going to call updateLastSeenOfOthers in actions", newUser.name, d)
    dispatch(loginStart())
    try{
        dispatch(updateLastSeenOfOtherUsers(newUser))
    }catch (error) {
        console.log("error in updateLastSeenOfOthers : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

//  updating active now
export const ActiveNowUser = (id) => async (dispatch) => {
    dispatch(loginStart())
    console.log("activing now")
    try{
        const {data} = await activeNow(id);
        if(data?.success === true){
            dispatch(updateActiveNowOfCurntUser())
        }else{
            dispatch(getChatFailure("Some Server Side Error"))
        }
    }catch (error) {
        console.log("error in ActiveNowUser : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

//  updating curent user in other active users
export const updateCurntUserInOtherUsers = (user) => async (dispatch) => {
    console.log("going to call updateCurntUserInOtherUsers in actions", user)
    dispatch(loginStart())
    try{
        dispatch(updateActiveOfUser(user))
    }catch (error) {
        console.log("error in updateCurntUserInOtherUsers : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

//  sending new message and appending that
export const sendNewMsg = (msgData) => async (dispatch) => {
    console.log("going to call sendNewMsg in actions", msgData)
    const myObj = {
        senderId : msgData?.senderId,
        recieverId : msgData?.recieverId,
        msg : msgData?.msg
    }
    try{
        const {data} = await sendUserNewMsg(myObj);
        console.log("data?.NewMsg: ", data?.NewMsg)
        if(data?.success === true){
            let newMsgBody = {
                MsgId : data?.NewMsg._id,
                MsgText : data?.NewMsg.msg,
                sender : data?.NewMsg?.senderId,
                reciever : data?.NewMsg?.recieverId,
                createdAt : data?.NewMsg?.createdAt
            }
            dispatch(addNewMesgOnSending(newMsgBody))
            socket.emit("sendMsg", newMsgBody);
        }else{
            dispatch(sendConnectRequest(data?.message))
        }
    }catch (error) {
        console.log("error in sendNewMsg : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

//  sappend new message for receiver
export const sendNewForReceiver = (msgData) => async (dispatch) => {
    //dispatch(loginStart())
    try{
        dispatch(addNewMesgOnSending(msgData))
        //dispatch(addNewMesg(msgData))
    }catch (error) {
        console.log("error in sendNewForReceiver : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

//  append new message for sender
export const appendSenderMsgs = (msgData) => async (dispatch) => {
    dispatch(loginStart())
    try{
        dispatch(addNewMesg(msgData))
    }catch (error) {
        console.log("error in appendSenderMsgs : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

// add new msg notifications
export const addNewNotification = (notificationData) => async (dispatch) => {
    console.log("notificationData in actions : ", notificationData)
    try{
        dispatch(addMesgToNotifications(notificationData))
    }catch (error) {
        console.log("error in appendSenderMsgs : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}

// set notifications count as 0
export const setMyMsgNotification = (id) => async (dispatch) => {
    console.log("setMyMsgNotification :", id)
    try{
        const {data} = await setMsgsNotificationCount(id);
        console.log("data :", data)
        if(data?.success === true){
            dispatch(setMesgToNotifications())
        }else{
            dispatch(getChatFailure("Some Server Side Error"))
        }
    }catch (error) {
        console.log("error in setMyMsgNotification : ", error)
        dispatch(getChatFailure("Some Server Side Error"))
    }
}