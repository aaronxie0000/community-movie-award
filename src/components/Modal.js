import ReactDom from "react-dom";
import styled from 'styled-components';
import {AiOutlineAlert} from 'react-icons/ai';

const ModalCont = styled.div` 
    background-color: #FEAD9A;
    width: 100%;
    height: 10vh;
    padding: 2rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    display: flex;
    justify-content: center;
    align-items: center; 
    color: #583C35;

    svg{
        font-size: 50px;
        margin-top: -3px;
    }
    & h2{
        text-align: center;
        margin-left: 2.5rem;
    }
`;

function Modal({isOpen }) {
  if (!isOpen) return null;

  return ReactDom.createPortal(
      <ModalCont>
          <AiOutlineAlert></AiOutlineAlert>
        <h2>You have made five nominations, <br />remove one to add a different nomination.</h2>
      </ModalCont>
    ,
    document.getElementById("portal")
  );
}

export default Modal;
