import React, { useRef } from "react";
import styled from "styled-components";

import { db } from "./../firebase.js";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "./../firebase.js";
import firebaseOff from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

import { SmallButton } from "./common/SmallButton.js";

const AllNomCont = styled.div`
  border: 2px solid ${(props) => props.theme.mainColor};
  border-radius: 5px;
  padding: 2rem 2rem;

  margin: 4rem 0 0 0;
  width: 80vw;
  height: 80vh;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.mainColor};
`;

const Table = styled.table`
  margin-top: 3rem;
  width: 80%;
  border-collapse: collapse;
  table-layout: fixed;

  & tr {
    & th {
      font-size: 1.5rem;
      height: 2.5rem;
      vertical-align: top;
    }
  }
`;

const Entry = styled.tr`
  & td {
    font-size: 1.2rem;

    padding: 0.5rem 0.2rem;
    text-align: center;

    & button {
      margin-left: 1rem;
    }
  }
`;

function AllNom() {
  const [communityNom] = useCollection(
    db.collection("allNoms").orderBy("votes", "desc")
  );
  const [user] = useAuthState(firebase.auth());

  const localVotes = useRef([]);

  function handleVote(movieID) {
    const docRef = db
      .collection("allNoms")
      .where("imdbID", "==", movieID)
      .limit(1);

    docRef.get().then((query) => {
      const match = query.docs[0];
      if (match) {
        match.ref.update({
          voters: firebaseOff.firestore.FieldValue.arrayUnion(
            user ? user.uid : null
          ),
          votes: firebaseOff.firestore.FieldValue.increment(1),
        });
      }
    });

    if (!user) {
      localVotes.current.push(movieID);
    }
  }

  function isNomUser(voters, movieID) {
    if (user && voters.includes(user.uid)) {
      return true;
    } else if (!user && localVotes.current.includes(movieID)) {
      return true;
    } else {
      return false;
    }
  }

  return (
    <AllNomCont>
      <Title>Community's Nominations</Title>
      <Table>
        <tbody>
          <tr>
            <th colSpan="2">Movie</th>
            <th>Year</th>
            <th>Votes</th>
          </tr>
          {communityNom &&
            communityNom.docs.map((nom,index) => {
              return (
                <Entry key={index}>
                  <td
                    colSpan="2"
                    style={{
                      textAlign: "left",
                      marginLeft: "10%",
                      paddingLeft: "20px",
                      borderLeft: "2px solid black",
                    }}
                  >
                    {nom.data().movies.Title}
                  </td>
                  <td>{nom.data().movies.Year}</td>
                  <td style={{ fontWeight: "bold" }}>
                    {nom.data().votes}
                    {isNomUser(nom.data().voters, nom.data().imdbID) ? (
                      <button
                        disabled
                        style={{
                          border: "1px solid lightgrey",
                          background: "none",
                          padding: "3px 7px",
                          borderRadius: "3px",
                        }}
                      >
                        +1
                      </button>
                    ) : (
                      <SmallButton
                        mColor={(props) => props.theme.tchColor}
                        hColor={(props) => props.theme.tchColor}
                        onClick={() => handleVote(nom.data().imdbID)}
                      >
                        +1
                      </SmallButton>
                    )}
                  </td>
                </Entry>
              );
            })}
        </tbody>
      </Table>
    </AllNomCont>
  );
}

export default AllNom;
