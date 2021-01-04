import React, { useEffect } from "react";
import styled from "styled-components";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase.js";
import { db } from '../firebase.js'

import { SmallButton } from './common/SmallButton.js'

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
  const [user] = useAuthState(firebase.auth());


  //The two useEffect is only for userData; does not effect allNoms document (firestore)

  useEffect(() => {
    //don't need the auto refreshing one; get data once
    const docRef = db.collection("userData").where("uid", "==", user.uid)

    docRef.get().then(function (doc) {
      if (doc.exists) {
        console.log(doc.data());
        setMyNoms(doc.data().movies)

      } else {
        //user's first log in
      }
    })
  }, [user])


  useEffect(() => {
    console.log(myNoms)

    const docRef = db.collection("userData").where("uid", "==", user.uid)

    docRef.update({
      movies: myNoms
    })
      .catch(() => {
        //if need to create new user or is just guest
        
        if (!user.uid) {
          console.log("Created User");
          
          db.collection("userData").add({
            uid: user.uid,
            movie: myNoms
          })
        }

      })

  }, [myNoms])

  function removeMovie(e) {
    const temp = e.target.parentNode.textContent;
    const targetMovie = temp.split(" (")[0];
    let targetMovieID = "";

    setMyNoms(prev => prev.filter((nom) => {
      if (nom.Title===targetMovie){
        targetMovieID = nom.imdbID;
        console.log(targetMovieID);
        return false; //false is fail test, and is removed
      }
      else{
        return true;
      }

    }));

    db.collection("allNoms").where("imdbID","==",targetMovieID).delete()
      .catch((err)=>{console.log(err)});

  }

  return (
    <>
      <List>
        {myNoms.map((movie, index) => {
          return (
            <Item key={index}>
              {movie.Title} ({movie.Year})
              <SmallButton color={(props) => props.theme.tchColor} hColor={'#DE3618'} onClick={removeMovie}>Remove</SmallButton>{" "}
            </Item>
          );
        })}
      </List>
    </>
  );
}

export default ShortList;
