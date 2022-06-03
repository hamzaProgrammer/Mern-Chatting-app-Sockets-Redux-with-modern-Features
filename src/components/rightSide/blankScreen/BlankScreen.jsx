import React  from 'react'
import './BlankScreen.css'
import {Typography} from 'antd';


const BlankContent = () => {
    return (
        <>
            <div className="blackDiv" >
                <Typography className="blankHead" >Welcome to WhatsApp Web 2.0</Typography>
                <Typography className="blankHeadTo" >An Emerging Chatting App now a days.</Typography>
                <Typography className="blankText" >Start Searching your friends by their Phone No. and start chatting with them. All Chat between you and your friends is end-to-end encrypted</Typography>
            </div>
        </>
    )
}

export default BlankContent