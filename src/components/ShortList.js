import React, { useEffect } from "react";
import styled from "styled-components";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase.js";
import { db } from "../firebase.js";

import { SmallButton } from "./common/SmallButton.js";

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

function ShortList({ myNoms, setMyNoms, setTitle }) {
  const [user] = useAuthState(firebase.auth());

  //gets existing user's data and put it into their nominations list; when log out remove the list; if new user (querySnapshot.forEach no loop) create that user
  useEffect(() => {
    let fetchedData = false;

    async function getUsersList() {
      const docRef = db.collection("userData").where("uid", "==", user.uid);
      const querySnapshot = await docRef.get();
      querySnapshot.forEach((doc) => {
        fetchedData = true;
        setMyNoms(doc.data().movies);
      });
    }

    function tryAddUser() {
      if (fetchedData) return;
      else {
        // for (let i=0; i<myNoms.length; i++){
        //   myNoms[i].uid = user.uid;
        // }
        //start fresh when user log in
        setMyNoms([]);

        db.collection("userData").add({
          uid: user.uid,
          movies: myNoms,
        });

        fetchedData = false;
      }
    }

    //runner
    if (user) {
      getUsersList().then(tryAddUser);
    } else {
      //for when log out
      setMyNoms([]);
      setTitle("");
    }
  }, [user]);

  //whenever new items add into the nomination list, add to the current user's list if logged in
  useEffect(() => {
    if (!user) {
      return;
    }

    //updating with query need to use work around with get()
    const docRef = db
      .collection("userData")
      .where("uid", "==", user.uid)
      .limit(1);

    docRef.get().then((query) => {
      const match = query.docs[0];
      if (match) {
        match.ref.update({
          movies: myNoms,
        });
      }
    });
  }, [myNoms]);

  //remove movie, take it away from the nominations list (which as a result, will take away from user's list in database), and from the all nominations list
  function removeMovie(e) {
    const temp = e.target.parentNode.textContent;
    const targetMovie = temp.split(" (")[0];
    let targetMovieID = "";

    setMyNoms((prev) =>
      prev.filter((nom) => {
        if (nom.Title === targetMovie) {
          targetMovieID = nom.imdbID;
          removeFromAllNom(); // to remove from all Nom after found the movie; if call outside of this, may remove before the target ID is set
          return false; //false is fail test, and is removed
        } else {
          return true;
        }
      })
    );

    async function removeFromAllNom() {
      const docRef = db
        .collection("allNoms")
        .where("imdbID", "==", targetMovieID);
      const querySnapshot = await docRef.get();
      querySnapshot.forEach((doc) => {
        doc.ref.delete();
      });
    }
  }

  return (
    <>
      <List>
        {myNoms.map((movie, index) => {
          return (
            <Item key={index}>
              {movie.Title} ({movie.Year})
              <SmallButton
                mColor={(props) => props.theme.tchColor}
                hColor={"#DE3618"}
                onClick={removeMovie}
              >
                Remove
              </SmallButton>{" "}
            </Item>
          );
        })}
      </List>
    </>
  );
}

export default ShortList;
