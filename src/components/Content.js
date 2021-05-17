import React from "react";
import styled from "styled-components";

import Landing from "./Landing.js";
import AddMovie from "./AddMovie.js";
import AllNominations from "./AllNom.js";

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 2rem 0;
`;

function Content() {
  return (
    <Body>
      <Landing></Landing>
      <AddMovie></AddMovie>
      <AllNominations></AllNominations>
    </Body>
  );
}

export default Content;
