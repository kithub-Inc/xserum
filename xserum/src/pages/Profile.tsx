import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import { format } from '../functions/format.ts';

const Profile = () => {
    const song_ico = require(`../images/music-alt.png`);
    const heart_ico = require(`../images/heart.png`);

    const navigate = useNavigate();
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [params, _] = useSearchParams();

    const [profile, setProfile] = useState<any>(null);
    const [premuses, setPremuses] = useState<any[]>([]);

    if (!params.has(`author`)) window.history.back();

    useEffect(() => {
        axios.get(`http://localhost:8080/profile/${params.get(`author`)}`).then(response => {
            const { status, data } = response.data;
    
            if (status === 200) setProfile(data);
            else navigate(`/`);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:8080/profile/${params.get(`author`)}/premus`).then(response => {
            console.log(response.data);

            const { status, data } = response.data;
            if (status === 200) setPremuses(data);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const Dflex = styled.div`display: flex; flex-wrap: wrap;`;
    const DflexBox = styled.div`width: 500px; flex: 1; margin-right: 100px; &:last-child { margin-right: 0; }`;

    const AvatarBox = styled.div`width: 600px; height: 600px; overflow: hidden; display: flex; justify-content: center; align-items: center; border-radius: 5px;`;
    const Avatar = styled.img`width: 100%;`;
    const SubItem = styled.span`padding: 5px 10px; font-size: 14px; border: 1px solid black; border-radius: 5px; margin-right: 10px;`;
    const Text = styled.p`margin-bottom: 15px !important;`;

    const Box = styled.div`padding: 25px; border: 1px solid black; border-radius: 5px; margin-bottom: 25px;`;
    const BoxTitle = styled.b`font-size: 18px;`;
    const BoxDescription = styled.p`margin-top: 10px;`;

    const Premus = styled.div`width: 100%; height: 100px; border: 1px solid black; border-radius: 5px; margin-bottom: 25px; display: flex; overflow: hidden; cursor: default; transition: .1s; &:hover { transform: scale(1.025); z-index: 2; } &:active { transform: scale(0.975); z-index: 2; }`;
    const PremusContent = styled.div`width: calc(100% - 100px); padding: 25px; display: flex; justify-content: space-between;`;
    const PremusContentBox = styled.div`width: calc(100% - 100px);`;
    const PremusTitle = styled.b`font-size: 18px;`;
    const PremusDescription = styled.p`margin-top: 5px; width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`;
    const PremusImage = styled.img`height: 100%;`;

    const IconsBox = styled.div`display: flex;`;
    const IconBox = styled.div`margin-left: 15px;`;
    const Icon = styled.img`width: 11px; margin-right: 5px;`;
    const IconText = styled.span`font-size: 14px;`;

    premuses.map(e => {
        if (!e.heart_count) e.heart_count = 0;
        return e;
    });

    return (
        <div className="main">
            <div className="container">
                {
                    profile &&
                    <Dflex>
                        <DflexBox>
                            <AvatarBox><Avatar src={`http://localhost:8080/profile/${profile.email}/${profile.avatar}`} alt="avatar" /></AvatarBox>

                            <br /><br />

                            <h1>💫 {profile.name}</h1>
                            <p>Email: {profile.email}</p>

                            <hr /><br />

                            <Text><SubItem>Created At</SubItem> {new Date(profile.created_at).toUTCString()}</Text>
                        </DflexBox>

                        <DflexBox>
                            <Box>
                                <BoxTitle>Hello, It's me!</BoxTitle>
                                <BoxDescription>Descriptions are added later.<br /><br />Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolores eveniet facilis explicabo aliquam temporibus earum quasi enim aperiam! Omnis architecto possimus beatae numquam modi itaque nihil quidem earum dolores odit.</BoxDescription>
                            </Box>

                            {
                                premuses.map(premus =>
                                    <Premus key={premus.node_id} onClick={() => navigate(`/premus/${premus.node_id}`)}>
                                        <div>
                                            <PremusImage src={`http://localhost:8080/premus/${premus.made_by}/${premus.node_id}/${premus.image}`} alt="premus" />
                                        </div>

                                        <PremusContent>
                                            <PremusContentBox>
                                                <PremusTitle>{premus.title}</PremusTitle>
                                                <PremusDescription>{premus.description}</PremusDescription>
                                            </PremusContentBox>
                                            
                                            <div>
                                                <IconsBox>
                                                    <IconBox>
                                                        <Icon src={song_ico} alt="song_ico" />
                                                        <IconText>{premus.songs?.length}</IconText>
                                                    </IconBox>
                                
                                                    <IconBox>
                                                        <Icon src={heart_ico} alt="heart_ico" />
                                                        <IconText>{premus.heart_count >= 1e3 ? format(premus.heart_count) : premus.heart_count}</IconText>
                                                    </IconBox>
                                                </IconsBox>
                                            </div>
                                        </PremusContent>
                                    </Premus>
                                )
                            }
                        </DflexBox>
                    </Dflex>
                }
            </div>
        </div>
    );
}

export default Profile;