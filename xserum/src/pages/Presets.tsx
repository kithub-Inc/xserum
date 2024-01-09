import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import styled from 'styled-components';

import Presets from '../components/Presets.tsx';
import { Ipreset } from '../components/Preset.tsx';

const Home = () => {
    const search_ico = require(`../images/search.png`);

    const Search = styled.input`width: 230px; font-size: 32px; font-weight: 900; border: 0; outline: none; border-bottom: 1px solid white; &::placeholder { color: black; }`;
    const SearchIco = styled.img`width: 15px; margin-left: 5px;`;

    const [recentlyData, setRecentlyData] = useState<Ipreset[]>([]);
    const [popularData, setPopularData] = useState<Ipreset[]>([]);

    useEffect(() => { axios.get(`http://localhost:8080/presets/recently`).then(response => { setRecentlyData(response.data); }); }, []);
    useEffect(() => { axios.get(`http://localhost:8080/presets/popular`).then(response => { setPopularData(response.data); }); }, []);

    useEffect(() => { axios.get(`http://localhost:8080/presets/all`).then(response => { setAllData(response.data); }); }, []);

    const inputRef = useRef<any>(null);
    const [allData, setAllData] = useState<Ipreset[]>([]);
    const [filterData, setFilterData] = useState<Ipreset[]>([]);

    const filterItem = () => {
        setFilterData(allData.filter(e => e.title.toLowerCase().includes(inputRef.current.value.toLowerCase())));
    }

    return (
        <div className="main">
            <div className="container">
                <h1>💫&nbsp;&nbsp;<Search type="text" placeholder="Xserum Presets" ref={inputRef} /><SearchIco onClick={filterItem} src={search_ico} alt="search" /></h1>

                <br />

                {
                    filterData.length === 0 ?
                    <>
                        <h2>💎 Recently Presets</h2>
                        <Presets short={true} data={recentlyData.slice(0, 6)} />
        
                        <h2>🎬 All Times Most Popular Presets</h2>
                        <Presets short={false} data={popularData.slice(0, 4)} />
                    </>
                    :
                    <>
                        <h2>🎬 Search: {inputRef.current.value}</h2>
                        <Presets short={true} data={filterData} />
                    </>
                }
            </div>
        </div>
    );
}

export default Home;