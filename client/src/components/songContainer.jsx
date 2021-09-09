/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SpotifyWebApi from 'spotify-web-api-node';
import info from '../info';
import { updateCurrentSong } from '../slices/currentSongSlice';

const spotifyApi = new SpotifyWebApi({
  clientId: info.spotifyClientId,
});

const SongContainer = ({ accessToken, search }) => {
  console.log('playlistContainer');
  const dispatch = useDispatch();
  const [currentPlaylist, setCurrentPlaylist] = useState([]);

  useEffect(() => { // check if this use effect is even needed
    if (!accessToken) {
      return;
    }
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (search === '') {
      return;
    }
    spotifyApi.searchPlaylists(search, { limit: 1, offset: 1 }) // use async await here
      .then((res) => {
        console.log('res.body: ', res.body);
        const { uri } = res.body.playlists.items[0];
        console.log('uri: ', uri);
        dispatch(updateCurrentSong(uri));

        const uriCode = uri.slice(17);
        console.log('uriCode: ', uriCode);

        spotifyApi.getPlaylist(uriCode)
          .then((res) => {
            console.log('getPlaylist res.body: ', res.body);
            const playlist = res.body.tracks.items;
            console.log('playlist: ', playlist);
            setCurrentPlaylist(playlist);
          });
      });
  }, [search]);

  return (
    <div className="songContainer">
      playlistContainer
    </div>
  );
};

export default SongContainer;
