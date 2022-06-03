import React , {useState, useEffect} from 'react'
import './Header.css'
import {Typography,Menu, Dropdown, Drawer, Button, Input , Spin, notification} from 'antd';
import {AiOutlineSearch} from 'react-icons/ai'
import {FiMoreVertical} from 'react-icons/fi'
import {BiBlock} from 'react-icons/bi'
import {useSelector, useDispatch } from 'react-redux'
import {hideChatScreen, getMyChatBetTwoUsers, deleteMyAllMsgs} from '../../../redux/actions/UserActions'
import {addRemoveToBlockList, getMatchedMsgs} from '../../../server_api/Api'
import moment from 'moment'

const Header = () => {
    const dispatch = useDispatch();
    const {currentFriend , friendFetched , currentFriendErr, currentUser ,currentChat , allMsgsDelete  } = useSelector(state => state.usersReducer)
    const [ text, setText ] = useState("");
    const [ allMatchedMsgs, setallMatchedMsgs ] = useState([]);

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const [visibleSearch, setvisibleSearch ] = useState(false);
    const showDrawerSearch = () => {
        setvisibleSearch(true);
    };
    const onCloseSdearch = () => {
        setvisibleSearch(false);
    };

    const deleteMyAllAllChat = () => {
        dispatch(deleteMyAllMsgs(currentUser?._id, currentFriend?._id), dispatch)
    }

    const menu = (
        <Menu direction="vertical" className="dispMenu" >
            <Menu.Item key="profile" className="menuItemsProfile" onClick={showDrawer} >
                Contact Information
            </Menu.Item>
            <Menu.Item key="settings" className="menuItemsProfile" onClick={() => dispatch(hideChatScreen(), dispatch)} >
                Close Chat
            </Menu.Item>
            {
                currentChat?.length > 0 && <Menu.Item key="logout" className="menuItemsProfile" onClick={deleteMyAllAllChat} >Delete Chat </Menu.Item>
            }
        </Menu>
    );

    useEffect(() => {
        if(currentFriend !== null){
            dispatch(getMyChatBetTwoUsers(currentUser?._id,currentFriend?._id), dispatch)
        }
    },[currentFriend?._id, currentUser?._id, dispatch])

    const blockUser = async () => {
        const {data} = await addRemoveToBlockList(currentUser?._id,currentFriend?._id);
        if(data?.success === true){
            openNotificationWithIcon("success", data?.message)
        }else{
            openNotificationWithIcon("error", data?.message)
        }
    }

    const openNotificationWithIcon = (type,msg) => {
        notification[type]({
            message: msg
        });
    };

    useEffect(() => {
        if(text.length > 0){
            const getRes = async () => {
                const {data} = await getMatchedMsgs(currentUser?._id, currentFriend?._id, text);
                console.log("res : ", data?.AllMatchedMsgs);
                setallMatchedMsgs(data?.AllMatchedMsgs)
            }
            getRes();
        }else{
            setallMatchedMsgs([])
        }
    },[text])

    return (
        <>
            {
                friendFetched === false ? (
                    <Spin size="small" />
                ) : (
                    currentFriendErr === true ? (
                        <Typography style={{color : '#FFFFFF', marginTop : '20%', textAlign : 'center'}} >Sorry, Could Not Get Details of Current User.</Typography>
                    ) : (
                        <>
                            <div className="rightHeader" >
                                <div style={{display : 'flex',}} className="giveDist" >
                                    <img alt="user imag" style={{maxWidth: '45px', maxHeight : '45px', borderRadius : '50%' }} src= {currentFriend?.profilePic !== "" ? currentFriend?.profilePic : "https://pps.whatsapp.net/v/t61.24694-24/269486645_169007162152247_787207012335932427_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVxGaSuncmXfYdLcfP4akHEkuSOFCe-9H-CpgbhIvW70ew&oe=628E6B58"} />
                                    <div style={{display : 'flex', flexDirection : 'column'}} >
                                        <Typography className="CUserName" >{currentFriend?.name}</Typography>
                                        <Typography className="ClastSeen" >{currentFriend?.phoneNo }</Typography>
                                    </div>
                                </div>
                                <div style={{display : 'flex', paddingTop: '20px', width : '60px',  justifyContent: 'space-between' }} >
                                    <AiOutlineSearch className="rightSideHeadicons" onClick={showDrawerSearch} />
                                    <Dropdown overlay={menu} trigger={['click']}  >
                                        <a onClick={(e) => e.preventDefault()}>
                                            <FiMoreVertical className="rightSideHeadicons rightSideHeadiconsOne" />
                                        </a>
                                    </Dropdown>
                                </div>
                            </div>

                            <Drawer width={300} closable={false}  placement="right" color="primary" bodyStyle={{ backgroundColor: "#202C33", padding: "0" , width : "100%"}}  onClose={onClose} visible={visible}>
                                <div className="mainInfoDiv" >
                                    <Typography className="contactTitle" >Contact Info</Typography>
                                    <div className="userDrawerInfo" >
                                        <img alt="user profile pic" style={{maxWidth : '200px', maxHeight : '200px' , borderRadius : '50%', cursor : 'url'}} src= {currentFriend?.profilePic !== "" ? currentFriend?.profilePic : "https://pps.whatsapp.net/v/t61.24694-24/269486645_169007162152247_787207012335932427_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVxGaSuncmXfYdLcfP4akHEkuSOFCe-9H-CpgbhIvW70ew&oe=628E6B58"} />
                                        <Typography className="drawerUserName" >{currentFriend?.name}</Typography>
                                        <Typography className="drawerUserNo" >{currentFriend?.phoneNo}</Typography>
                                    </div>
                                    <div className="userDrawerInfo" style={{marginTop : '10px'}} >
                                        <Typography className="drawerUserStatusHead" >Status</Typography>
                                        <Typography className="drawerUserStatus" >{ currentFriend?.status !== "" ? currentFriend?.status :  "Hey, tehre I am using WhatsApp web 2.0"}</Typography>
                                    </div>
                                    <div className="userDrawerInfo" style={{marginTop : '10px'}} >
                                        {
                                            currentChat?.length > 0 && (<Button className="delChatUser" icon={<BiBlock className="blockIcon" />} onClick={deleteMyAllAllChat} >Delete All Chat</Button>)
                                        }
                                        <Button className="blockUser" icon={<BiBlock className="blockIcon" />} onClick={blockUser} >Block {currentFriend?.name}</Button>
                                    </div>
                                </div>
                            </Drawer>

                            <Drawer width={300} closable={false}  placement="right" color="primary" bodyStyle={{ backgroundColor: "#202C33", padding: "0" , width : "100%"}}  onClose={onCloseSdearch} visible={visibleSearch}>
                                <div className="mainInfoDiv" >
                                    <Typography className="contactTitle" >Search Messages</Typography>
                                    <div className="userDrawerInfo" >
                                        <Input className="serachMesg" placeholder="search any message" value={text} onChange={(e) => setText(e.target.value) } />
                                        {
                                            allMatchedMsgs?.length > 0 ? (
                                                allMatchedMsgs?.map((item) => (
                                                    <div className="searchMsg" key={item?._id} style={{minWidth : '100%', paddingLeft : '10px', paddingRight : '10px'}}>
                                                            <Typography className="searchMsgDate" >{moment(item?.createdAt).fromNow()}</Typography>
                                                            {
                                                                item?.senderId === currentUser?._id &&  <Typography className="searchMsgDate" style={{marginTop : '-20px', marginLeft : 'auto'}} >sent by You</Typography>
                                                            }
                                                        <Typography className="searchMsgText" style={{textAlign : 'left'}} >{item?.msg}</Typography>
                                                    </div>
                                                ))
                                            ) : (
                                                <Typography style={{fontSize : '15px', color : '#FFFFFF', textAlign : 'center', marginTop : '25px'}} >No Matched Messages Found</Typography>
                                            )
                                        }
                                    </div>
                                </div>
                            </Drawer>
                        </>
                    )
                )
            }

        </>
    )
}

export default Header
