const express = require('express');
const router = express.Router();
const {
    addNewUser,
    LogInUser,
    getAllFreinds,
    acceptReqOfUser,
    blockUser,
    deleteNotification,
    showOrHideProfilePic,
    showOrHideProfileWhileSearch,
    anyOneSendReqWhileSearching,
    updateProfilePic,
    getProfilePic,
    updateProfileData,
    getProfileData,
    getAllNotifications,
    getUserNamePicAndNameForChat,
    getAllMatchedUsers,
    getUserNotifications,
    updateLastSeen,
    updateActiveInActive,
    getMsgSenderInfo,
    addMsgNotification,
    setMsgNotification
} = require('../controllers/UsersControllers')
const multer = require("multer")
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './usersImages/')
        //cb(null, '../products')
    },
    filename: function (req, file, cb) {
        cb(null, 'userImage-' + Date.now() + file.originalname)
    }
})
const upload = multer({
    storage: storage,
});


// Sign Up user
router.post('/api/users/signup', addNewUser)

// Sign in user
router.post('/api/users/signin', LogInUser)

// getting all friends of a user
router.get('/api/users/getAllFriends/:id', getAllFreinds)

// adding user to friend list
router.put('/api/users/addUserToFriendList/:senderId/:recieverId', acceptReqOfUser)

// block any user
router.put('/api/users/blockAnyUser/:senderId/:recieverId', blockUser)

// remove nay single notification
router.put('/api/users/removeAnyNotification/:senderId/:recieverId', deleteNotification)

// show/hide profile pic to strangers
router.put('/api/users/shoeHideProfPicToStrangers/:id', showOrHideProfilePic)

// show/hide profile strangers while searching
router.put('/api/users/shoeHideProfWhileSearch/:id', showOrHideProfileWhileSearch)

// can strangers send request while searching
router.put('/api/users/canStrangersSendReq/:id', anyOneSendReqWhileSearching)

// updating profile picture of a user
router.put('/api/users/updateProfilePic/:id', upload.single("profilePic"), updateProfilePic)

// getting profile pic of a user
router.get('/api/users/getUserprofilePic/:id', getProfilePic)

// updating profile data of a user
router.put('/api/users/updateProfileData/:id', updateProfileData)

// getting profile data of a user
router.get('/api/users/getUserprofileData/:id', getProfileData)

// getting all notifications of a user
router.get('/api/users/getAllNotificationsOfUser/:id', getAllNotifications)

// getting usr details for chat
router.get('/api/users/getUserDetailsForChat/:id', getUserNamePicAndNameForChat)

// getting matched users
router.get('/api/users/getMatchedUsers/:id/:text', getAllMatchedUsers)

// getting notification of user
router.get('/api/users/getUserNotifications/:id', getUserNotifications)

// change last seen of user
router.put('/api/users/changeLastSeen/:id/:lastSeen', updateLastSeen)

// change last seen of user
router.put('/api/users/changeActiveNow/:id', updateActiveInActive)

// get message sender info
router.get('/api/users/getMsgSenderInfo/:id', getMsgSenderInfo)

// send msg notification to receiver
router.put('/api/users/addMsgNotification', addMsgNotification)

// set msg notification to 0
router.put('/api/users/setMsgNotification/:id', setMsgNotification)


module.exports = router;