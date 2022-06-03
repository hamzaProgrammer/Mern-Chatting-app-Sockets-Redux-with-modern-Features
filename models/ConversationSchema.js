const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema({
    senderId: {
        type : mongoose.Types.ObjectId,
        ref : 'whatsappusers',
        required: true,
    },
    recieverId: {
        type : mongoose.Types.ObjectId,
        ref : 'whatsappusers',
        required: true,
    },
    allMsgs: [{
        type : mongoose.Types.ObjectId,
        ref : 'whatsappmessages',
    }],
    latestMsg: {
        type : mongoose.Types.ObjectId,
        ref : 'whatsappmessages',
    },
    }, {
        timestamps: true
    }
);


const WhatsAppConversation = mongoose.model('WhatsAppConversation', ConversationSchema);

module.exports = WhatsAppConversation