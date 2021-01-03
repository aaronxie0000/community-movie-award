import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

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

const Button= styled.button`
    cursor: pointer;
    border: 1px solid  ${props=>props.theme.tchColor};
    background:none;
    color:  ${props=>props.theme.tchColor};
    padding: 3px 7px;
    border-radius: 3px;

    &:hover{
        background-color: ${props=>props.theme.tchColor};
        color: #fff;
    }

    &:focus{
        outline:none;
        box-shadow:none;
    }
`;

function DisplayMovie({ movieTitle }) {
    const [showResult, updateShowResult] = useState(false);
    const [resMovie, setMovie] = useState([]);

    useEffect(() => {
        console.log(process.env.REACT_APP_OMDB_KEY);
        console.log(process.env.REACT_APP_APP_ID);
        console.log(
            `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&s=${movieTitle}`
        );
        axios
            .get(
                `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&s=${movieTitle}`
            )
            .then((res) => {
                const goodRes = res.data.Response === "True";
                console.log(res);
                updateShowResult(goodRes);
                if (goodRes) {
                    console.log(res.data.Search);
                    setMovie(res.data.Search);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }, [movieTitle]);

    return (
        <List>
            {showResult ? (
                resMovie.map((movie) => {
                    return (
                        <Item>
                            {movie.Title} ({movie.Year})
                            <Button>Nominate</Button>
                        </Item>
                    );
                })
            ) : <li>No Results</li>}
        </List>
    );
}

export default DisplayMovie;
