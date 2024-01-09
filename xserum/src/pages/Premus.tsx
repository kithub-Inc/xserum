import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Cookies } from 'react-cookie';

import { elapsedTime } from '../functions/elapsedTime.ts';
import { format } from '../functions/format.ts';

import { Ipreset } from '../components/Preset';
import { WaveSurfers } from '../components/WaveSurfers.tsx';

const View = () => {
    const navigate = useNavigate();
    
    const song_ico = require(`../images/music-alt.png`);
    const heart_ico = require(`../images/heart.png`);

    const { id } = useParams();
    const [premus, setPremus] = useState<Ipreset | null>(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/premus/${id}`).then(response => {
            if (response.data.length === 1) setPremus(response.data[0]);
            else navigate(`/`);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    
    if (!premus?.heart_count && premus) premus.heart_count = 0;

    const ContentBox = styled.div`display: flex; justify-content: space-between; flex-wrap: wrap;`;
    const Box = styled.div`width: 500px; flex: 1; margin-right: 100px; margin-bottom: 100px; &:last-child { margin-right: 0; }`;

    const ImageBox = styled.div`width: 600px; height: 600px; display: flex; justify-content: center; align-items: center; border-radius: 5px; overflow: hidden;`;
    const Image = styled.img`width: 100%;`;

    const SubItem = styled.span`padding: 5px 10px; font-size: 14px; border: 1px solid black; border-radius: 5px; margin-right: 10px;`;

    const IconsBox = styled.div`display: flex;`;
    const IconBox = styled.div`margin-right: 15px;`;
    const Icon = styled.img`width: 11px; margin-right: 5px;`;
    const IconText = styled.span`font-size: 14px;`;

    const MadeBy = styled.p`font-size: 14px; color: gray !important; b { color: black; }`;

    const ModifyButton = styled.button`cursor: pointer; padding: 5px 10px; border: 1px solid black; background: white; border-radius: 5px; margin-right: 5px;`;
    const DeleteButton = styled.button`cursor: pointer; padding: 5px 10px; border: 1px solid black; background: white; border-radius: 5px;`;

    useEffect(() => {
        if (!premus?.heart_count && premus) setPremus({ ...premus, heart_count: 0 });
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            } else navigate(`/`);
        });
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const heartHandler = () => {
        if (session) axios({
            method: `post`,
            url: `http://localhost:8080/premus/heart`,
            data: { made_by: session.email, to: premus?.node_id }
        }).then(response => {
            if (response.data.status === 200) window.location.reload();
            else console.error(response.data.message);
        });
    }

    return (
        <div className="main">
            <div className="container">
                <ContentBox>
                    <Box>
                        <ImageBox><Image src={`http://localhost:8080/premus/${premus?.made_by}/${premus?.node_id}/${premus?.image}`} alt="premus_image" /></ImageBox>

                        <br /><br />

                        <h2>💫 {premus?.title}</h2>
                        <p>{premus?.description}</p>

                        <br />

                        <div>
                            <SubItem>{premus?.category}</SubItem>
                            <SubItem>{elapsedTime(new Date(premus?.created_at || 0).getTime())}</SubItem>
                        </div>

                        <br />

                        <IconsBox>
                            <IconBox>
                                <Icon src={song_ico} alt="song_ico" />
                                <IconText>{premus?.songs?.length}</IconText>
                            </IconBox>
        
                            <IconBox onClick={heartHandler}>
                                <Icon src={heart_ico} alt="heart_ico" />
                                <IconText>{(premus?.heart_count || 0) >= 1e3 ? format(premus?.heart_count) : premus?.heart_count}</IconText>
                            </IconBox>
                        </IconsBox>

                        <br /><br />

                        <MadeBy>Made by: <Link to={`/profile?author=${premus?.made_by}`}><b>{premus?.made_by}</b></Link></MadeBy>

                        {
                            session?.email === premus?.made_by &&
                            <>
                                <ModifyButton>Edit</ModifyButton>
                                <DeleteButton>Delete</DeleteButton>
                            </>
                        }
                    </Box>
                    
                    <Box>
                        <h2>{ premus?.type === `preset` ? `🔥 Presets` : `🔥 Musics` }</h2>

                        <br />
                        <WaveSurfers type={premus?.type || `music`} node_id={premus?.node_id || 0} data={premus?.songs || []} />
                    </Box>
                </ContentBox>
            </div>
        </div>
    );
}

export default View;