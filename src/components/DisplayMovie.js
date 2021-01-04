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

  function delay(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  //to hide results if have reached fiveNom
  useEffect(() => {
    if (fiveNom) {
      updateShowResult(false);
    }
  }, [fiveNom]);

  //gets data from axios, and checks if has already been nominated and add that as a obj key
  useEffect(() => {
    justCalled.current = true;

    validRes.current = false;
    updateShowResult(validRes.current);

    async function getData() {
      console.log("Fetched " + movieTitle);

      const res = await axios.get(
        `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&s=${movieTitle}`
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
        validRes.current = true;
        setMovie(res.data.Search);
      }
    }

    async function callGetData() {
      justCalled.current = true;

      await delay(500);
      setTimeout(getData, 500); //delay call so can capture last words

      justCalled.current = false;

      if (movieTitle === "") {
        validRes.current = false;
      }
      updateShowResult(validRes.current);
    }

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
        resMovie[i].uid = user ? user.uid : "Guest";

        db.collection("allNoms")
          .add({
            imdbID: resMovie[i].imdbID,
            movies: resMovie[i],
          })
          .catch((err) => console.log(err));

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
              {movie.prevNom ? null : (
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
        <li>Results Pending...</li>
      )}
    </List>
  );
}

export default DisplayMovie;
