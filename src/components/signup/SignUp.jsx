import React , {useState} from 'react'
import './SignUp.css'
import {Row, Col, Typography, Input,Button, notification } from 'antd';
import {signUpUser} from '../../server_api/Api'


const init = {
    email : '',
    name : '',
    phoneNo : '',
    password: ''
}

const SignUp = () => {
    const [ userData , setUserData ] = useState(init);

    // sending data to server
    const handleSubmit = async () => {
        if(userData?.email === "" || userData?.name === "" || userData?.phoneNo === "" || userData?.password === "" ){
            openNotification("error", "All Fields Are Required")
        }else{
            const {data} = await signUpUser(userData);
            console.log("data : ", data);
            if(data?.success === true){
                openNotification("success", data?.message);
                setUserData(init)
            }else{
                openNotification("error", data?.message);
            }
        }
    }

    const openNotification = (type, msg) => {
        notification[type]({
            message: msg,
        });
    };
    return (
        <>
            <Row className="mainRoe" >
                <Col xs={{span : 1}} sm={{span : 4}} md={{span : 6}} lg={{span : 7}} xl={{span : 9}}></Col>
                <Col xs={{span : 23}} sm={{span : 16}} md={{span : 12}} lg={{span : 10}} xl={{span : 8}}>
                    <div className="mainSigUp" >
                        <div className="innerMainDivOne" >
                            <img alt="app logo" src="https://www.freepnglogos.com/uploads/whatsapp-logo-png-transparent-33.png" style={{maxWidth:"100px", maxHeight:"100px"}} />
                            <Typography style={{fontSize: '20px', fontWeight : 700, color :'#FFFFFF', paddingBottom : '20px', paddingTop : '20px'}} >Sign Up</Typography>
                            <Typography style={{fontSize: '15px', fontWeight : 700, color :'#FFFFFF', marginRight : 'auto', paddingLeft : '20px'}} >Email:</Typography>
                            <Input className="myInput" placeholder="Email" size="medium" value={userData?.email} onChange={(e) => setUserData({...userData, email : e.target.value})} />
                            <Typography style={{fontSize: '15px', fontWeight : 700, color :'#FFFFFF', marginRight : 'auto', paddingLeft : '20px', paddingTop : '15px'}} >Phone No.:</Typography>
                            <Input className="myInput" placeholder="Phone No." size="medium" type="number" value={userData?.phoneNo} onChange={(e) => setUserData({...userData, phoneNo : e.target.value})} />
                            <Typography style={{fontSize: '15px', fontWeight : 700, color :'#FFFFFF', marginRight : 'auto', paddingLeft : '20px', paddingTop : '15px'}} >User Name:</Typography>
                            <Input className="myInput" placeholder="User Name" size="medium" value={userData?.name} onChange={(e) => setUserData({...userData, name : e.target.value})}  />
                            <Typography style={{fontSize: '15px', fontWeight : 700, color :'#FFFFFF', marginRight : 'auto', paddingLeft : '20px', paddingTop : '15px'}} >Password:</Typography>
                            <Input className="myInput" placeholder="Password" size="medium" value={userData?.password} onChange={(e) => setUserData({...userData, password : e.target.value})} />
                            <Button className="signUpBtn" onClick={handleSubmit} >Sign up</Button>
                            <Typography style={{fontSize: '13px', fontWeight : 500, color :'#FFFFFF',   paddingTop : '30px', textDecoration : 'underline', cursor: 'pointer'}} >already have an account? Sign In Now</Typography>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default SignUp