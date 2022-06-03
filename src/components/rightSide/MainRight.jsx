import React , {useEffect} from 'react'
import { Layout ,Spin ,Typography , notification } from 'antd';
import MyHeader from './header/Header'
import MessageContent from './msgscontent/MessagesContent'
import BlankScreen from './blankScreen/BlankScreen'
import MyFooter from './footer/Footer'
import {useSelector} from 'react-redux'
import { ScrollWrapper } from "react-bottom-scroll";


const { Header, Footer, Content } = Layout;

const MainRight = () => {
    const { showChatScreen , isFetching , currentChat , currentUser , connectReqSent , connectReqSentMsg } = useSelector(state => state.usersReducer)

    // auto scroll
    const wraperstyle = {
        width: "100%",
        height: "100%",
        overflowY: "auto",
    };

    // showing error on sending message
    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: connectReqSentMsg
        });
    };

    useEffect(() => {
        if(connectReqSent === true){
            openNotificationWithIcon("error")
        }
    },[connectReqSent])


    return (
        <>
            {
                showChatScreen === false ? (
                    <BlankScreen />
                ) : (
                    <Layout style={{backgroundColor : '#202C33', color : '#FFFFFF', minHeight : '100vh', maxHeight : '100vh'}} >
                        <Header style={{backgroundColor : '#202C33', maxHeight : '61px'}}>
                            <MyHeader />
                        </Header>

                        {
                            isFetching === true && currentChat === [] ? (
                                <Spin size="small" />
                            ) : (
                                <Content style={{backgroundColor : '#0D161C', paddingBottom : '30px', maxHeight : '100vh', overflowY: 'scroll'}}  >
                                    <ScrollWrapper
                                        wrapperStyle={wraperstyle}
                                        minScroll={100}
                                        smoothBehavior
                                        >
                                        {
                                            currentChat?.length > 0 ? (
                                                currentChat?.map((item) => (
                                                    currentUser?._id === item?.sender ? <MessageContent owner={true} msg={item?.MsgText} sender={item?.sender} reciever={item?.reciever} id={item?.MsgId} createdAt={item?.createdAt} key={item?.createdAt} /> : <MessageContent msg={item?.MsgText} sender={item?.sender} reciever={item?.reciever} id={item?.MsgId} createdAt={item?.createdAt} key={item?.createdAt} />
                                                ))
                                            ) : (
                                                <Typography style={{marginTop : '150px', color : '#FFFFFF', fontWeight : 600 , textAlign : 'center'}} >No Chat Found Between users</Typography>
                                            )
                                        }
                                    </ScrollWrapper>
                                </Content>
                            )
                        }
                        <Footer style={{ backgroundColor : '#202C33', maxHeight : '65px' ,}}>
                            <MyFooter style={{marginTop : '55px'}} />
                        </Footer>
                    </Layout>
                )
            }

        </>
    )
}

export default MainRight
