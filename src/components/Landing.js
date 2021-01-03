import React from "react";
import styled from "styled-components";

import { AiOutlineGoogle, AiOutlineGithub, AiFillFacebook } from "react-icons/ai";
import { IoMdExit } from 'react-icons/io'

import { Button } from "./common/LogInButton.js";

import {
  googleProvider,
  facebookProvider,
  githubProvider,
} from "./../firebase.js";

import firebase from "./../firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";

const Title = styled.h1`
  margin: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${(props) => props.theme.mainColor};
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-right: 2rem;
`;

const ButtonContent = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  font-size: 0.8rem;

  svg {
    margin: 0;
    margin-left: 1rem;
    font-size: 20px;
  }
`;

const IntroText = styled.p`
  text-align: center;
  margin: 1rem 0 1rem 0;
  line-height: 2rem;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & button{
      margin: 0 2rem;
  }
`;

function LogIn() {
  function signIn(provider) {
    console.log("Sign In");
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const userInfo = res.user;
        console.log(userInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  return (
    <ButtonContainer>
      {/* using arrow function to make a funciton isntead of just passing; is so can use param */}
      <Button onClick={() => signIn(googleProvider)}>
        <ButtonContent>
          Sign In <br /> With Google <AiOutlineGoogle />
        </ButtonContent>
      </Button>

      <Button onClick={() => signIn(githubProvider)}>
        <ButtonContent>
          Sign In <br /> With Github <AiOutlineGithub />
        </ButtonContent>
      </Button>

      <Button onClick={() => signIn(facebookProvider)}>
        <ButtonContent>
          Sign In <br /> With Facebook <AiFillFacebook />
        </ButtonContent>
      </Button>
    </ButtonContainer>
  );
}

function LogOut() {
  function signOut() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Signed Out");
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <Button onClick={signOut}>
        <ButtonContent>
          Sign Out <IoMdExit />
        </ButtonContent>
      </Button>
    </>
  );
}

function Landing() {
  const [user] = useAuthState(firebase.auth());

  return (
    <>
      <Title>Welcome to the 1st Annual Shoppies</Title>
      <IntroText>
        Sign In to save your progress, or continue and complete your nominations
      </IntroText>
      {user ? <LogOut></LogOut> : <LogIn></LogIn>}
    </>
  );
}

export default Landing;
