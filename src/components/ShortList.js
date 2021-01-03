import React from "react";
import styled from "styled-components";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase.js";

import {SmallButton} from './common/SmallButton.js'

const List = styled.ul`
  list-style: none;
  margin-top: 2rem;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 400;
`;



function ShortList({ myNoms, setMyNoms }) {
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
        {myNoms.map((movie, index) => {
          return (
            <Item key={index}>
              {movie.Title} ({movie.Year})
              <SmallButton color={(props) => props.theme.tchColor} hColor={'#DE3618'} onClick={() => console.log("Remove")}>Remove</SmallButton>{" "}
            </Item>
          );
        })}
      </List>
    </>
  );
}

export default ShortList;
