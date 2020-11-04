import React from 'react';
import './PageNotFound.css';
import cassette_image from './images/404-image.jpg';

import NavBarWrapper from './NavBarWrapper';

function PageNotFound(){
    return(
        <NavBarWrapper>
            <center>
                <div id = "not-found-header">
                    404: PAGE NOT FOUND
                </div>
                <img src={cassette_image} id = "cassette_image"/>
                <div id = "not-found-subtitle">
                    Whoops! Try navigating back to the <a href="/">dashboard</a> and try again.
                </div>
            </center>
        </NavBarWrapper>
    );
}

export default PageNotFound;