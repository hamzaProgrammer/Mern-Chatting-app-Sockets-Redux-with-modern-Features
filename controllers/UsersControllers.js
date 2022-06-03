const Users = require('../models/UserSchema')
const Messages = require('../models/MessagesSchema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const URL = "http://localhost:8080"


// Sign Up new user
const addNewUser = async (req, res) => {
    const { name , phoneNo, password, email } = req.body;
    if (!phoneNo || !name || !password  || !email) {
        return res.json({
            success: false,
            message: "Please fill All required credentials"
        });
    } else {
        const checkPhone = await Users.findOne({
            phoneNo: phoneNo
        })
        if (checkPhone) {
            return res.json({
                success: false,
                message: 'Sorry! SomeOne with same Phone No. is Already Registered.'
            })
        }

        const checkEmail = await Users.findOne({
            email: email
        })
        if (checkEmail) {
            return res.json({
                success: false,
                message: 'Sorry! SomeOne with same Email is Already Registered.'
            })
        }else {
                req.body.password = await bcrypt.hash(password, 10); // hashing password
                const newUser = new Users({...req.body})
                try {
                    await newUser.save();

                    res.status(201).json({
                        success: true,
                        message: 'User SuccessFully Added'
                    })
                } catch (error) {
                    console.log("Error in addNewUser and error is : ", error)
                    res.status(201).json({
                        success: false,
                        error : "Could Not Perform Action"
                    })
                }
        }
    }
}

// Logging In User
const LogInUser = async (req, res) => {
    const { phoneNo ,  password } = req.body

    if(!phoneNo  || !password){
        return res.json({success: false , message : "Please fill Required Credientials"})
    }else {
        try {
            const isOprExists = await Users.findOne({phoneNo: phoneNo});

            if(!isOprExists){
                return res.json({success: false ,  message: "User Not Found"})
            }
            const isPasswordCorrect = await bcrypt.compare(password, isOprExists.password); // comparing password
            if (!isPasswordCorrect) {
                return res.json({
                    success: false,
                    message: 'Invalid Credentials'
                })
            }

            const token = jwt.sign({id: isOprExists._id} , JWT_SECRET_KEY , {expiresIn: '24h'}); // gentating token

            return res.json({
                myResult: isOprExists,
                success : true,
                token : token
            });
        } catch (error) {
            console.log("Error in LogInUser and error is : ", error)
            return res.json({
                success: false,
                error
            });
        }
    }
}

// geting all friends of a user
const getAllFreinds = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            const isOprExists = await Users.findById(id);

            if(!isOprExists){
                return res.json({success: false ,  message: "User Not Found"})
            }

            const isExist = await Users.aggregate([
            {
                $match : {
                    _id: mongoose.Types.ObjectId(id)
                },
            },
            {
                $lookup: {
                    from: 'whatsappusers',
                    localField: 'friends',
                    foreignField: '_id',
                    as: 'Freind'
                },
            },
            {
                $unwind: "$Freind"
            },
            // {
            //     $project: {
            //         FreindsData: {
            //             Freinds : "$Freind"
            //             // FreindId : "$Freind._id",
            //             // FreindName : "$Freind.name",
            //             // FreindPhoto : "$Freind.profilePic",
            //             // FreindStatus : "$Freind.status",
            //             // FreindLastSeen : "$Freind.lastSeen",
            //         },
            //     }
            // },
            {
                $group: {
                    allFriends: {
                        $push: "$Freind"
                    },
                    _id: {
                    },
                }
            }
            ])
            if(isExist.length < 1) {
                return res.json({
                    success: false,
                    message : "No Friends Found"
                });
            }

            return res.json({
                AllFriends: isExist[0].allFriends,
                success : true,
            });
        } catch (error) {
            console.log("Error in getAllFreinds and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// accepting request of any user
const acceptReqOfUser = async (req, res) => {
    const {senderId , recieverId} = req.params

    if(!senderId || !recieverId){
        return res.json({success: false , message : "Ids are Required"})
    }else {
        try {
            let isSenderExist = await Users.findById(senderId);
            if(!isSenderExist){
                return res.json({success: false ,  message: "Sender Id is Incorrect"})
            }
            let isRecieverExist = await Users.findById(recieverId);
            if(!isRecieverExist){
                return res.json({success: false ,  message: "Reciever Id is Incorrect"})
            }

            const isFriend = await Users.findOne({_id : senderId, friends : {$elemMatch:  {$eq : recieverId} } } )
            if(!isFriend){
                let newArray = isSenderExist.notifications.filter(function (e) {
                    return e.phoneNo !== isRecieverExist.phoneNo
                });
                await Users.findByIdAndUpdate(senderId , {$set : {notifications : newArray}, new : true})
                await Users.findByIdAndUpdate(senderId , {$push : {friends : recieverId}})
                await Users.findByIdAndUpdate(recieverId , {$push : {friends : senderId}})
                return res.json({
                    success: true,
                    message: "User Added to Friend List SuccessFully."
                });
            }else{
                await Users.findByIdAndUpdate(senderId , {$pull : {friends : recieverId}})
                return res.json({
                    success: true,
                    updatedNotifications: newArray,
                    message: "User Removed from Friend List SuccessFully."
                });
            }
        } catch (error) {
            console.log("Error in acceptReqOfUser and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// block any user
const blockUser = async (req, res) => {
    const {senderId , recieverId} = req.params

    if(!senderId || !recieverId){
        return res.json({success: false , message : "Ids are Required"})
    }else {
        try {
            let isSenderExist = await Users.findById(senderId);
            if(!isSenderExist){
                return res.json({success: false ,  message: "Sender Id is Incorrect"})
            }
            let isRecieverExist = await Users.findById(recieverId);
            if(!isRecieverExist){
                return res.json({success: false ,  message: "Reciever Id is Incorrect"})
            }

            const isBlocked = await Users.findOne({_id : senderId, blockedUsers : {$elemMatch:  {$eq : recieverId} } } )
            if(!isBlocked){
                let newArray = isSenderExist.notifications.filter(function (e) {
                    return e.phoneNo !== isRecieverExist.phoneNo
                });
                await Users.findByIdAndUpdate(senderId , {$set : {notifications : newArray}, new : true})

                await Users.findByIdAndUpdate(senderId , {$push : {blockedUsers : recieverId}})
                //await Users.findByIdAndUpdate(recieverId , {$push : {blockedUsers : senderId}})
                return res.json({
                    success: true,
                    updatedNotifications : newArray,
                    message: "User Added to Blocked List SuccessFully."
                });
            }else{
                await Users.findByIdAndUpdate(senderId , {$pull : {blockedUsers : recieverId}})
                return res.json({
                    success: true,
                    message: "User Removed from Blocked List SuccessFully."
                });
            }
        } catch (error) {
            console.log("Error in blockUser and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// delete any notification
const deleteNotification = async (req, res) => {
    const {senderId , recieverId} = req.params

    if(!senderId || !recieverId){
        return res.json({success: false , message : "Ids are Required"})
    }else {
        try {
            let isSenderExist = await Users.findById(senderId);
            if(!isSenderExist){
                return res.json({success: false ,  message: "Sender Id is Incorrect"})
            }
            let isRecieverExist = await Users.findById(recieverId);
            if(!isRecieverExist){
                return res.json({success: false ,  message: "Receiver Id is Incorrect"})
            }

            let newArray = isSenderExist.notifications.filter(function (e) {
                return e.phoneNo !== isRecieverExist.phoneNo
            });
            if(newArray.length > 0){
                await Users.findByIdAndUpdate(senderId , {$set : {notifications : newArray}, new : true})
                return res.json({
                    success: true,
                    updatedNotifications : newArray,
                    message: "Notification Removed SuccessFully."
                });
            }else{
                await Users.findByIdAndUpdate(senderId , {$set : {notifications : newArray}, new : true})
                return res.json({
                    success: true,
                    updatedNotifications : newArray,
                    message: "Notification Not Found in Your List"
                });
            }
        } catch (error) {
            console.log("Error in deleteNotification and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// show/hide profile pic to everyone/strangers
const showOrHideProfilePic = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            let isSenderExist = await Users.findById(id);
            if(!isSenderExist){
                return res.json({success: false ,  message: "Id is Incorrect"})
            }
            if(isSenderExist.showProfPic === false){
                isSenderExist.showProfPic = true
            }else{
                isSenderExist.showProfPic = false
            }
            let updatedUser = await Users.findByIdAndUpdate(id , {$set : {...isSenderExist}} , {new : true})
            return res.json({
                success: true,
                newStatus : updatedUser.showProfPic,
                message: "Showing Profile Picture Status Changed SuccessFully."
            });
        } catch (error) {
            console.log("Error in showOrHideProfilePic and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// show/hide profile everyone/strangers while searching
const showOrHideProfileWhileSearch = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            let isSenderExist = await Users.findById(id);
            if(!isSenderExist){
                return res.json({success: false ,  message: "Id is Incorrect"})
            }
            if(isSenderExist.showProfInSearch === false){
                isSenderExist.showProfInSearch = true
            }else{
                isSenderExist.showProfInSearch = false
            }

            let updatedUser = await Users.findByIdAndUpdate(id , {$set : {...isSenderExist}} , {new : true})
            return res.json({
                success: true,
                newStatus : updatedUser.showProfInSearch,
                message: "Showing Profile in Search Changed SuccessFully."
            });
        } catch (error) {
            console.log("Error in showOrHideProfileWhileSearch and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// can any one send request while searching
const anyOneSendReqWhileSearching = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.json({success: false , message : "Id of User is Required"})
    }else {
        try {
            let isSenderExist = await Users.findById(id);
            if(!isSenderExist){
                return res.json({success: false ,  message: "Id is Incorrect"})
            }
            if(isSenderExist.anyOneCanSendReq === false){
                isSenderExist.anyOneCanSendReq = true
            }else{
                isSenderExist.anyOneCanSendReq = false
            }

            let updatedUser = await Users.findByIdAndUpdate(id , {$set : {...isSenderExist}} , {new : true})
            return res.json({
                success: true,
                newStatus : updatedUser.anyOneCanSendReq,
                message: "Privacy Status Changed SuccessFully."
            });
        } catch (error) {
            console.log("Error in anyOneSendReqWhileSearching and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// updating Profile Picture
const updateProfilePic = async (req, res) => {
    const {id} = req.params;
    console.log("req.file: ", req.file)

    if(!req.file){
        return res.json({
            success: false,
            message: "Image Not Sent"
        })
    }

    if ((req.file.mimetype  !== "image/jpeg" && req.file.mimetype  !== "image/jpg" && req.file.mimetype  !== "image/webP" && req.file.mimetype  !== "image/png")) {
        return res.json({
            success: false,
            message: "Only Image Type File is Allowed to Upload"
        });
    }

    if (!id || !req.file) {
        return res.json({
            success: false,
            message: "Please Provide All Credediantials"
        })
    } else {
        try {
            let isExist = await Users.findById(id , {createdAt : 0 , updatedAt : 0 , __v : 0});

            if (!isExist) {
                return res.json({
                    success: false,
                    message: "User Not Found"
                })
            }

            let lower = URL + "/usersImages/" + req.file.filename.toLowerCase();
            isExist.profilePic = lower;

            console.log("isExist : ", isExist)

            let updatedUser = await Users.findByIdAndUpdate(id, {$set : {...isExist}} , {new : true})

            return res.json({
                success: true,
                newPic : updatedUser.profilePic,
                message : "User Profile Image SuccessFully Updated"
            });
        } catch (error) {
            console.log("Error in updateProfilePic and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }

}

// getting Profile Picture of a user
const getProfilePic = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Id of User is Required"
        })
    } else {
        try {
            let isExist = await Users.findById(id , {createdAt : 0 , updatedAt : 0 , __v : 0});

            if (!isExist) {
                return res.json({
                    success: false,
                    message: "User Not Found"
                })
            }
            return res.json({
                success: true,
                profilePic : isExist.profilePic
            });
        } catch (error) {
            console.log("Error in getProfilePic and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }

}

// getting user notifications
const getUserNotifications = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Id of User is Required"
        })
    } else {
        try {
            let isExist = await Users.findById(id , {createdAt : 0 , updatedAt : 0 , __v : 0});

            if (!isExist) {
                return res.json({
                    success: false,
                    message : "User Not Found"
                })
            }
            return res.json({
                success: true,
                AllNotifications : isExist.notifications
            });
        } catch (error) {
            console.log("Error in getUserNotifications and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }

}

// updating Profile data
const updateProfileData = async (req, res) => {
    const {id} = req.params;

    if (!id || !req.body) {
        return res.json({
            success: false,
            message: "Please Provide All Credediantials"
        })
    } else {
        try {
            let isExist = await Users.findById(id , {createdAt : 0 , updatedAt : 0 , __v : 0});

            if (!isExist) {
                return res.json({
                    success: false,
                    message: "User Not Found"
                })
            }

            isExist.name = req.body.name ? req.body.name : isExist.name;
            isExist.status = req.body.status ? req.body.status :  isExist.status;
            let updatedUser = await Users.findByIdAndUpdate(id, {$set : {...isExist}} , {new : true})
            console.log("updatedUser.name : ",updatedUser.name , "status : ",updatedUser.status)
            return res.json({
                success: true,
                name : updatedUser.name,
                status : updatedUser.status,
                message : "User Profile Data SuccessFully Updated"
            });
        } catch (error) {
            console.log("Error in updateProfileData and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }

}

// getting Profile data of a user
const getProfileData = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Id of User is Required"
        })
    } else {
        try {
            let isExist = await Users.findById(id);

            if (!isExist) {
                return res.json({
                    success: false,
                    message: "User Not Found"
                })
            }
            return res.json({
                success: true,
                Id : isExist._id,
                Name : isExist.name,
                Status : isExist.status,
                PhoneNo : isExist.phoneNo,
                Picture : isExist.profilePic,
            });
        } catch (error) {
            console.log("Error in getProfileData and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }

}

// getting all notifications of a user
const getAllNotifications = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Id of User is Required"
        })
    } else {
        try {
            let isExist = await Users.findById(id);

            if (!isExist) {
                return res.json({
                    success: false,
                    message: "User Not Found"
                })
            }
            return res.json({
                success: true,
                AllNotifications : isExist.notifications,
            });
        } catch (error) {
            console.log("Error in getAllNotifications and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }

}

// getting username and pic of user for chat
const getUserNamePicAndNameForChat = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.json({
            success: false,
            message: "Id of User is Required"
        })
    } else {
        try {
            let isExist = await Users.findById(id);

            if (!isExist) {
                return res.json({
                    success: false,
                    message: "User Not Found"
                })
            }
            return res.json({
                success: true,
                User : isExist
            });
        } catch (error) {
            console.log("Error in getUserNamePicAndNameForChat and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }

}

// getting all matched users
const getAllMatchedUsers = async (req, res) => {
    const {id , text } = req.params

    if(!id || !text){
        return res.json({success: false , message : "Please Provide All required Fields"})
    }else {
        try {
            //const AllUsers = await Users.find({$or : [{phoneNo : {"$regex" : text , "$options" : 'i'}},{name : {"$regex" : text , "$options" : 'i'}}], _id : {$ne : id}}, {_id : 1 , name : 1 , profilePic : 1 , status : 1 , phoneNo : 1})

            const checkUser = await Users.findById(id);
            if(!checkUser){
                return res.json({success: false , message : "User Not Found"});
            }

            // all strangers
            const AllStrangers = await Users.find({$or : [{phoneNo : {"$regex" : text , "$options" : 'i'}},{name : {"$regex" : text , "$options" : 'i'}}], _id : {$nin : checkUser.friends, $ne : id}}, {_id : 1 , name : 1 , profilePic : 1 , status : 1 , phoneNo : 1})

            // all users already friends
            const AllFreinds = await Users.find({$or : [{phoneNo : {"$regex" : text , "$options" : 'i'}},{name : {"$regex" : text , "$options" : 'i'}}], _id : {$in : checkUser.friends, $ne : id}}, {_id : 1 , name : 1 , profilePic : 1 , status : 1 , phoneNo : 1})

            // all matched messages
            const AllMsgs = await Messages.find({$or : [{ $and :  [{senderId : id}, {msg : {"$regex" : text , "$options" : 'i'}}] },{ $and :  [{recieverId : id}, {msg : {"$regex" : text , "$options" : 'i'}}] }]}, {msg : 1 , createdAt : 1 , senderId :1 , recieverId : 1})

            return res.json({
                Freinds : AllFreinds,
                Strangers : AllStrangers,
                AllMsgs : AllMsgs,
                success : true,
            });
        } catch (error) {
            console.log("Error in getAllMatchedUsers and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// find if a user is in current user freind list
const findIfUserIsCurntUserFreind = async (crntUserId , userId) => {
    //const {crntUserId , userId} = req.params

    if(!crntUserId || !userId){
        return res.json({success: false , message : "Please Provide All required Fields"})
    }else {
        try {
            const isCurrent = await Users.findById(crntUserId);
            if(!isCurrent){
                return res.json({success: false , message : "Current user Id is Incorrect"})
            }
            const isReciever = await Users.findById(userId);
            if(!isReciever){
                return res.json({success: false , message : "Receiver user Id is Incorrect"})
            }

            const isFreind = await Users.findOne({ $and : [{_id : crntUserId },{$in : {friends : userId } }] })

            if(isFreind){
                return res.json({
                    success : true,
                    UserId : userId,
                });
            }else{
                return res.json({
                    success : false,
                });
            }

        } catch (error) {
            console.log("Error in findIfUserIsCurntUserFreind and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// updating last seen
const updateLastSeen = async (req, res) => {
    const {id, lastSeen} = req.params
    if(!id || !lastSeen){
        return res.json({success: false , message : "Please provide All required Feilds"})
    }else {
        try {
            let isSenderExist = await Users.findById(id);
            if(!isSenderExist){
                return res.json({success: false ,  message: "Id is Incorrect"})
            }
            console.log("already in updateLastSeen  : ",isSenderExist.isActive)
            const d = new Date();
            isSenderExist.lastSeen = d;
            isSenderExist.isActive = false
            console.log("already in updateLastSeen  : ",isSenderExist.isActive)

            let updatedUser = await Users.findByIdAndUpdate(id , {$set : {...isSenderExist}} , {new : true})
            console.log("updatedUser.isActive updateLastSeen : ",updatedUser.isActive)
            console.log("---------------------------------------------------------")
            return res.json({
                success: true,
                LastSeen : lastSeen,
                message: "Last Seen of User Updated SuccessFully."
            });;
        } catch (error) {
            console.log("Error in updateLastSeen and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error"
            });
        }
    }
}

// updating active/inactive
const updateActiveInActive = async (req, res) => {
    const {id} = req.params
    if(id !== undefined){
        console.log("id : ",id)
        if(!id ){
            return res.json({success: false , message : "Please provide All required Feilds"})
        }else {
            try {
                let isSenderExist = await Users.findById(id);
                if(!isSenderExist){
                    return res.json({success: false ,  message: "Id is Incorrect"})
                }
                console.log("already in inupdateActiveInActive  : ",isSenderExist.isActive)
                const d = new Date();
                isSenderExist.lastSeen = d;
                isSenderExist.isActive = true
                console.log("already in inupdateActiveInActive  : ",isSenderExist.isActive)
    
                let updatedUser = await Users.findByIdAndUpdate(id , {$set : {...isSenderExist}} , {new : true})
                console.log("updatedUser.isActive inupdateActiveInActive : ",updatedUser.isActive)
                console.log("---------------------------------------------------------")
                return res.json({
                    success: true,
                    message: "Last Seen of User Updated SuccessFully."
                });;
            } catch (error) {
                console.log("Error in updateActiveInActive and error is : ", error)
                return res.json({
                    success: false,
                    message : "Some Server Side Error"
                });
            }
        }
    }
}

// updating active/inactive and last seen when user closes tab or window
const updateActiveInActiveUpoTabClose = async (id) => {
    if(!id){
        return ({success: false})
    }else {
        try {
            let isSenderExist = await Users.findById(id);
            if(!isSenderExist){
                return ({success: false})
            }
            const d = new Date();
            isSenderExist.isActive = true
            isSenderExist.lastSeen = d;

            await Users.findByIdAndUpdate(id , {$set : {...isSenderExist} , new : true})
            return ({success: true})
        } catch (error) {
            console.log("Error in updateActiveInActiveUpoTabClose and error is : ", error)
            return ({success: false})
        }
    }
}

// get message sender info
const getMsgSenderInfo = async (req, res) => {
    const {id} = req.params
    console.log("getMsgSenderInfo Id : ", id)

    if(!id){
        return res.json({success: false , message : "ID is Required"})
    }else {
        try {
            const isUser = await Users.findById(id);
            if(!isUser){
                return res.json({success: false ,  message: "User Not Found"})
            }

            return res.json({
                Name: isUser.name,
                success : true,
            });
        } catch (error) {
            console.log("Error in getMsgSenderInfo and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }
}

// add New Notification of msg from user freind
const addMsgNotification = async (req, res) => {
    const {sender , msg ,reciever} = req.body

    if(!sender || !msg || !reciever){
        return res.json({success: false , message : "Some Fields Are Missing"})
    }else {
        try {
            let isReceiver = await Users.findById(reciever);
            if(!isReceiver){
                return res.json({success: false ,  message: "Receiver Not Found"})
            }

            const isUser = await Users.findById(sender);
            if(!isUser){
                return res.json({success: false ,  message: "Sender Not Found"})
            }

            const cDate = new Date();
            const final = cDate.getFullYear() + "-" + (cDate.getMonth() + 1) + "-" + cDate.getDate();
            const newObj = {
                Id : isUser?._id,
                profilePic : isUser?.showProfPic === true ? isUser?.profilePic : "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg",
                Name : isUser?.name,
                msg : msg,
                date : final
            }

            //let newObb = await Users.findByIdAndUpdate(reciever ,{$push : {msgNotifications : newObj}});
            isReceiver.msgNotfiCount += 1;
            isReceiver.msgNotifications.push(newObj)
            //console.log("newObj : ",isReceiver.msgNotifications)
            let newUpdated = await Users.findByIdAndUpdate(reciever , {$set : {...isReceiver}} , {new : true});
            console.log("newUpdated.msgNotifications[newUpdated.msgNotifications.length - 1] : ", newUpdated.msgNotifications[newUpdated.msgNotifications.length - 1])

            return res.json({
                success : true,
                newlyNotification : newUpdated.msgNotifications[newUpdated.msgNotifications.length - 1],
                message : "New Notification Added and Incremented by 1",
            });
        } catch (error) {
            console.log("Error in addMsgNotification and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }
}

// set msg notification count as 0
const setMsgNotification = async (req, res) => {
    const {id} = req.params

    if(!id){
        return res.json({success: false , message : "Some Fields Are Missing"})
    }else {
        try {
            let isReceiver = await Users.findById(id);
            if(!isReceiver){
                return res.json({success: false ,  message: "Receiver Not Found"})
            }

            isReceiver.msgNotfiCount = 0;
            await Users.findByIdAndUpdate(id , {$set : {...isReceiver}} , {new : true});

            return res.json({
                success : true,
                message : "New Notification Added and Incremented by 1",
            });
        } catch (error) {
            console.log("Error in setMsgNotification and error is : ", error)
            return res.json({
                success: false,
                message : "Some Server Side Error Ocurred"
            });
        }
    }
}

module.exports = {
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
    findIfUserIsCurntUserFreind,
    updateLastSeen,
    updateActiveInActive,
    updateActiveInActiveUpoTabClose,
    getMsgSenderInfo,
    addMsgNotification,
    setMsgNotification
}