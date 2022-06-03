import React from 'react'
import {Row, Col , Layout } from 'antd';
import LeftSide from '../../components/leftSide/MainLeft'
import RightSide from '../../components/rightSide/MainRight'


const { Content } = Layout;

const Home = () => {
    return (
        <>
            <Layout>
                <Content style={{backgroundColor : '#202C33', color : '#FFFFFF', minHeight : '100vh'}} >
                    <Row>
                        <Col xs={1} sm={1} md={6} lg={7} xl={7} style={{borderRight : '1px solid #636e72',minHeight : '100vh'}} >
                            <LeftSide />
                        </Col>
                        <Col xs={23} sm={23} md={18} lg={17} xl={17}>
                            <RightSide/>
                        </Col>
                    </Row>
                </Content>
            </Layout>

        </>
    )
}

export default Home
