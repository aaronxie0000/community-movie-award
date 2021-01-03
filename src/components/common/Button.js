import styled from 'styled-components';

const Button = styled.button`
    background-color: transparent;
    border-radius: 3px;
    padding:0.5rem 0.75rem;
    cursor: pointer;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
    color: ${props=>props.theme.tchColor};
    border: 2px solid ${props=>props.theme.tchColor};
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1rem;

    background-size: 220%;


    &:hover{
        box-shadow: 0 0 .3em rgba(0, 0, 0, 0.25);
        background-position: 0;
        background-color: ${props=>props.theme.tchColor};
        color: #fff;
    }

    &:focus{
        outline: none;
        box-shadow: none;
    }

    &:active{
        transform: translateY(-0.25px);
    }

`;

export {Button};

