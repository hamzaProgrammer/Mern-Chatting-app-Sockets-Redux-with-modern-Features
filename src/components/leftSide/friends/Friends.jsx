import React, {useEffect } from 'react'
import './friends.css'
import {Typography, Button, Divider} from 'antd';
import 'antd/dist/antd.css';
import {getMyAllFriends , shoeChatScreen , getCrntUserOrFriend  } from '../../../redux/actions/UserActions'
import {useSelector, useDispatch} from 'react-redux'
import moment from 'moment'
// sockets implementation
const socket = require("socket.io-client")("http://localhost:8080");


const Friends = () => {
    const dispatch = useDispatch();

    const {currentUser , showFriendsSec ,showChatScreen, matchedStrangers , matchedMsgs , matchedFriends } = useSelector(state => state.usersReducer)

    useEffect(() => {
        dispatch(getMyAllFriends(currentUser?._id,dispatch))
    },[dispatch, socket])

    // getting user/friend details
    const showChat = (id) => {
        dispatch(shoeChatScreen(), dispatch);
        if(showChatScreen === true ){
            console.log("showChatScreen : ", id)
            dispatch(getCrntUserOrFriend(id), dispatch)
        }
    }

    return (
        <>
            {
                showFriendsSec === true ? (
                    //currentUser?.friends.length > 0 && (
                        currentUser?.friends?.map((item) => (
                            <div className="friends" key={item?._id} onClick={() => showChat(item?._id)} style={{cursor : 'pointer'}} >
                                <img alt="user avatar" className="friendImg" src={item?.profilePic !== "" ? item?.profilePic :  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAMAAABmmnOVAAAAMFBMVEXBx9D///+8w83g4+fL0Njo6u3Fy9P09fbY3OHT193u8PL7+/zl5+vQ1Nvc3+TIztX7FGtxAAAFm0lEQVR4nM2c2RqjIAyFEVkquLz/245orSLbCcrMnJtZvpb+xQRCQsq6Omkj+88wLYqtUss0fHppdOVgjPwOq+UsFOOcM0/u30p8ZAUJFcJ8BLt9+o2FiY9pCSGH+9dPgQyyDYQjgBB2DDbg84FCyAUnOCTQ6cAg+rwdpOejfwvC9jUAh3r7AoSV6gkD46r8UEoQWlQ9CA9DlJaOAsTnMcKG8XkAYZ49iYtU1l9zEPMr07CLz1UQ9rk1eBQi7SZJCPkmwa6km6QgxvcZGBtpEG+aw6mUYcQhpiYMK8WEQ0xtEJyi5hmDaDUPTtG5iEC0ZIhThBBDU4aVYihDtPELjyIIMu4QY3OGleK+XtwgSOvkGvApIaZp2k4AlHfKHISljKQGqb8OZ7UZSDuuzUAIeBQ+mbvHG4JbiTQEHMLwIRosadiz/DDnCmHQEdIhilEoxnWIKwT4VPmQCaDtAEKoOMQHZMjFSKt6cC4uD+SE0NibAycPBC41/DSrEwLzjDIDPBenh/wgJPbOQvC+C7ML/luyDggLWSUXiY+9CYuR1WHgBwR43gTTMBob7djJDgjoTeH+lxK4F/sQ2ESo5IcGwtac3oOA3oJ4xiHQQ+wFAnMNjjN0HTbieIFYIGzIPQ9hbqpOCIPNHSkjB6475gcB7sBA4ucUFh/tUe8GQV1mIWH+wQ8I0CxJJoFGSNva7SCwp0FxUCdsM92eh4NAXnzdbzCBlsl2CNA3ODFtThiW4REVsYYABklu9WGdBeP8RjPhkgUM3XabQazhAYMNCN/Hd6EB72rwDDWJRusEc0bBwM2LkVdM+Ei5rBDoa8+QEBIWtG7qGGqX1NUKTzIozdAD6Kowz5MRIetkGCEt8n5ktUsy1JOcCE5KKFnxns34qwmmSTDL9YTNKBnD0oH8FCUHyAdGSiGjmxjB2ldNDF6rNi0YBHFQRixzQWs3uhN8Ra60IdsYxeGqIACKRwVlVAUXeaeUWhKfctm7qkJFRf2VJytq3VhzvUARXfTAENFYz9SVUhfaYnXBmIKNXdZWcyfSsu1j8Gk8kuzWjBP9pskx0MCeGLN7qxJCff9aO8pM2srbaN3KG9TEqZKU8K6VDCHQbSZNCPmbiXL4aSV3+Pk7G05GH8KBuJW2AzFombxC2MgaS5JwJYZ57oma50EAxcEtSVI0Ci5qbpvu0sVdjW/pooJRlC+tlTjyGO6YXUwhErOXMWWDTnfALSVTH07Drozt/5KpmT2MlBdJK5NtP9LKyedBTdillZ6LrsuXGqj5upwSYcul1JDYzomZsrziqxE/iy7xTey9h+EUz63u3zNTiCMUIBHFDjheIS5mmm9ahFPUKq4lydh68u7TiD8PvzgbmQpa7rSsWBrr+PDvn+FUvGwSMaO4F+xDzlcd1Clw0uDqQuggzSHCSxzha5pDRK6zBDWr1hDRiz33nFtriOgVp7v5NoZIXPa67WONIVLX3vyQtylE+gLgDZZYli7JW4kyVyH9MIxaHCcwZC+F+uEm9Z5ATtpjyF6PvV04oJZC08p/ucKV6UxTBkXeoGHpJrw87ic2830ymKwfSIdX2CPX6P1j2/NHYrz8InaNPsiRP5uM2zSgDQVhS8GDyZCqzJBoMrmdhpCutqj07etEmgnSEEFJkdesn3eEZACPNx4pSXNXE6bciY1HsaM6V0jH4/ElIqkRcgtWvBmNT9B0mEibb1UzWhcvb7oqh86BaBkv4+Q8rKJBkbNl6o0NSKzVMpWvq29Q7DKZPc6Va2gfpTFGyn5rdE9mLh+1anb53BvfYL5NLpmXPW1a7dyalxwe0gvtu91/0ci8af7nLd1Odiz8xEBMYgQXN7zN3wyEwuNqrA3a/DeN2A8eOALSRkP/6YflH//0w6btRzDcZYNgt1//U8wyu6i/BbHr1Z8D+QPPGDVTV0kafQAAAABJRU5ErkJggg=="} />
                                <div className="ferindDiv">
                                    <div style={{display : 'flex', flexDirection : 'column', minWidth : '80%'}} >
                                        <Typography className="frindName">{item?.name}</Typography>
                                        <Typography className="lastMsg">{item?.status !== "" ? item?.status : "Hey, there I am using Whats App Web 2.0"}</Typography>
                                    </div>
                                    <Typography className="friendlastSeen" >
                                        {
                                            item?.isActive === true ? (
                                                "online"
                                            ) : (
                                                moment(item?.lastSeen).fromNow()
                                            )
                                        }
                                    </Typography>
                                </div>
                            </div>
                        ))
                    //)
                ) : (
                    <>
                    {
                        matchedStrangers?.length > 0 && (
                            matchedFriends?.map((item, ind) => (
                                ind === 0 ? (
                                    <>
                                        <Typography style={{fontSize : '17px', color : '#FFFFFF', fontWeight : 600, textAlign : 'center', marginBottom: '20px', marginTop : '10px'}} >Your Freinds</Typography>
                                        <div className="friends" key={item?._id} onClick={() => showChat(item?._id)} style={{cursor : 'pointer'}} >
                                            <img alt="user avatar" className="friendImg" src={item?.profilePic !== "" ? item?.profilePic :  "data:image/png;base64,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"} />
                                            <div className="ferindDiv">
                                                <div style={{display : 'flex', flexDirection : 'column', minWidth : '70%'}} >
                                                    <Typography className="frindName">{item?.name}</Typography>
                                                    <Typography className="lastMsg">{item?.phoneNo }</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    )
                                    :(
                                        <div className="friends" key={item?._id} onClick={() => showChat(item?._id)} style={{cursor : 'pointer'}} >
                                            <img alt="user avatar" className="friendImg" src={item?.profilePic !== "" ? item?.profilePic :  "data:image/png;base64,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"} />
                                            <div className="ferindDiv">
                                                <div style={{display : 'flex', flexDirection : 'column', minWidth : '70%'}} >
                                                    <Typography className="frindName">{item?.name}</Typography>
                                                    <Typography className="lastMsg">{item?.phoneNo }</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    )
                            ))
                        )
                    }

                    {
                        matchedStrangers?.length > 0 && (
                            matchedStrangers?.map((item,ind) => (
                                ind === 0 ? (
                                    <>
                                        <Divider style={{margin : '10px', marginTop : '25px',  backgroundColor : '#95a5a6'}} />
                                        <Typography style={{fontSize : '17px', color : '#FFFFFF', fontWeight : 600, textAlign : 'center', marginBottom: '20px', marginTop : '0px'}} >New Users for You</Typography>
                                        <div className="friends" key={item?._id} onClick={() => showChat(item?._id)} style={{cursor : 'pointer'}} >
                                            <img alt="user avatar" className="friendImg" src={item?.profilePic !== "" ? item?.profilePic :  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAMAAABmmnOVAAAAMFBMVEXBx9D///+8w83g4+fL0Njo6u3Fy9P09fbY3OHT193u8PL7+/zl5+vQ1Nvc3+TIztX7FGtxAAAFm0lEQVR4nM2c2RqjIAyFEVkquLz/245orSLbCcrMnJtZvpb+xQRCQsq6Omkj+88wLYqtUss0fHppdOVgjPwOq+UsFOOcM0/u30p8ZAUJFcJ8BLt9+o2FiY9pCSGH+9dPgQyyDYQjgBB2DDbg84FCyAUnOCTQ6cAg+rwdpOejfwvC9jUAh3r7AoSV6gkD46r8UEoQWlQ9CA9DlJaOAsTnMcKG8XkAYZ49iYtU1l9zEPMr07CLz1UQ9rk1eBQi7SZJCPkmwa6km6QgxvcZGBtpEG+aw6mUYcQhpiYMK8WEQ0xtEJyi5hmDaDUPTtG5iEC0ZIhThBBDU4aVYihDtPELjyIIMu4QY3OGleK+XtwgSOvkGvApIaZp2k4AlHfKHISljKQGqb8OZ7UZSDuuzUAIeBQ+mbvHG4JbiTQEHMLwIRosadiz/DDnCmHQEdIhilEoxnWIKwT4VPmQCaDtAEKoOMQHZMjFSKt6cC4uD+SE0NibAycPBC41/DSrEwLzjDIDPBenh/wgJPbOQvC+C7ML/luyDggLWSUXiY+9CYuR1WHgBwR43gTTMBob7djJDgjoTeH+lxK4F/sQ2ESo5IcGwtac3oOA3oJ4xiHQQ+wFAnMNjjN0HTbieIFYIGzIPQ9hbqpOCIPNHSkjB6475gcB7sBA4ucUFh/tUe8GQV1mIWH+wQ8I0CxJJoFGSNva7SCwp0FxUCdsM92eh4NAXnzdbzCBlsl2CNA3ODFtThiW4REVsYYABklu9WGdBeP8RjPhkgUM3XabQazhAYMNCN/Hd6EB72rwDDWJRusEc0bBwM2LkVdM+Ei5rBDoa8+QEBIWtG7qGGqX1NUKTzIozdAD6Kowz5MRIetkGCEt8n5ktUsy1JOcCE5KKFnxns34qwmmSTDL9YTNKBnD0oH8FCUHyAdGSiGjmxjB2ldNDF6rNi0YBHFQRixzQWs3uhN8Ra60IdsYxeGqIACKRwVlVAUXeaeUWhKfctm7qkJFRf2VJytq3VhzvUARXfTAENFYz9SVUhfaYnXBmIKNXdZWcyfSsu1j8Gk8kuzWjBP9pskx0MCeGLN7qxJCff9aO8pM2srbaN3KG9TEqZKU8K6VDCHQbSZNCPmbiXL4aSV3+Pk7G05GH8KBuJW2AzFombxC2MgaS5JwJYZ57oma50EAxcEtSVI0Ci5qbpvu0sVdjW/pooJRlC+tlTjyGO6YXUwhErOXMWWDTnfALSVTH07Drozt/5KpmT2MlBdJK5NtP9LKyedBTdillZ6LrsuXGqj5upwSYcul1JDYzomZsrziqxE/iy7xTey9h+EUz63u3zNTiCMUIBHFDjheIS5mmm9ahFPUKq4lydh68u7TiD8PvzgbmQpa7rSsWBrr+PDvn+FUvGwSMaO4F+xDzlcd1Clw0uDqQuggzSHCSxzha5pDRK6zBDWr1hDRiz33nFtriOgVp7v5NoZIXPa67WONIVLX3vyQtylE+gLgDZZYli7JW4kyVyH9MIxaHCcwZC+F+uEm9Z5ATtpjyF6PvV04oJZC08p/ucKV6UxTBkXeoGHpJrw87ic2830ymKwfSIdX2CPX6P1j2/NHYrz8InaNPsiRP5uM2zSgDQVhS8GDyZCqzJBoMrmdhpCutqj07etEmgnSEEFJkdesn3eEZACPNx4pSXNXE6bciY1HsaM6V0jH4/ElIqkRcgtWvBmNT9B0mEibb1UzWhcvb7oqh86BaBkv4+Q8rKJBkbNl6o0NSKzVMpWvq29Q7DKZPc6Va2gfpTFGyn5rdE9mLh+1anb53BvfYL5NLpmXPW1a7dyalxwe0gvtu91/0ci8af7nLd1Odiz8xEBMYgQXN7zN3wyEwuNqrA3a/DeN2A8eOALSRkP/6YflH//0w6btRzDcZYNgt1//U8wyu6i/BbHr1Z8D+QPPGDVTV0kafQAAAABJRU5ErkJggg=="} />
                                            <div className="ferindDiv">
                                                <div style={{display : 'flex', flexDirection : 'column', minWidth : '70%'}} >
                                                    <Typography className="frindName">{item?.name}</Typography>
                                                    <Typography className="lastMsg">{item?.phoneNo }</Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                    )
                                :(
                                    <div className="friends" key={item?._id} onClick={() => showChat(item?._id)} style={{cursor : 'pointer'}} >
                                        <img alt="user avatar" className="friendImg" src={item?.profilePic !== "" ? item?.profilePic :  "data:image/png;base64,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"} />
                                        <div className="ferindDiv">
                                            <div style={{display : 'flex', flexDirection : 'column', minWidth : '70%'}} >
                                                <Typography className="frindName">{item?.name}</Typography>
                                                <Typography className="lastMsg">{item?.phoneNo }</Typography>
                                            </div>
                                            <Button className="addfreindBtn" >Send Req</Button>
                                        </div>
                                    </div>
                                )
                            ))
                        )
                    }

                    {
                        matchedMsgs?.length > 0 && (
                            matchedMsgs?.map((item,ind) => (
                                ind === 0 ? (
                                    <>
                                        <Divider style={{margin : '10px', marginTop : '25px',  backgroundColor : '#95a5a6'}} />
                                        <Typography style={{fontSize : '17px', color : '#FFFFFF', fontWeight : 600, textAlign : 'center', marginBottom: '20px', marginTop : '10px' }} >Messages in Your Chats</Typography>
                                        <div className="searchMsg" key={item?._id} style={{minWidth : '100%', paddingLeft : '10px', paddingRight : '10px', cursor : 'pointer'}}  onClick={() => showChat(item?.recieverId)}>
                                            <Typography className="searchMsgDate" >{moment(item?.createdAt).fromNow()}</Typography>
                                            {
                                                item?.senderId === currentUser?._id &&  <Typography className="searchMsgDate" style={{marginTop : '-20px', marginLeft : 'auto'}} >sent by You</Typography>
                                            }
                                        <Typography className="searchMsgText" style={{textAlign : 'left'}} >{item?.msg}</Typography>
                                    </div>
                                    </>
                                    )
                                :(
                                <div className="searchMsg" key={item?._id} style={{minWidth : '100%', paddingLeft : '10px', paddingRight : '10px'}}>
                                        <Typography className="searchMsgDate" >{moment(item?.createdAt).fromNow()}</Typography>
                                        {
                                            item?.senderId === currentUser?._id &&  <Typography className="searchMsgDate" style={{marginTop : '-20px', marginLeft : 'auto'}} >sent by You</Typography>
                                        }
                                    <Typography className="searchMsgText" style={{textAlign : 'left'}} >{item?.msg}</Typography>
                                </div>
                                )
                            ))
                        )
                    }
                    </>
                )
            }
        </>
    )
}

export default Friends
