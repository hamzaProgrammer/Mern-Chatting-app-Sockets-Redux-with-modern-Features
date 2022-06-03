const axios = require('axios');

const API = axios.create({
    baseURL: 'http://localhost:8080'
    //baseURL: ' https://oturq-trading-app.herokuapp.com'
});

// this is for using local storage in headers, otherwise it will not work
API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    return req;
});


// Users Routes
const signInUser = (data) => API.post(`/api/users/signin`, data);
const signUpUser = (data) => API.post(`/api/users/signup`, data);
const showProfPicSetting = (id) => API.put(`/api/users/shoeHideProfPicToStrangers/${id}`,);
const showProfInSearchSetting = (id) => API.put(`/api/users/shoeHideProfWhileSearch/${id}`);
const anyOneCanSendReq = (id) => API.put(`/api/users/canStrangersSendReq/${id}` );
const updateUserPic = (data, id) => API.put(`/api/users/updateProfilePic/${id}`, data );
const updateUserProfDet = (data, id) => API.put(`/api/users/updateProfileData/${id}`, data );
const getMyNotifications = (id) => API.get(`/api/users/getUserNotifications/${id}` );
const deleteNotification = (senderId, recieverId) => API.put(`/api/users/removeAnyNotification/${senderId}/${recieverId}` );
const acceptNotification = (senderId, recieverId) => API.put(`/api/users/addUserToFriendList/${senderId}/${recieverId}` );
const getAllFreindsOfUser = (id) => API.get(`/api/users/getAllFriends/${id}` );
const getMatchedFreinds = (text, id) => API.get(`/api/users/getMatchedUsers/${id}/${text}` );
const getFreindDetails = (id) => API.get(`/api/users/getUserDetailsForChat/${id}` );
const addRemoveToFreindList = (senderId, recieverId) => API.put(`/api/users/addUserToFriendList/${senderId}/${recieverId}`);
const addRemoveToBlockList = (senderId, recieverId) => API.put(`/api/users/blockAnyUser/${senderId}/${recieverId}`);
const updateLastSeen = (id, lastSeen) => API.put(`/api/users/changeLastSeen/${id}/${lastSeen}`);
const activeNow = (id) => API.put(`/api/users/changeActiveNow/${id}`);
const getUser = (id) => API.get(`/api/users/getMsgSenderInfo/${id}`);
const addMsgNotifications = (data) => API.put(`/api/users/addMsgNotification`, data);
const setMsgsNotificationCount = (id) => API.put(`/api/users/setMsgNotification/${id}`);



// Conversation Routes
const deleteAllChatBetUsers = (senderId,recieverId) => API.delete(`/api/conversations/deleteAnyConversation/${senderId}/${recieverId}` );
const getAllChatBetUsers = (senderId,recieverId) => API.get(`/api/conversations/getSingleUser/${senderId}/${recieverId}` );
const deleteSingleMsg = (userId,msgId) => API.delete(`/api/messages/deleteSingleMsg/${userId}/${msgId}`);
const getMatchedMsgs = (senderId,receiverId,text) => API.get(`/api/messages/getAllMatchedMsgs/${senderId}/${receiverId}/${text}`);
const sendUserNewMsg = (data) => API.post(`/api/messages/addNew`, data);



module.exports = {
    signUpUser,
    signInUser,
    showProfPicSetting,
    showProfInSearchSetting,
    anyOneCanSendReq,
    updateUserPic,
    updateUserProfDet,
    getMyNotifications,
    deleteNotification,
    acceptNotification,
    getAllFreindsOfUser,
    getMatchedFreinds,
    getFreindDetails,
    deleteAllChatBetUsers,
    getAllChatBetUsers,
    deleteSingleMsg,
    addRemoveToFreindList,
    addRemoveToBlockList,
    getMatchedMsgs,
    updateLastSeen,
    activeNow,
    sendUserNewMsg,
    getUser,
    addMsgNotifications,
    setMsgsNotificationCount
}