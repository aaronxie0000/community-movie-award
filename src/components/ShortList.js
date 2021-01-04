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

function ShortList({ myNoms, setMyNoms }) {
  const [user] = useAuthState(firebase.auth());

  //gets existing user's data and put it into their nominations list; when log out remove the list
  useEffect(() => {
    async function getUsersList() {
      const docRef = db.collection("userData").where("uid", "==", user.uid);
      const querySnapshot = await docRef.get();
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setMyNoms(doc.data().movies);
      });
    }

    if (user) {
      getUsersList();
    } else {
      //for when log out
      setMyNoms([]);
    }
  }, [user]);

  //whenever new items add into the nomination list, add to the current user's, or if there is an user logged in but no records, create that new user with their current movie nomination
  useEffect(() => {
    console.log(myNoms);

    const userID = user ? user.uid : "NONE";

    //updating with query need to use work around with get()
    const docRef = db
      .collection("userData")
      .where("uid", "==", userID)
      .limit(1);

    docRef.get().then((query) => {
      const match = query.docs[0];
      console.log(match);
      console.log(userID);

      if (match) {
        match.ref.update({
          movies: myNoms,
        });
      }

      //create new user
      if (!match && userID !== "NONE") {
        console.log("added user");
        db.collection("userData").add({
          uid: user.uid,
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
          console.log(targetMovieID);
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

    removeFromAllNom();
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
