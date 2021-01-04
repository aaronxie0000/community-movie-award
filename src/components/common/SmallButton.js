import styled from "styled-components";

const SmallButton = styled.button`
  color: ${(props) => props.mColor};
  cursor: pointer;
  border: 1px solid ${(props) => props.mColor};
  background: none;
  padding: 3px 7px;
  border-radius: 3px;

  &:hover {
    background-color: ${(props) => props.hColor};
    border-color: ${(props) => props.hColor};

    color: #fff;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

export { SmallButton };
