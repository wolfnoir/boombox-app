import React from 'react';
import logo from './images/logo.svg';
import PlaylistDisplay from './PlaylistDisplay';

function PlaylistTest() {
  return (
      <div>
	        <PlaylistDisplay
                albumCover = {logo}
                title = "Lorem Ipsum"
                author = "Anonymous"
                likes = "69" />


            <PlaylistDisplay
                albumCover = {logo}
                title = "Test 2"
                author = "Aaaaaa"
                likes = "342" />
      </div>
  );
}

export default PlaylistTest;
