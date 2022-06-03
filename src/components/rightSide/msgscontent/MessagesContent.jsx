import React , {useState} from 'react'
import './Message.css'
import {Typography, Popconfirm, message } from 'antd';
import {AiFillDelete} from 'react-icons/ai'
import {deleteMyMsg} from '../../../redux/actions/UserActions'
import {useDispatch} from 'react-redux'
import moment from 'moment'



const MessagesContent = ({owner, msg , sender , id , createdAt }) => {
    const [ showDrop , setDropDown ] = useState(false);
    const [ showIcon , setshowIcon ] = useState(false)
    const dispatch = useDispatch();

    const mouseEnter = () => {
        setDropDown(true);
    }

    const mouseLeave = () => {
        setDropDown(false);
        setshowIcon(false)
    }

    const deletMsg = (userId , msgId) => {
        dispatch(deleteMyMsg(userId , msgId), dispatch)
        message.success('Message Deleted SuccessFully');
    }

    // popconfirm
    const cancel = (e) => {
        console.log(e);
    };

    return (
        <>
            {
                owner === true ? (
                    <div className="message own" onMouseOver={mouseEnter} onMouseLeave={mouseLeave} >
                            <div style={{display : 'flex'}} >
                                <Typography className="messText" style={{minWidth : '400px'}} >{msg}</Typography>
                                {
                                    showDrop && (
                                        <Popconfirm
                                        style={{backgroundColor : 'red'}}
                                            title="Delete This Message?"
                                            onConfirm={() => deletMsg(sender,id)}
                                            onCancel={cancel}
                                            okText="Yes"
                                            cancelText="No"
                                            placement="topLeft"
                                        >
                                            <AiFillDelete style={{color : '#FFFFFF', fontSize : '20px', cursor : 'pointer'}}  />
                                        </Popconfirm>
                                    )
                                }
                            </div>
                        <Typography className="messtime" >{moment(createdAt).fromNow()}</Typography>
                    </div>
                ) : (
                    <div className="message" onMouseOver={mouseEnter} onMouseLeave={mouseLeave} >
                            <div style={{display : 'flex'}} >
                                <Typography className="messText" style={{minWidth : '100%'}} >{msg}</Typography>
                            </div>
                        <Typography className="messtime" >{moment(createdAt).fromNow()}</Typography>
                    </div>
                )
            }
        </>
    )
}

export default MessagesContent
