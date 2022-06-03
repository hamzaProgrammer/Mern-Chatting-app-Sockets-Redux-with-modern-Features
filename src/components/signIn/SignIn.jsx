import React , {useState, useEffect} from 'react'
import '../signup/SignUp.css'
import {Row, Col, Typography, Input,Button, Spin } from 'antd';
import {LoginUser} from '../../redux/actions/UserActions'
import {useSelector, useDispatch} from 'react-redux'


const init = {
    phoneNo : '',
    password: ''
}

const SignIn = () => {
    const [ userData , setUserData ] = useState(init);
    const dispatch = useDispatch();
    const {isFetching} = useSelector(state => state.usersReducer);

    // sending data to dispatch
    const handleSubmit = async () => {
        dispatch(LoginUser(userData), dispatch)
    }

    return (
        <>
            <Row className="mainRoe" >
                <Col xs={{span : 1}} sm={{span : 4}} md={{span : 6}} lg={{span : 7}} xl={{span : 9}}></Col>
                <Col xs={{span : 23}} sm={{span : 16}} md={{span : 12}} lg={{span : 10}} xl={{span : 8}}>
                    <div className="mainSigUp" >
                        <div className="innerMainDivOne" >
                            <img alt="app logo" src="https://www.freepnglogos.com/uploads/whatsapp-logo-png-transparent-33.png" style={{maxWidth:"100px", maxHeight:"100px"}} />
                            <Typography style={{fontSize: '20px', fontWeight : 700, color :'#FFFFFF', paddingBottom : '20px', paddingTop : '20px'}} >Log In Now</Typography>
                            <Typography style={{fontSize: '15px', fontWeight : 700, color :'#FFFFFF', marginRight : 'auto', paddingLeft : '20px', paddingTop : '15px'}} >Phone No.:</Typography>
                            <Input className="myInput" placeholder="Phone No." size="medium" type="number" value={userData?.phoneNo} onChange={(e) => setUserData({...userData, phoneNo : e.target.value})} />
                            <Typography style={{fontSize: '15px', fontWeight : 700, color :'#FFFFFF', marginRight : 'auto', paddingLeft : '20px', paddingTop : '15px'}} >Password:</Typography>
                            <Input className="myInput" placeholder="Password" size="medium" value={userData?.password} onChange={(e) => setUserData({...userData, password : e.target.value})} />
                            <Spin spinning={isFetching}>
                                <Button className="signUpBtn" onClick={handleSubmit} >Sign In</Button>
                            </Spin>
                            <Typography style={{fontSize: '13px', fontWeight : 500, color :'#FFFFFF',   paddingTop : '30px', textDecoration : 'underline', cursor: 'pointer'}} >don't have an account? Sign Up Now</Typography>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default SignIn