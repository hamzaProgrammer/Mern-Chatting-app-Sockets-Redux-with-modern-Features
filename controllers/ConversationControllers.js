const Conversations = require('../models/ConversationSchema')
const Messages = require('../models/MessagesSchema')
const mongoose = require("mongoose")



// add new conversation
const addNewConversation = async (req, res) => {
    const { senderId , recieverId } = req.body;
    if (!senderId || !recieverId) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const check = await Conversations.findOne({
            $or : [{senderId: senderId , recieverId : recieverId},{senderId : recieverId , recieverId : senderId }]
        })
        if (check) {
            return res.json({
                success: false,
                message: 'Already in Friend List'
            })
        } else {
                const newConversation = new Conversations({...req.body})
                try {
                    await newConversation.save();

                    res.status(201).json({
                        success: true,
                        message: 'New Conversation SuccessFully Started'
                    })
                } catch (error) {
                    console.log("Error in addNewConversation and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// getting all chats of a user
const getAllChatsBetweenTwoUsers = async (req, res) => {
    const {senderId , recieverId} = req.params
    console.log("senderId , recieverId : ",senderId , recieverId)

    if(!senderId || !recieverId){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            const isExist = await Conversations.aggregate([
                {
                    $match : {
                        $or : [{senderId: mongoose.Types.ObjectId(senderId) , recieverId : mongoose.Types.ObjectId(recieverId) },{senderId: mongoose.Types.ObjectId(recieverId) , recieverId : mongoose.Types.ObjectId(senderId) }]
                    },
                },
                {
                    $lookup: {
                        from: 'whatsappmessages',
                        localField: 'allMsgs',
                        foreignField: '_id',
                        as: 'Msg'
                    },
                },
                {
                    $unwind: "$Msg"
                },
                {
                    $project: {
                        MsgsData: {
                            MsgId : "$Msg._id",
                            MsgText : "$Msg.msg",
                            sender : "$Msg.senderId",
                            reciever : "$Msg.recieverId",
                            createdAt : "$Msg.createdAt",
                        },
                    }
                },
                {
                    $group: {
                        allMsgs: {
                            $push: "$MsgsData"
                        },
                        _id: {
                        },
                    }
                }
            ]).sort({updatedAt : -1})

            console.log("isExist : ",isExist)
            return res.json({
                AllMsgs: isExist,
                success : true,
            });
        } catch (error) {
            console.log("Error in getAllChatsBetweenTwoUsers and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// getting all matched messages from chat/conversation
const getAllMatchedBetTwoUsers = async (req, res) => {
    const {senderId , recieverId } = req.params
    const {text} = req.body;

    if(!senderId || !recieverId){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            const AllMessages = await Messages.find({$or : [{senderId: mongoose.Types.ObjectId(senderId) , recieverId : mongoose.Types.ObjectId(recieverId) },{senderId: mongoose.Types.ObjectId(recieverId) , recieverId : mongoose.Types.ObjectId(senderId) }], msg : {"$regex" : text , "$options" : 'i'},})

            return res.json({
                AllMatchedMsgs: AllMessages,
                success : true,
            });
        } catch (error) {
            console.log("Error in getAllMatchedBetTwoUsers and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// delete nay converstaion
const deleteAnyConversation = async (req, res) => {
    const {senderId , recieverId} = req.params

    if(!senderId || !recieverId){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            const isChat = await Conversations.findOne({$or : [{senderId: senderId , recieverId : recieverId },{ senderId: recieverId , recieverId : senderId }]})
            if(!isChat){
                return res.json({success: false , message : "Conversation Not Found"})
            }

            // deleting all messages
            for(let i = 0; i !== isChat.allMsgs.length; i++){
                let isMsgDelete = await Messages.findOneAndDelete({_id : isChat.allMsgs[i]});
                // console.log("isChat.allMsgs[i] : ", isChat.allMsgs[i] , " isMsgDelete : ", isMsgDelete)
                // if(isMsgDelete === null){
                //     return res.json({success: false , message : "This message was not deleted"});
                // }
            }
            // deleting conversation
            const isChatDel = await Conversations.findOneAndDelete({$or : [{senderId: senderId , recieverId : recieverId },{ senderId: recieverId , recieverId : senderId }]})

            if(isChatDel){
                return res.json({
                    message: "Conversation Delete SuccessFully",
                    success : true,
                });
            }else{
                return res.json({
                    message: "Could Not Delete Conversation SuccessFully",
                    success : false,
                });
            }
        } catch (error) {
            console.log("Error in deleteAnyConversation and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}



module.exports = {
    addNewConversation,
    getAllChatsBetweenTwoUsers,
    getAllMatchedBetTwoUsers,
    deleteAnyConversation,
}