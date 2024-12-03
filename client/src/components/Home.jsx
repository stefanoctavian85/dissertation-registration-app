import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    let navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginStatus = sessionStorage.getItem('loginStatus');
        if (loginStatus === "true") {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    return(
        <div>
            <h1>Dissertation Registration App</h1>
            {!isLoggedIn ? 
                (<p>You are not logged in!</p>)
                :
                (<p>You are logged in!</p>)}
        </div>
    );
}

export default Home;