import { createSlice } from '@reduxjs/toolkit'


const userReducer = createSlice({
    name: "user",
    initialState:{
        currentUser: null,
        currentFriend: null,
        isFetching: false,
        friendFetched: false,
        error: false,
        connectReqSent: false,
        connectReqSentMsg: "",
        userSignInSuccess: false,
        userSignOutSuccess: false,
        userActionSuccess: false,
        showFriendsSec: true,
        showChatScreen: false,
        matchedFriends: [],
        matchedStrangers: [],
        matchedMsgs: [],
        currentFriendErr : false,
        currentChat: [],
        errMsg: "",
        msgNotifiCount: 0,
        deleteMsgSuccess: "",
        allMsgsDelete: false,
    },
    reducers: {
        loginStart: (state, action) => {
            state.isFetching = true;
            state.error = false;
            state.errMsg = ""
            state.currentFriendErr = false
            state.deleteMsgSuccess = ""
            state.allMsgsDelete = false
            state.userSignOutSuccess = false
            state.connectReqSent = false
        },
        loginSuccess: (state, action) => {
            state.isFetching = false
            state.userSignInSuccess = true
            state.currentUser = action.payload
        },
        // show/hide profile pic to starngers
        showProfPicSuccess: (state, action) => {
            state.isFetching = false
            state.userActionSuccess = true
            state.currentUser.showProfPic = action.payload
        },
        // show/hide profile while searching
        showHideProfWhileSearchSuccess: (state, action) => {
            state.isFetching = false
            state.userActionSuccess = true
            state.currentUser.showProfInSearch = action.payload
        },
        // can any one send request
        canAnyOneSendMeRequest: (state, action) => {
            state.isFetching = false
            state.userActionSuccess = true
            state.currentUser.anyOneCanSendReq = action.payload
        },
        // update user profile pic
        updateUserProfPic: (state, action) => {
            state.isFetching = false
            state.userActionSuccess = true
            state.currentUser.profilePic = action.payload
        },
        // update user profile details
        updateUserProfDeatils: (state, action) => {
            state.isFetching = false
            state.userActionSuccess = true
            state.currentUser.name = action.payload.name
            state.currentUser.status = action.payload.status
        },
        // assigning all friends of a user
        assignAllFriendsOfUser: (state, action) => {
            state.isFetching = false
            state.connectReqSent = false
            state.userActionSuccess = true
            state.currentUser.friends = action.payload
        },
        // assigning all online  friends of a user
        moveOnlineFriendsToTop: (state, action) => {
            state.isFetching = false
            state.userActionSuccess = true
            let temp = []
            if(action.payload.length > 0){
                action.payload?.map((item, ind) => (
                    state.currentUser.friends = state.currentUser.friends.filter(myItem => myItem._id !== item._id)
                ))
            }
            let newArr = [action.payload ,state.currentUser.friends]
            console.log("newArr : ", newArr)
            //newArr.concat([...state.currentUser.friends]);
            state.currentUser.friends = newArr
        },
        // assigning all online  friends of a user
        moveOutOflineFriendToBottom: (state, action) => {
            state.isFetching = false
            state.userActionSuccess = true
            state.currentUser.friends.filter(item => item._id !== action.payload)
            state.currentUser.friends.push(action.payload)
        },
        // hide friends section
        hideFriendsSec: (state, action) => {
            state.showFriendsSec = false
            state.connectReqSent = false
        },
        //send conection request
        sendConnectRequest: (state, action) => {
            state.connectReqSent = true
            state.connectReqSentMsg = action.payload
        },
        //send conection request
        newOne: (state, action) => {
            if(action.payload === "New Conversation SuccessFully Started"){
                state.connectReqSent = true
                state.connectReqSentMsg = "Connection Request has been Sent to User."
            }
        },
        // show friends section
        showFriendsSec: (state, action) => {
            state.showFriendsSec = true
            state.connectReqSent = false
        },
        // hide chat screen
        hideMyChatSecreen: (state, action) => {
            state.showChatScreen = false
            state.connectReqSent = false
        },
        // show chat screen
        showMyChatSecreen: (state, action) => {
            state.showChatScreen = true
        },
        // show matching friends on search
        showFriendsOnSearch: (state, action) => {
            state.matchedFriends = action.payload.Freinds
            state.matchedStrangers = action.payload.Strangers
            state.matchedMsgs = action.payload.AllMsgs
            state.friendFetched = true
            state.isFetching = false
            state.connectReqSent = false
        },
        // get current friends/user
        getCrntFriendOrUser: (state, action) => {
            state.isFetching = false
            state.friendFetched = true
            state.currentFriendErr = false
            state.currentFriend = action.payload
            state.connectReqSent = false
        },
        // delete any message
        deleteSingleMesg: (state, action) => {
            state.isFetching = false
            state.currentChat = state.currentChat.filter(chat => chat.MsgId !== action.payload)
            state.deleteMsgSuccess = "Message Deleted SuccessFully"
        },
        // add new message upon sending
        addNewMesgOnSending: (state, action) => {
            state.isFetching = false
            state.connectReqSent = false
            let tt = action.payload;
            console.log("in reducer : educer : ", tt)
            state.currentChat.push(action.payload);
        },
        // add new message into notifications
        setMesgToNotifications: (state, action) => {
            state.isFetching = false
            state.connectReqSent = false
            state.currentUser.msgNotfiCount = 0
        },
        // add new message into notifications
        addMesgToNotifications: (state, action) => {
            state.isFetching = false
            state.currentUser.msgNotifications.push(action.payload);
            state.currentUser.msgNotfiCount += 1
        },
        // add new message upon sending
        addNewMesg: (state, action) => {
            state.isFetching = false
            state.connectReqSent = false
            state.currentChat.push(action.payload)
        },
        // delete all chat message
        deleteAllChat: (state, action) => {
            state.isFetching = false
            state.currentChat = [];
            state.allMsgsDelete = true
        },
        // get chat between two friends/user
        getChatBetTwoUsers: (state, action) => {
            state.isFetching = false
            state.connectReqSent = false
            let pp = action.payload
            console.log("pp in reducer : ", pp)
            if(action.payload !== undefined){
                state.currentChat = action.payload
            }else{
                state.currentChat = []
            }
            state.friendFetched = true
        },
        // update last seen of user
        updateLastSeenOfCrntUser: (state, action) => {
            state.isFetching = false
            state.connectReqSent = false
            state.currentUser.lastSeen = action.payload
            state.currentUser.isActive = false
        },
        // update last seen of other users
        updateLastSeenOfOtherUsers: (state, action) => {
            state.isFetching = false
            state.connectReqSent = false
            const d = new Date();
            for (let i = 0; i < state.currentUser.friends.length; i++) {
                if (state.currentUser.friends[i]._id === action.payload._id){
                    state.currentUser.friends[i].isActive = false;
                    state.currentUser.friends[i].lastSeen = d;
                }
            }
        },
        // update active or inactive state of current user
        updateActiveNowOfCurntUser: (state, action) => {
            state.isFetching = false
            state.currentUser.isActive = true
        },
        // update current user active in other users
        updateActiveOfUser: (state, action) => {
            state.isFetching = false
            for (let i = 0; i < state.currentUser.friends.length; i++) {
                if (state.currentUser.friends[i]._id === action.payload._id){
                    state.currentUser.friends[i].isActive = true;
                }
            }
        },
        userActionsFailure: (state, action) => {
            state.isFetching = false;
            state.userActionSuccess = false
            state.error = true;
            state.errMsg = action.payload
        },
        getChatFailure: (state, action) => {
            state.isFetching = false;
            state.currentFriendErr = true
        },
        loginFailure: (state, action) => {
            state.isFetching = false;
            state.userSignInSuccess = false
            state.userActionSuccess = false
            state.error = true;
            state.errMsg = action.payload
        },
        // logout
        logout: (state, action) => {
            state.currentUser = null
            state.userSignInSuccess = false
            state.isFetching = false;
            state.error = false;
            state.errMsg = ""
            state.currentFriendErr = false
            state.currentFriend = null;
            state.deleteMsgSuccess = ""
            state.allMsgsDelete = false
            state.matchedFriends = []
            state.matchedStrangers = []
            state.matchedMsgs = []
            state.currentChat = []
            state.userSignOutSuccess = true
            state.msgNotifiCount = 0
            state.msgNotifiCount = 0
        },
    }
});


export const { loginStart , loginSuccess , loginFailure, showProfPicSuccess, userActionsFailure, showHideProfWhileSearchSuccess , canAnyOneSendMeRequest , updateUserProfPic , updateUserProfDeatils , assignAllFriendsOfUser , hideFriendsSec , showFriendsSec, showFriendsOnSearch , hideMyChatSecreen , showMyChatSecreen , getCrntFriendOrUser , getChatBetTwoUsers, getChatFailure , deleteSingleMesg , deleteAllChat , logout , moveOnlineFriendsToTop , moveOutOflineFriendToBottom , updateLastSeenOfCrntUser , updateLastSeenOfOtherUsers , updateActiveNowOfCurntUser , updateActiveOfUser , addNewMesgOnSending , addNewMesg , setMesgToNotifications , addMesgToNotifications , sendConnectRequest , newOne } = userReducer.actions;
export default userReducer.reducer;