import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { db } from '../firebase.js'

import { SmallButton } from './common/SmallButton.js'

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



function DisplayMovie({ movieTitle, setMyNoms }) {
    const [showResult, updateShowResult] = useState(false);
    const [resMovie, setMovie] = useState([]);

    useEffect(() => {
        axios
            .get(
                `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_KEY}&s=${movieTitle}`
            )
            .then((res) => {
                const goodRes = res.data.Response === "True";
                updateShowResult(goodRes);
                if (goodRes) {
                    setMovie(res.data.Search);
                }
            })
            .catch((err) => {
                // console.log(err);
            });
    }, [movieTitle]);

    function addMovie(e) {
        const temp = e.target.parentNode.textContent;
        const targetMovie = temp.split(" (")[0];

        for (let i = 0; i < resMovie.length; i++) {
            if (targetMovie === resMovie[i].Title) {

                db.collection("allNoms").add({
                    imdbID: resMovie[i].imdbID,
                    movie: resMovie[i]
                })
                .then(()=>console.log("added data!"))
                .catch((err)=>console.log(err))
                console.log(resMovie[i]);


                setMyNoms(prev => [...prev, resMovie[i]]);
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
                            <SmallButton color={(props) => props.theme.tchColor} hColor={(props) => props.theme.tchColor} onClick={addMovie}>Nominate</SmallButton>
                        </Item>
                    );
                })
            ) : <li>No Results</li>}
        </List>
    );
}

export default DisplayMovie;
