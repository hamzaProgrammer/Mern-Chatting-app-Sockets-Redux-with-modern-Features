import React from 'react'
import {Row, Col , Layout } from 'antd';
import SignIn from '../../components/signIn/SignIn'


const { Content } = Layout;

const MyignIn = () => {
    return (
        <>
            <Layout>
                <Content style={{backgroundColor : '#202C33', color : '#FFFFFF', minHeight : '100vh'}} >
                    <Row>
                        <Col xs={23} sm={23} md={23} lg={23} xl={23}>
                            <SignIn />
                        </Col>
                    </Row>
                </Content>
            </Layout>

        </>
    )
}

export default MyignIn
