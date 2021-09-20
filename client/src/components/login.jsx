import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
// import save from '../save';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/userLoginSlice';
import { setUserInfo } from '../slices/userInfoSlice';
import { updateSavedImages } from '../slices/savedImagesSlice';
import info from '../info';
import SignUp from './signup';
import { closeModal } from '../slices/loginModalSlice';
// import getImages from '../getImages';

const { url } = info;
const { localStorage } = window;

const Login = () => {
  const userLoggedIn = useSelector((state) => state.userLogin.value);
  const userInfo = useSelector((state) => state.userInfo.value);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displaySignUp, setDisplaySignUp] = useState(false);
  const [invalidLogin, setInvalidLogin] = useState(false);

  const getImages = (token) => {
    // const dispatch = useDispatch();
    // const token = localStorage.getItem('access_token');
    axios.get(`${url}/images/${token}`)
      .then((response) => {
        const savedImages = response.data.rows;
        console.log('savedImages: ', savedImages);
        const formattedSavedImages = savedImages.map((image) => image.url);
        console.log('formattedSavedImages: ', formattedSavedImages);
        dispatch(updateSavedImages(formattedSavedImages));
        // set redux saved Images state to savedImages value
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleLoginClick = (e) => {
    setInvalidLogin(false);
    e.preventDefault();
    axios.post(`${url}/login`, { email, password })
      .then((response) => {
        console.log(response.data);
        const { user, token } = response.data;
        localStorage.setItem('access_token', token);
        const localStorageTest = localStorage.getItem('access_token');
        console.log('localStorageTest: ', localStorageTest);
        dispatch(setUserInfo(user));
        dispatch(loginUser());
        getImages(token);
        dispatch(closeModal());
        console.log('userLoggedIn: ', userLoggedIn);
        console.log('userInfo: ', userInfo);
      })
      .catch((err) => {
        console.log('login error: ', err);
        setInvalidLogin(true);
      });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignUpClick = () => {
    setDisplaySignUp(true);
  };

  if (displaySignUp) {
    return (
      <SignUp setDisplaySignUp={setDisplaySignUp} />
    );
  }

  return (
    <>
      <div className="userInfo">
        <h2 className="header">Login</h2>
        {invalidLogin ? <div className="invalidLogin">Invalid username or password</div> : <></>}
        <form onSubmit={handleLoginClick}>
          <div>
            <label>Email </label>
            <input type="email" className="email" onChange={handleEmailChange} />
          </div>
          <div>
            <label>Password </label>
            <input type="password" className="password" onChange={handlePasswordChange} />
          </div>
          <button type="submit" className="submitLogin" onClick={handleLoginClick}>Login</button>
          <button type="button" className="toSignUp" onClick={handleSignUpClick}>SignUp</button>
        </form>
      </div>
    </>
  );
};

export default Login;
