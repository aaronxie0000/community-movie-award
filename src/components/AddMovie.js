import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Input from "./common/Input.js";
import ShortList from "./ShortList.js";
import DisplayMovie from "./DisplayMovie.js";
import Modal from "./Modal.js";

const GridCont = styled.div`
  display: grid;

  border: 2px solid ${(props) => props.theme.mainColor};
  border-radius: 5px;
  padding: 4rem;

  margin: 4rem 0 0 0;
  width: 80vw;
  height: 50vh;
  grid-template-areas:
    "Search MyMovie"
    "DisplayMovie MyMovie";

  grid-template-columns: 1.5fr 1fr;
  column-gap: 3rem;
  grid-template-rows: 1fr 3fr;
`;

const SearchMovie = styled.div`
  grid-area: Search;
`;

const MyMovie = styled.div`
  grid-area: MyMovie;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.mainColor};
`;

const DisplayMovieCont = styled.div`
  grid-area: DisplayMovie;
  overflow: scroll;
`;

const BannerCont = styled.div`
  border: 2px solid ${(props) => props.theme.tchColor};
  box-shadow: 2px 1.5px 5px rgba(0, 0, 0, 0.15);
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 0.5rem;
`;

function Banner() {
  return (
    <BannerCont>
      <h4>Five Nominations Reached. Scroll to view community's nominations</h4>
    </BannerCont>
  );
}

function AddMovie() {
  const [movieTitle, setTitle] = useState("");
  const [myNoms, setMyNoms] = useState([]);
  const [fiveNom, setFiveNom] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (myNoms.length >= 5) {
      setTitle("");

      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 5000);

      setFiveNom(true);
    } else {
      setFiveNom(false);
      setIsOpen(false);
    }
  }, [myNoms]);

  return (
    <GridCont>
      <Modal isOpen={isOpen}></Modal>

      <SearchMovie>
        <Title>Search a Movie!</Title>
        {fiveNom ? (
          <Banner></Banner>
        ) : (
          <Input movieTitle={movieTitle} setTitle={setTitle}></Input>
        )}
      </SearchMovie>

      <DisplayMovieCont>
        <DisplayMovie
          movieTitle={movieTitle}
          setTitle={setTitle}
          setMyNoms={setMyNoms}
          fiveNom={fiveNom}
        />
      </DisplayMovieCont>

      <MyMovie>
        <Title style={{ textAlign: "center", textDecoration: "underline" }}>
          Your Nominations
        </Title>
        <ShortList myNoms={myNoms} setMyNoms={setMyNoms} setTitle={setTitle} />
      </MyMovie>
    </GridCont>
  );
}

export default AddMovie;
