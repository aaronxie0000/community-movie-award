import React from 'react';
import styled from 'styled-components';

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase.js";


const List = styled.ul` 
  list-style: none;
  margin: 1rem 0 0 3rem;

  & li{
    line-height: 2rem;
  }

`;

function ShortList() {
    const [user, loading, error] = useAuthState(firebase.auth());
  
    if (loading) {
      return <p>Loading user...</p>;
    }
  
    if (error) {
      return <p>Error:{error}</p>;
    }
  
    // if (user) {
    //   return (
    //     <>
    //       <p>{user.email}</p>
    //       <p>{user.uid}</p>
    //     </>
    //   );
    // }
  
    return (
        <>
            <List>
                <li>hi</li>
                <li>Hi1</li>
            </List>
        </>
    )

};

export default ShortList;
