const express = require('express');
const router = express.Router();
const {
    addNewConversation,
    getAllChatsBetweenTwoUsers,
    getAllMatchedBetTwoUsers,
    deleteAnyConversation
} = require('../controllers/ConversationControllers')

// add new conversation
router.post('/api/conversations/addNew', addNewConversation)

// geting all converstions of user
router.get('/api/conversations/getSingleUser/:senderId/:recieverId', getAllChatsBetweenTwoUsers)

// geting matched messages
router.put('/api/conversations/getMatchedMsgs/:senderId/:recieverId', getAllMatchedBetTwoUsers)

// deleting conversation
router.delete('/api/conversations/deleteAnyConversation/:senderId/:recieverId', deleteAnyConversation)

module.exports = router;