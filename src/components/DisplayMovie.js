import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import axios from "axios";

import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "../firebase.js";
import { db } from "../firebase.js";

import { SmallButton } from "./common/SmallButton.js";

const List = styled.ul`
  margin: 1rem 1rem;
  list-style: none;
`;

const Item = styled.li`
  border-left: 2px solid black;
  margin: 1rem 0;
  padding-left: 7px;
  font-size: 1.2rem;
  font-weight: 400;

  display: flex;
  justify-content: space-between;
`;

function DisplayMovie({ movieTitle, setMyNoms, setTitle, fiveNom }) {
  const [showResult, updateShowResult] = useState(false);
  const [resMovie, setMovie] = useState([]);
  const [user] = useAuthState(firebase.auth());

  const justCalled = useRef(false);
  const validRes = useRef(false);
  const refMovieTitle = useRef(movieTitle); //because of https://github.com/facebook/react/issues/14010
  const [errorMessage, updateMsg] = useState("Enter a movie name...");

  function delay(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  //to hide results if have reached fiveNom
  useEffect(() => {
    if (fiveNom) {
      updateShowResult(false);
    }
  }, [fiveNom]);

  //gets data from axios, and checks if has already been nominated and add that as a obj key; with throttle for limit api calls
  useEffect(() => {
    refMovieTitle.current = movieTitle;

    async function getData() {
      const res = await axios.get(
        `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&s=${refMovieTitle.current}&type=movie`
      );
      if (res.data.Response === "True") {
        for (let i = 0; i < res.data.Search.length; i++) {
          const mid = res.data.Search[i].imdbID;
          const dataRef = db.collection("allNoms").where("imdbID", "==", mid);
          const querySnapshot = await dataRef.get();
          if (!querySnapshot.empty) {
            res.data.Search[i].prevNom = true;
          } else {
            res.data.Search[i].prevNom = false;
          }
        }
        setMovie(res.data.Search);
        validRes.current = true;
        updateShowResult(validRes.current);
      } else {
        setMovie([]);

        const defMessage = res.data.Error || "Results Pending...";
        updateMsg(
          refMovieTitle.current === "" ? "Enter a movie name..." : defMessage
        );
        validRes.current = false;
        updateShowResult(validRes.current);
      }
    }

    async function callGetData() {
      justCalled.current = true;

      validRes.current = false;
      updateShowResult(validRes.current);
      updateMsg("Give me a sec...");

      await delay(300);
      setTimeout(() => {
        getData().then(() => {
          justCalled.current = false;
        });
      }, 2000); //delay call so can capture last words
    }

    //runner
    if (!justCalled.current) {
      callGetData();
    } else {
      return;
    }
  }, [movieTitle]);

  //add nominations; only adds to allNoms as by setting state, will trigger ShortList to update the user specific document
  function addMovie(e) {
    const temp = e.target.parentNode.textContent;
    const targetMovie = temp.split(" (")[0];

    for (let i = 0; i < resMovie.length; i++) {
      if (targetMovie === resMovie[i].Title) {
        const userID = user ? user.uid : "Guest";

        db.collection("allNoms").add({
          imdbID: resMovie[i].imdbID,
          movies: resMovie[i],
          votes: 1,
          userID: userID,
          voters: [userID],
        });

        setMyNoms((prev) => [...prev, resMovie[i]]);
        setTitle("");
        updateShowResult(false);

        break;
      }
    }
  }

  return (
    <List>
      {showResult ? (
        resMovie.map((movie, index) => {
          return (
            <Item key={index}>
              {movie.Title} ({movie.Year})
              {movie.prevNom ? (
                <button
                  disabled
                  style={{
                    border: "1px solid lightgrey",
                    background: "none",
                    padding: "3px 7px",
                    borderRadius: "3px",
                  }}
                >
                  Nominate
                </button>
              ) : (
                <SmallButton
                  mColor={(props) => props.theme.tchColor}
                  hColor={(props) => props.theme.tchColor}
                  onClick={addMovie}
                >
                  Nominate
                </SmallButton>
              )}
            </Item>
          );
        })
      ) : (
        <li style={{ color: "#F49342", fontWeight: "bold" }}>{errorMessage}</li>
      )}
    </List>
  );
}

export default DisplayMovie;
