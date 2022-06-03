import React from 'react';
import ProfileSec from './profileSec/ProfileSec'
import SerachTag from  './searchSec/SearchDiv'
import Friends from './friends/Friends'

const MainLeft = () => {
  return (
    <>
        <ProfileSec />
        <SerachTag />
        <Friends/>
    </>
  );
}

export default MainLeft;
