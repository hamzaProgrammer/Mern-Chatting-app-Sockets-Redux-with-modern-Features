import React, {useState} from 'react';
import {Input, Button} from 'antd';
import './Footer.css'
import {useSelector, useDispatch} from 'react-redux'
import {sendNewMsg} from '../../../redux/actions/UserActions'

const Footer = () => {
  const [ msg , setMsg ] = useState("");
  const [isDisabled , setDisabled ] = useState(false);
  const dispatch = useDispatch();
  const {currentFriend , currentUser} = useSelector(state => state.usersReducer);

  // sending message on pressing button
  const sendMsg = () => {
    let obj = {senderId : currentUser._id , recieverId : currentFriend._id , msg : msg }
    if(msg !== ""){
      dispatch(sendNewMsg(obj), dispatch)
      setMsg("");
    }
  }

  // sending message on pressing enter keyword
  const commentEnterSubmit = (e) => {
      if (e.key === "Enter" && e.shiftKey === false) {
          setDisabled(true)
          let obj = {senderId : currentUser._id , recieverId : currentFriend._id , msg : msg }
          if(msg !== ""){
              dispatch(sendNewMsg(obj), dispatch)
              setMsg("");
          }
          setDisabled(false)
      }
  }

  return (
    <>
        <div className="footer" >
            <Input placeholder="Type your message ..." className="sendMessageInput" value={msg} onChange={(e) => setMsg(e.target.value) } size="large" onKeyPress={commentEnterSubmit} />
            <Button className="sendBtn" onClick={sendMsg} disabled={isDisabled} >Send</Button>
        </div>
    </>
  );
}

export default Footer;
