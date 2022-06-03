const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true,
    },
    email: {
        type : String,
        required: true,
    },
    phoneNo: {
        type : String,
        required: true,
    },
    password: {
        type : String,
        required: true,
    },
    profilePic: {
        type : String,
        default : ''
    },
    codeSentTime: {
        type : String,
        default : ''
    },
    otpCode: {
        type : String,
        default : ''
    },
    status: {
        type : String,
        default : ''
    },
    showProfPic: {
        type : Boolean,
        default : 'true'
    },
    showProfInSearch: {
        type : Boolean,
        default : 'true'
    },
    anyOneCanSendReq: {
        type : Boolean,
        default : 'true'
    },
    lastSeen: {
        type : String,
        default : null
    },
    isActive: {
        type : Boolean,
        default : 'false'
    },
    friends: [{
        type : mongoose.Types.ObjectId,
        ref : 'whatsappusers',
    }],
    blockedUsers: [{
        type : mongoose.Types.ObjectId,
        ref : 'whatsappusers',
    }],
    msgNotfiCount: {
        type : Number,
        default : '0'
    },
    NotfiCount: {
        type : Number,
        default : '0'
    },
    notifications: [],
    msgNotifications : [
        {
            _id : 0,
            Id : {type : String},
            profilePic : {type : String},
            Name : {type : String},
            msg : {type : String},
            date : {type : String},
        }
    ],
}, {
    timestamps: true
});


const WhatsAppUsers = mongoose.model('WhatsAppUsers', UsersSchema);

module.exports = WhatsAppUsers