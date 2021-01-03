import React, {useState} from "react";
import styled from "styled-components";

import Input  from "./common/Input.js";
import ShortList from "./ShortList.js";
import DisplayMovie from "./DisplayMovie.js";


const GridCont = styled.div`
  display: grid;

  border: 2px solid ${(props) => props.theme.mainColor};
  border-radius: 5px;
  padding: 2rem;

  margin: 4rem 0 0 0;
  width: 80vw;
  height: 50vh;
  grid-template-areas:
    "Search MyMovie"
    "DisplayMovie MyMovie";

  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 3fr;
`;

const SearchMovie = styled.div`
  grid-area: Search;
`;

const MyMovie = styled.div`
  grid-area: MyMovie;
`;



const Title = styled.h1`
  text-align: center;
  text-decoration: underline;
`;



const DisplayMovieCont = styled.div`
  grid-area: DisplayMovie;
  overflow: scroll;
`;

function AddMovie() {
  const [movieTitle, setTitle] = useState('');


  return (
    <GridCont>
      <SearchMovie>
        <h1>Search a movie!</h1>
        <Input movieTitle={movieTitle} setTitle={setTitle}></Input>
      </SearchMovie>

      <DisplayMovieCont>
        <DisplayMovie movieTitle={movieTitle} />
      </DisplayMovieCont>

      <MyMovie>
        <Title>Your Short List</Title>
        <ShortList />
      </MyMovie>

    </GridCont>
  );
}

export default AddMovie;
