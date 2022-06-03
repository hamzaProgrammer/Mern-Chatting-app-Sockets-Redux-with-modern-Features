import React, {useState, useEffect} from 'react'
import './ProfileSec.css'
import {AiOutlineSetting} from 'react-icons/ai'
import {Drawer, Button, Input , Typography, Divider, Row , Col ,Switch, notification, Spin , Popconfirm , Badge , Menu , Dropdown } from 'antd';
import {MdOutlineSecurity} from 'react-icons/md'
import {CgProfile} from 'react-icons/cg'
import {IoIosNotifications} from 'react-icons/io'
import {FiLogOut} from 'react-icons/fi'
import {IoMdNotifications} from 'react-icons/io'
import {GiCancel} from 'react-icons/gi'
import {useSelector, useDispatch} from 'react-redux'
import {showProfPicToStrangersFunc , showProfWhileSearch , canAnyOneSendRequest, updateMyProfPic, updateMyProfData , logMeout , setMyMsgNotification ,shoeChatScreen , getCrntUserOrFriend} from '../../../redux/actions/UserActions'
import {getMyNotifications, deleteNotification , acceptNotification } from '../../../server_api/Api'
const socket = require("socket.io-client")("http://localhost:8080");


const { TextArea } = Input;


const ProfileSec = () => {
    const dispatch = useDispatch();

    const [visible, setVisible] = useState(false);
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };

    const {currentUser, isFetching, errMsg, userActionSuccess, error , showChatScreen } = useSelector(state => state.usersReducer);

    const [ myUser , setMyUser ] = useState({name : currentUser?.name , status : currentUser?.status})
    const [ myNotifications , setmyNotifications ] = useState([]);

    const [ visibleProf, setvisibleProf ] = useState(false);
    const showDrawerProf = () => {
        setvisibleProf(true);
    };
    const onCloseProf = () => {
        setvisibleProf(false);
    };

    const [ visibleNotif, setvisibleNotif ] = useState(false);
    const showDrawerNotif = () => {
        setvisibleNotif(true);
    };
    const onCloseNotif = () => {
        setvisibleNotif(false);
    };

    const [ visibleSecu, setvisibleSecu ] = useState(false);
    const showDrawerSecu = () => {
        setvisibleSecu(true);
    };
    const onCloseSecu = () => {
        setvisibleSecu(false);
    };

    const openNotificationWithIcon = (type,msg) => {
        notification[type]({
            message: msg,
        });
    };

    useEffect(() => {
        if(userActionSuccess === true){
            openNotificationWithIcon("success", "Changes Saved SuccessFully")
        }
        if(error === true){
            openNotificationWithIcon("error", errMsg)
        }
    },[userActionSuccess,error,errMsg])

    useEffect(() => {
        const getData = async () => {
            const {data} = await getMyNotifications(currentUser?._id)
            console.log("all noti : ", data?.AllNotifications);
            setmyNotifications(data?.AllNotifications)
        }
        getData();
    },[visibleNotif])

    // changing profile Pic
    const changeProfPic = () => {
        dispatch(showProfPicToStrangersFunc(currentUser?._id), dispatch)
    }

    // changing profile Pic
    const changeProfMyInSearch = () => {
        dispatch(showProfWhileSearch(currentUser?._id), dispatch)
    }

    // changing everyone cans end request
    const changeEveryOneCanSendReq = () => {
        dispatch(canAnyOneSendRequest(currentUser?._id), dispatch)
    }

    // changing profile pic
    const handleImage = (e) => {
        dispatch(updateMyProfPic(e.target.files[0],currentUser?._id), dispatch)
    }

    // changing profile details
    const handleProfileDetails = (e) => {
        dispatch(updateMyProfData(myUser,currentUser?._id), dispatch)
    }

    // delete any notification
    const removeNotif = async (recieverId) => {
        const {data} = await deleteNotification(currentUser?._id , recieverId);
        if(data?.success === true){
            setmyNotifications(data?.updatedNotifications);
            openNotificationWithIcon("success", "Notification Removed Successfully")
        }else{
            openNotificationWithIcon("error", data?.message)
        }
    }

    // accept any notification
    const acceptMyNotif = async (recieverId) => {
        const {data} = await acceptNotification(currentUser?._id , recieverId);
        if(data?.success === true){
            setmyNotifications(data?.updatedNotifications);
            openNotificationWithIcon("success", "User Added to Your Friend List Successfully")
        }else{
            openNotificationWithIcon("error", data?.message)
        }
    }

    const confirm = () => {
        socket.emit("disconnectUser", currentUser)
        dispatch(logMeout(), dispatch)
    };

    const cancel = (e) => {
    };

    // notifications showing
    const menu = (
        <Menu style={{maxHeight : '400px', overflowY : 'scroll' , maxWidth : '300px' , minWidth : '300px' , backgroundColor : '#0D161C', }} >
            <Menu.Item style={{maxWidth : '300px', maxHeight : '40px', height : '40px' , margin : 0 , padding : 0 ,marginBottom : '10px',  borderBottom : '1px solid #ecf0f1' }} >
                <Typography style={{fontSize : '18px', fontWeight : 600 , textAlign : 'center' ,color : '#bdc3c7'}} className="menuItem" >New Messages Notifications</Typography>
            </Menu.Item>
            {
                currentUser.msgNotifications?.map((item) => (
                    <Menu.Item style={{maxWidth : '300px', maxHeight : '80px', height : '70px' , margin : 0 , padding : 0 , borderBottom : '1px solid #ecf0f1' }}  onClick={() => showChat(item?.Id)} >
                        <div style={{display : 'flex' , margin : 0 , padding : 0 , paddingLeft : '5px', paddingTop : '5px',  marginTop : '-10px'}}  >
                            <img src={item?.profilePic} alt="user imag" style={{maxWidth : '40px', maxHeight : '40px', borderRadius : '50%' ,  }}  />
                            <div style={{display : 'flex', flexDirection : 'column', paddingLeft : '5px' }}  >
                                <Typography style={{fontSize : '15px', fontWeight : 600 , color : '#FFFFFF'}} className="menuItem" >{item?.Name}</Typography>
                                <Typography style={{fontSize : '12px', fontWeight : 600, color : '#FFFFFF' ,  maxHeight : '40px', height : '40px', overflow: 'hidden' , wrap: 'wrap',  textOverflow : 'ellipsis' , maxWidth : '200px' }} >
                                    {item?.msg}
                                </Typography>
                            </div>
                        </div>
                    </Menu.Item>
                ))
            }

        </Menu>
    );

    // setting count of messages notification as 0
    const setToZero = () => {
        console.log("going to set to 0");
        dispatch(setMyMsgNotification(currentUser?._id), dispatch)
    }

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
            <div className="profileSec" >
                <img alt="user avatar" className="userImg" src={currentUser?.profilePic !== "" ? currentUser?.profilePic : "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_720.png"} />
                <Typography style={{fontSize: "15px", fontWeight : 600, color : '#FFFFFF', marginRight : 'auto', paddingLeft : '15px', textTransform: 'capitalize' }} >{currentUser?.name}</Typography>
                <Typography style={{fontSize: "10px", fontWeight : 600, color : '#FFFFFF', marginRight : 'auto', paddingLeft : '10px', textTransform: 'capitalize' }} >{currentUser?.isActive === true ? "Online" : "Offline"}</Typography>
                <div style={{display : 'flex', width : '90px', justifyContent : 'space-between'}} >
                    <AiOutlineSetting className="addChartIcon" onClick={showDrawer} />
                    <Dropdown overlay={menu} trigger={['click']} placement="topLeft">
                        <a onClick={(e) => e.preventDefault()}>
                            <Badge count={currentUser.msgNotfiCount} size="small">
                                <IoMdNotifications className="addChartIcon" style={{color : '#FFFFFF'}} onClick={setToZero} />
                            </Badge>
                        </a>
                    </Dropdown>
                    <Popconfirm
                        title="Do you want to logout?"
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <FiLogOut className="addChartIcon" />
                    </Popconfirm>
                </div>
            </div>

            {/* main drawer */}
            <Drawer width={300} closable={false} maskClosable={false}  placement="left" color="primary" bodyStyle={{ backgroundColor: "#202C33", padding: "0" , width : "100%"}} visible={visible}>
                <div className="rightDrawerDiv" >
                    <div style={{display : 'flex', justifyContent : 'space-between', width : '100%',borderBottom: '1px solid #7f8fa6'}}>
                        <Typography className="mainRigtHead" >Settings</Typography>
                        <GiCancel style={{fontSize : '25px', marginTop : '5px', color : '#c23616', cursor : 'pointer'}} onClick={onClose} />
                    </div>
                    <div className="moreDrawersHead" >
                        <div style={{display : 'flex', padding : '10px',cursor : 'pointer' }} >
                            <img alt="user avatar" style={{maxWidth : '70px', maxHeight : '70px', borderRadius : '50%'}} src={currentUser?.profilePic !== "" ? currentUser?.profilePic : "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_720.png"} />
                            <div style={{display : 'flex', flexDirection : 'column', paddingLeft : '10px', paddingTop : '10px'}} >
                                <Typography className="drswerRightUserName" style={{textTransform: 'capitalize'}} >{currentUser?.name}</Typography>
                                <Typography className="drswerRightUserstatus" >{currentUser?.status !== "" ? currentUser?.status : "Hey, there I am using WhatsaApp Web 2.0" }</Typography>
                            </div>
                        </div>
                        <div style={{display : 'flex', padding : '10px', borderBottom : '1px solid #353b48', marginTop : '30px', cursor : 'pointer'}} onClick={showDrawerSecu} >
                            <MdOutlineSecurity style={{color : '#FFFFFF', fontSize : '30px'}} />
                            <Typography style={{fontSize : '17px', color : '#FFFFFF', fontWeight : 600, paddingLeft : '10px'}} >Security</Typography>
                        </div>
                        <div style={{display : 'flex', padding : '10px', borderBottom : '1px solid #353b48',cursor : 'pointer'}} onClick={showDrawerProf} >
                            <CgProfile style={{color : '#FFFFFF', fontSize : '30px'}} />
                            <Typography style={{fontSize : '17px', color : '#FFFFFF', fontWeight : 600, paddingLeft : '10px'}} >Profile Settings</Typography>
                        </div>
                        <div style={{display : 'flex', padding : '10px', borderBottom : '1px solid #353b48',cursor : 'pointer'}} onClick={showDrawerNotif} >
                            <Badge size="small" count={2} >
                                <IoIosNotifications style={{color : '#FFFFFF', fontSize : '30px'}} />
                            </Badge>
                            <Typography style={{fontSize : '17px', color : '#FFFFFF', fontWeight : 600, paddingLeft : '10px'}} >Notifications</Typography>
                        </div>
                    </div>
                </div>
            </Drawer>

            {/* profile setting drawer */}
            <Drawer width={300} closable={false} maskClosable={false}  placement="left" color="primary" bodyStyle={{ backgroundColor: "#202C33", padding: "0" , width : "100%"}} visible={visibleProf} >
                <div className="rightDrawerDiv" >
                    <div style={{display : 'flex', justifyContent : 'space-between', width : '100%',borderBottom: '1px solid #7f8fa6'}}>
                        <Typography className="mainRigtHead" >Profile Settings</Typography>
                        <GiCancel style={{fontSize : '25px', marginTop : '5px', color : '#c23616', cursor : 'pointer'}} onClick={onCloseProf} />
                    </div>
                    <div style={{display : 'flex', flexDirection : 'column', paddingTop : '15px', minWidth : '100%', justifyContent : 'center', alignItems : 'center'}} >
                        <img alt="user imag" style={{maxWidth : '150px', maxHeight : '150px', borderRadius : '50%'}} src={currentUser?.profilePic !== "" ? currentUser?.profilePic : "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_720.png"} />
                        <label for="myId" style={{backgroundColor : '#ff7675', color : '#FFFFFF', borderRadius : '5px', height : '30px', fontWeight : 600 , paddingLeft : '5px' , paddingTop : '2px', marginTop : '15px' , fontSize : '14px', width : '100px'}} >Update Photo</label>
                        <Divider style={{backgroundColor : '#b2bec3',}} />
                        <input name="myId" id="myId" type="file" style={{display :'none' }} onChange={handleImage} />
                        <Typography style={{fontSize : '15px', fontWeight: 600, color : '#FFFFFF', marginTop : '20px'}} >Update Name:</Typography>
                        <Input className="nameUpdate" value={myUser?.name} onChange={(e) => setMyUser({...myUser , name : e.target.value})} />
                        <Typography style={{fontSize : '15px', fontWeight: 600, color : '#FFFFFF', marginTop : '20px'}} >Update Status:</Typography>
                        <TextArea maxLength={100} className="nameUpdate"  value={myUser?.status} onChange={(e) => setMyUser({...myUser , status : e.target.value})}  style={{height : '80px'}} />
                        <Button block className="updareProf" style={{marginTop : '20px'}} onClick={handleProfileDetails} >Update Profile</Button>
                        <Button block className="updareProf" style={{backgroundColor : '#d63031', marginTop : '50px'}} >Delete Account</Button>
                    </div>
                </div>
            </Drawer>

            {/* notifications drawer */}
            <Drawer width={300} closable={false} maskClosable={false}  placement="left" color="primary" bodyStyle={{ backgroundColor: "#202C33", padding: "0" , width : "100%"}} visible={visibleNotif} >
                <div className="rightDrawerDiv" >
                    <div style={{display : 'flex', justifyContent : 'space-between', width : '100%',borderBottom: '1px solid #7f8fa6'}}>
                        <Typography className="mainRigtHead" >Notifications</Typography>
                        <GiCancel style={{fontSize : '25px', marginTop : '5px', color : '#c23616', cursor : 'pointer'}} onClick={onCloseNotif} />
                    </div>
                    {
                        myNotifications?.length > 0 ? (
                            myNotifications?.map((item) => (
                                <Row style={{ minWidth : '100%', marginTop : '10px', borderBottom : '1px solid #636e72', paddingBottom : '7px'}} key={item?.Id} >
                                    <Col xs={2} sm={2} md={2} lg={2} xl={2}>
                                        <img alt="sender imahe" style={{maxWidth : '50px', maxHeight : '50px', borderRadius : '50%'}} src={item?.profilePic !== "" ? currentUser?.profilePic : "https://cdn.pixabay.com/photo/2016/08/20/05/38/avatar-1606916_960_720.png"} />
                                    </Col>
                                    <Col xs={14} sm={14} md={14} lg={14} xl={14} >
                                        <div style={{display : 'flex', flexDirection : 'column', marginLeft : '35px', paddingTop : '5px'}} >
                                            <Typography style={{fontSize : '15px', fontWeight : 600, color : '#FFFFFF'}} >{item?.name}</Typography>
                                            <Typography style={{fontSize : '10px', fontWeight : 400, color : '#FFFFFF'}} >{item?.phoneNo}</Typography>
                                        </div>
                                    </Col>
                                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                        {console.log("item?.Id : of friend", item?.Id)}
                                        <div style={{display :'flex', flexDirection : 'column'}} >
                                            <Button className="acceptBtn" onClick={() => acceptMyNotif(item?.Id)} >Accept</Button>
                                            <Button className="rejectBtn" onClick={() => removeNotif(item?.Id)} >Remove</Button>
                                        </div>
                                    </Col>
                                </Row>
                            ))
                        ) : (
                            <Typography style={{textAlign: 'center', marginTop : '20px', fontSize : '15px', fontWeight : 600 , color : '#FFFFFF'}} >No Notifications Found</Typography>
                        )
                    }
                </div>
            </Drawer>

            {/* Security drawer */}
            <Drawer width={300} closable={false} maskClosable={false}  placement="left" color="primary" bodyStyle={{ backgroundColor: "#202C33", padding: "0" , width : "100%"}} visible={visibleSecu} >
                <div className="rightDrawerDiv" >
                    <div style={{display : 'flex', justifyContent : 'space-between', width : '100%',borderBottom: '1px solid #7f8fa6'}}>
                        <Typography className="mainRigtHead" >Security</Typography>
                        <GiCancel style={{fontSize : '25px', marginTop : '5px', color : '#c23616', cursor : 'pointer'}} onClick={onCloseSecu} />
                    </div>
                    <div style={{display : 'flex', justifyContent : 'space-between', minWidth : '100%', marginTop : '20px', paddingBottom : '10px', borderBottom : '1px solid #636e72'}} >
                        <Typography style={{fontSize : '14px', fontWeight : 600, color : '#FFFFFF' }} >Show Profile Pic to Strangers</Typography>
                        <Spin spinning={isFetching}>
                            <Switch defaultChecked={currentUser?.showProfPic} onChange={changeProfPic} />
                        </Spin>
                    </div>
                    <div style={{display : 'flex', justifyContent : 'space-between', minWidth : '100%', marginTop : '20px', paddingBottom : '10px', borderBottom : '1px solid #636e72'}} >
                        <Typography style={{fontSize : '14px', fontWeight : 600, color : '#FFFFFF' }} >Show My Profile in Search Results</Typography>
                        <Spin spinning={isFetching}>
                            <Switch defaultChecked={currentUser?.showProfInSearch} onChange={changeProfMyInSearch} />
                        </Spin>
                    </div>
                    <div style={{display : 'flex', justifyContent : 'space-between', minWidth : '100%', marginTop : '20px', paddingBottom : '10px', borderBottom : '1px solid #636e72'}} >
                        <Typography style={{fontSize : '14px', fontWeight : 600, color : '#FFFFFF' }} >Every One can Send Friend Request</Typography>
                        <Spin spinning={isFetching}>
                            <Switch defaultChecked={currentUser?.anyOneCanSendReq} onChange={changeEveryOneCanSendReq} />
                        </Spin>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

export default ProfileSec
