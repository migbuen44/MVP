import React, { useState, useEffect } from 'react';
import {
  Redirect,
  Link,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { openModal } from '../slices/loginModalSlice';
import Image from './image';
import SpotifyLogin from './spotifyLogin';
import Sounds from './sounds';
import info from '../info';
import LoginModal from './loginModal';

const code = new URLSearchParams(window.location.search).get('code');

const Home = () => {
  // let [value, setValue] = useState('chill');
  const dispatch = useDispatch();
  const userLoggedIn = useSelector((state) => state.userLogin.value);
  const modalIsOpen = useSelector((state) => state.loginModal.value);
  const [loggedIn, setLoggedIn] = useState(userLoggedIn);
  const [value, setValue] = useState('');
  const [search, setSearch] = useState('');
  const [backgrounds, setBackgrounds] = useState([]);
  const [currentInterval, setCurrentInterval] = useState();
  const [intervalState, setIntervalState] = useState(true);

  useEffect(() => {
    console.log(loggedIn);
    setLoggedIn(userLoggedIn);
  }, [userLoggedIn]);

  let i = 0;

  const { pexelsAuth } = info;

  const handleSearchChange = (e) => {
    setValue(e.target.value);
  };

  const handleClick = () => {
    setSearch(value);
    console.log('pexelsAuth: ', pexelsAuth);
    axios.get(`https://api.pexels.com/v1/search?query=${value}+wallpaper`, pexelsAuth)
      .then((data) => {
        const { photos } = data.data;
        setBackgrounds(photos);
      });
  };

  const handleLoginClick = () => {
    console.log('handle login clicked');
    dispatch(openModal());
    console.log('modalIsOpen: ', modalIsOpen);
  };

  const style = { height: '70px', width: 'auto' };

  const changeImg = () => {
    if (!backgrounds.length) {
      return;
    }

    document.body.style.backgroundImage = `url(${backgrounds[i].src.landscape})`;

    if (i < backgrounds.length - 1) {
      i += 1;
    } else {
      i = 0;
    }
  };

  useEffect(() => {
    changeImg();

    if (currentInterval) {
      clearInterval(currentInterval);
    }
    const slideShowTimer = setInterval(changeImg.bind(i), 3000);
    setCurrentInterval(slideShowTimer);
  }, [backgrounds]);

  const pause = () => {
    console.log(intervalState);
    // if (intervalState) {
    //   setIntervalState(false)
    // } else {
    //   setIntervalState(true)
    // }
    // if (currentInterval && intervalState) {
    //   clearInterval(currentInterval)
    // } else {
    //   var slideShowTimer = setInterval(changeImg.bind(i), 3000);
    //   setCurrentInterval(slideShowTimer)
    // }
  };
  return (
    <>
      <div className='imageContainer'>
        {backgrounds.map((background, idx) =>
          <Image key={idx} background={background} style={style} />)}
      </div>
      <div className="search" onDoubleClick={pause}>
        <input placeholder="Search..." value={value} onChange={handleSearchChange} />
        <button type="submit" onClick={handleClick}>Search</button>
      </div>
      {loggedIn ? <></> : (
        <button type="button" className="loginButton" onClick={handleLoginClick}>
          Login
        </button>
      )}
      <LoginModal />
      <Sounds code={code} search={search} />
    </>
  );
};

export default Home;
