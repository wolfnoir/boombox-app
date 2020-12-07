import React from 'react';
import './PageNotFound.css';
import cassette_image from './images/404-image.jpg';

import NavBarWrapper from './NavBarWrapper';

function PageNotFound(){
    return(
        <NavBarWrapper>
            <center>
                <div id = "not-found-header">
                    ERROR!<br/>
                </div>
                <img src={cassette_image} id = "cassette_image" alt = "Error!"/>
                <div id = "not-found-subtitle">
                    Whoops! Page not found and/or you are not authorized to view this page. Try navigating back to the <a href="/">dashboard</a> and try again.
                </div>
            </center>
        </NavBarWrapper>
    );
}

export default PageNotFound;