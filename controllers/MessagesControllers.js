const Conversations = require('../models/ConversationSchema')
const Users = require('../models/UserSchema')
const Messages = require('../models/MessagesSchema')
const mongoose = require("mongoose")
const nodeMailer = require("nodemailer");
const AdminEmail = process.env.REACT_ADMIN_EMAIL;
const AdminPassword = process.env.REACT_ADMIN_PASSWORD;



// add new message
const addNewMsg = async (req, res) => {
    const { senderId , recieverId, msg } = req.body;

    console.log(" senderId , recieverId : ",  senderId , recieverId)
    if (!senderId || !recieverId || !msg) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkSender = await Users.findById(senderId)
        if (!checkSender) {
            return res.json({
                success: false,
                message: 'Sender Id is Incorrect'
            })
        }

        let checkReciever = await Users.findById(recieverId)
        if (!checkReciever) {
            return res.json({
                success: false,
                message: 'Reciever Id is Incorrect'
            })
        }
        if (checkReciever.anyOneCanSendReq === false) {
            return res.json({
                success: false,
                message: 'Receiver Has Restricted Any Stranger from Sending Message or Request to him/her.'
            })
        }

        if(typeof(msg) !== "string" && typeof(msg) !== "number"){
            return res.json({
                success: false,
                message: "You can Only Send Text Messages."
            });
        }

        const isBlocked = await Users.findOne({_id : recieverId, blockedUsers : {$elemMatch:  {$eq : senderId} }} )
        if(isBlocked){
            return res.json({
                success: false,
                message: "Sorry! This user has Blocked you."
            });
        }

        const newMsg = new Messages({...req.body})
        try {
            const newlyMsg = await newMsg.save();

            // checking conversation
            const check = await Conversations.findOne({
                $or : [{senderId: senderId , recieverId : recieverId},{senderId : recieverId , recieverId : senderId }]
            })
            if (check) {
                await Conversations.findByIdAndUpdate(check._id, {$push : {allMsgs : newlyMsg._id.toString() }, new : true});
                return res.json({
                    success: true,
                    NewMsg : newlyMsg,
                    message: 'Added to Already existing Conversation'
                })
            }else{
                let allMsgs = [];
                allMsgs.push(newlyMsg._id.toString())
                const newConversation = new Conversations({senderId : senderId , recieverId : recieverId, allMsgs : allMsgs })
                await newConversation.save();

                // generating notification
                let noti = {
                    Id : senderId,
                    name : checkSender.name,
                    profilePic : checkSender.showProfPic === true ? checkSender.profilePic : "https://cdn-icons.flaticon.com/png/512/2202/premium/2202112.png?token=exp=1653505798~hmac=e5af3d2e3ec908e33fa7bc34045a5e1d" ,
                    phoneNo : checkSender.phoneNo,
                    status : checkSender.status,
                }
                console.log("noti : ", noti)
                checkReciever.NotfiCount += 1
                checkReciever.notifications.push(noti)
                let notifi = await Users.findByIdAndUpdate(recieverId , {$set : {...checkReciever}} , {new : true})

                // step 01
                const transport= nodeMailer.createTransport({
                    service : "gmail",
                    auth: {
                        user : AdminEmail, //own eamil
                        pass: AdminPassword, // own password
                    }
                })
                // setp 02
                const mailOption = {
                    from: AdminEmail, // sender/own eamil
                    to: checkReciever.email, // reciver eamil
                    subject: "WhatsApp Clone: New user Wants to Connect with You",
                    text : `Dear User,Please Check Your Notifications, New User Wants to connect with you.`
                }
                // step 03
                transport.sendMail(mailOption, (err, info) => {
                    if (err) {
                        console.log("Error occured : ", err)
                        return res.json({success: false, message : "Error in sending mail" , err})
                    } else {
                        console.log("Email Sent and info is : ", info.response)
                    }
                })

                res.status(201).json({
                    success: true,
                    NewMsg : newlyMsg,
                    message: 'New Conversation SuccessFully Started'
                })
            }

        } catch (error) {
            console.log("Error in addNewMsg and error is : ", error)
            res.status(201).json({
                success: false,
                error : "Could Not Perform Action"
            })
        }
    }
}

// getting all chats of a user
const getAllChatsOfUser = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            const check = await Conversations.findOne({
                $or : [{senderId: id },{recieverId : id }]
            }).sort({updatedAt : -1})

            if(!check){
                return res.json({success: false ,  message: "No Chats Found"})
            }
            
            return res.json({
                AllChats: check,
                success : true,
            });
        } catch (error) {
            console.log("Error in getAllChatsOfUser and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// getting all matched messaged between users
const getAllMatchedMsgs = async (req, res) => {
    const {senderId , receiverId , text } = req.params

    if(!senderId || !receiverId || !text){
        return res.json({success: false , message : "All Fields are Required"})
    }else {
        try {
            const checkSender = await Users.findById(senderId)
            if(!checkSender){
                return res.json({success: false ,  message: "Sender Not Found"})
            }
            const checkReceiver = await Users.findById(receiverId)
            if(!checkReceiver){
                return res.json({success: false ,  message: "Receiver Not Found"})
            }

            const checkMsg = await Messages.find({
                $or : [{senderId: senderId ,recieverId : receiverId },{senderId: receiverId ,recieverId : senderId }],
                msg : {"$regex" : text , "$options" : 'i'}
            });

            return res.json({
                AllMatchedMsgs: checkMsg,
                success : true,
            });
        } catch (error) {
            console.log("Error in getAllMatchedMsgs and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// deletung ant single mesage of a user
const deleteSingeleMsg = async (req, res) => {
    const {userId, msgId} = req.params

    if(!userId || !msgId){
        return res.json({success: false , message : "Please Provide All Required Fields"})
    }else {
        try {
            const checkUser = await Users.findById(userId)
            if(!checkUser){
                return res.json({success: false ,  message: "User No Found"})
            }

            const checkMsg = await Messages.findById(msgId)
            if(!checkMsg){
                return res.json({success: false ,  message: "Message No Found"})
            }

            const delMsg = await Messages.findOneAndDelete({_id : msgId , senderId : userId})
            if(delMsg){
                return res.json({
                    message: "Message SuccessFully Deleted",
                    success : true,
                });
            }else{
                return res.json({
                    message: "Could Not Delete Message",
                    success : false,
                });
            }

        } catch (error) {
            console.log("Error in deleteSingeleMsg and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}



module.exports = {
    addNewMsg,
    getAllChatsOfUser,
    deleteSingeleMsg,
    getAllMatchedMsgs
}