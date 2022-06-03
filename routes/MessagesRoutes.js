const express = require('express');
const router = express.Router();
const {
    addNewMsg,
    deleteSingeleMsg,
    getAllMatchedMsgs
} = require('../controllers/MessagesControllers')

// add new message
router.post('/api/messages/addNew', addNewMsg)

// delete any mesage of a user
router.delete('/api/messages/deleteSingleMsg/:userId/:msgId', deleteSingeleMsg)

// dget all matched messages
router.get('/api/messages/getAllMatchedMsgs/:senderId/:receiverId/:text', getAllMatchedMsgs)

module.exports = router;