import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import axios from "axios";

export const Header = () => {
    const cookies = new Cookies();
    const [session, setSession] = useState<any>(null);
    
    useEffect(() => {
        if (cookies.get(`_tkn`)) axios({
            method: `post`,
            url: `http://localhost:8080/oauth/valtkn`,
            data: { token: decodeURI(cookies.get(`_tkn`)) }
        }).then(response => {
            console.log(response.data);
            if (response.data.status === 200) {
                const { session: resultSession } = response.data;
                setSession(resultSession);
            }
        });
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="header">
            <div className="container">
                <div className="header-items">
                    <div className="header-item">
                        <Link to="/">
                            <b>:_xserum_:</b>
                        </Link>
                    </div>
                    <div className="header-item"><Link to="/presets">Presets</Link></div>
                    <div className="header-item"><Link to="/musics">Musics</Link></div>
                </div>

                <div className="header-items">
                    {
                        session ?
                        <>
                            <div className="header-item util-btn"><Link to="/upload">Upload</Link></div>
                            <div className="header-item util-btn highlight"><Link to={`/profile?author=${session.email}`}>Profile</Link></div>
                        </>
                        :
                        <>
                            <div className="header-item util-btn"><Link to="/account/signin">Login</Link></div>
                            <div className="header-item util-btn highlight"><Link to="/account/signup">Sign Up</Link></div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}

export default Header;