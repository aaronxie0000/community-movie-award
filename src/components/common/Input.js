import styled from 'styled-components';

const Input = styled.input.attrs(props=>({
    type:props.type || 'text',
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

export {Input}
