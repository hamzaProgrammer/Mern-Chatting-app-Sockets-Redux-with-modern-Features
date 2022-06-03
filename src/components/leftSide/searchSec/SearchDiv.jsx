import React, {useState , useEffect } from 'react'
import './SearchDiv.css'
import {Input} from 'antd'
import {useDispatch, useSelector} from 'react-redux'
import {hideMyFriendsSec , showMyFriendsSec , getAllMatchingFreinds} from '../../../redux/actions/UserActions'


const SearchDiv = () => {
    const [ text , setText ] = useState("");
    const dispatch = useDispatch()
    const {currentUser } = useSelector(state => state.usersReducer)

    useEffect(() => {
        if(text?.length > 0){
            dispatch(hideMyFriendsSec())
            dispatch(getAllMatchingFreinds(text, currentUser?._id), dispatch)
        }else{
            dispatch(showMyFriendsSec())
        }
    },[text])

    return (
        <>
            <div className="searchDiv" >
                <Input placeholder="Search your friend" size="medium" className="searchField" value={text} onChange={(e)=>setText(e.target.value)} />
            </div>
        </>
    )
}

export default SearchDiv
