import React from "react";
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';

import Presets from './pages/Presets.tsx';
import Musics from './pages/Musics.tsx';
import Premus from './pages/Premus.tsx';

import Sign from './pages/Sign.tsx';
import Profile from './pages/Profile.tsx';

import Upload from './pages/Upload.tsx';

const App = () => {
    return (
        <>
            <Header />

            <Routes>
                <Route path='/' />
                
                <Route path='/presets' Component={Presets} />
                <Route path='/musics' Component={Musics} />
                <Route path='/premus/:id' Component={Premus} />

                <Route path='/account/:type' Component={Sign} />
                <Route path='/profile' Component={Profile} />

                <Route path='/upload' Component={Upload} />
            </Routes>
            
            <Footer />
        </>
    );
}

export default App;