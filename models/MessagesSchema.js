const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
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
    msg: {
        type : String,
        required: true,
    },
    
}, {
    timestamps: true
});


const WhatsAppMessages = mongoose.model('WhatsAppMessages', MessagesSchema);

module.exports = WhatsAppMessages