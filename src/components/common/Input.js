import React from 'react';

import styled from 'styled-components';
import { AiOutlineSearch } from "react-icons/ai";


const InputBox = styled.input.attrs(props => ({
    type: props.type || 'text',
}))`
    padding: 0.2rem 1rem;
    border-radius: 2px;
    width: ${props => props.width};
    border: none;
    background: none;
    &:focus{
        outline: none;
    }
`;

const InputBar = styled.div`
  margin-top: 0.5rem;
  border: 2px solid ${props => props.theme.tchColor};
  box-shadow: 2px 1.5px 5px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  border-radius: 5px;

  height: 3rem;

  svg {
    margin: 0 2px 0 6px;
    font-size: 20px;
  }
`;

function Input({movieTitle, setTitle}) {
    return (
        <InputBar>
            <AiOutlineSearch></AiOutlineSearch>
            <InputBox value={movieTitle} onChange={e => setTitle(e.target.value)} placeholder="Movie Name" width="100%"></InputBox>
        </InputBar>
    )
}

export default Input;

