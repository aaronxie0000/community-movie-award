import React from 'react';
import styled from 'styled-components';

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase.js";


const List = styled.ul` 
  list-style: decimal;
  margin: 1rem 0 0 5rem;

  & li{
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 400;
  }

`;

function ShortList({myNoms, setMyNoms}) {
    const [user, loading, error] = useAuthState(firebase.auth());

    //useEffect with [user]
  
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
                {myNoms.map((movie, index)=>{
                  return(<li key={index}>{movie}</li>)
                })}
            </List>
        </>
    )

};

export default ShortList;
