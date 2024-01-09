import React from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { elapsedTime } from '../functions/elapsedTime.ts';
import { format } from '../functions/format.ts';

export interface Ipreset {
    node_id: number;
    type: ('preset' | 'music');
    image: any;
    title: string;
    description: string;
    category: string;
    songs: any[];
    heart_count: number;
    made_by: string;
    created_at: string;
}

export const Preset = (props: { data: Ipreset, short: boolean }) => {
    const song_ico = require(`../images/music-alt.png`);
    const heart_ico = require(`../images/heart.png`);

    const Item = styled.div<{ $short?: boolean }>`
    width: ${props => props.$short ? `400px` : `300px`};
    height: ${props => props.$short ? `100px` : `350px`};
    ${props => props.$short ? `display: flex;` : ``}
    margin-bottom: 30px;
    border-radius: 5px;
    overflow: hidden;
    background: white;
    border: 1px solid black;
    transition: .1s;
    position: sticky;
    z-index: 1;
    cursor: default;
    user-select: none;

    &:hover {
        transform: scale(1.025);
        z-index: 2;
    }
    
    &:active {
        transform: scale(0.975);
        z-index: 2;
    }`;

    const ImageBox = styled.div<{ $short?: boolean }>`width: ${props => props.$short ? `100px` : `100%`}; height: ${props => props.$short ? `100px` : `300px`}; overflow: hidden;`;
    const Image = styled.img<{ $short?: boolean }>`width: 100%;`;

    const ContentBox = styled.div<{ $short?: boolean }>`
    width: calc(100%${props => props.$short ? ` - 100px` : ``});
    height: ${props => props.$short ? `100%` : `50px`};
    ${props => props.$short ? `` : `align-items: center;`}
    padding: ${props => props.$short ? `20px` : `0`} 20px;
    display: flex; ${props => props.$short ? `flex-direction: column;` : ``} justify-content: space-between;`;
    const ContentInBox = styled.div`display: flex; justify-content: space-between;`;

    const IconsBox = styled.div<{ $short?: boolean }>`display: flex;`;
    const IconBox = styled.div<{ $short?: boolean }>`margin-left: 15px;`;
    const Icon = styled.img<{ $short?: boolean }>`width: 11px; margin-right: 5px;`;
    const IconText = styled.span<{ $short?: boolean }>`font-size: 14px;`;

    const DetailBox = styled.div`width: calc(100% - 125px); display: flex; flex-direction: column; justify-content: space-between;`;
    const Title = styled.p<{ $short?: boolean }>`
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0 !important;`;
    const Description = styled.p`
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0 !important;
    margin-top: 5px;
    color: gray !important;
    font-size: 14px;`;
    const MoreBox = styled.div`display: flex;justify-content: space-between;`;
    const Category = styled.p`margin-bottom: 0 !important; font-size: 12px;`;
    const CreatedAt = styled.p`margin-bottom: 0 !important; font-size: 12px;`;

    if (!props.data.heart_count) props.data.heart_count = 0;

    const navigate = useNavigate();

    return (
        <>
            {
                props.short ?
                <Item $short={true} onClick={() => navigate(`/premus/${props.data.node_id}`)}>
                    <ImageBox $short={true}>
                        <Image $short={true} src={`http://localhost:8080/premus/${props.data.made_by}/${props.data.node_id}/${props.data.image}`} alt="preset_image" />
                    </ImageBox>
        
                    <ContentBox $short={true}>
                        <ContentInBox>
                            <DetailBox>
                                <Title $short={true}>{props.data.title}</Title>
                                <Description>{props.data.description}</Description>
                            </DetailBox>
            
                            <IconsBox $short={true}>
                                <IconBox $short={true}>
                                    <Icon $short={true} src={song_ico} alt="song_ico" />
                                    <IconText $short={true}>{props.data.songs?.length}</IconText>
                                </IconBox>
            
                                <IconBox $short={true}>
                                    <Icon $short={true} src={heart_ico} alt="heart_ico" />
                                    <IconText $short={true}>{props.data.heart_count >= 1e3 ? format(props.data.heart_count) : props.data.heart_count}</IconText>
                                </IconBox>
                            </IconsBox>
                        </ContentInBox>

                        <MoreBox>
                            <Category>{props.data.category}</Category>
                            <CreatedAt>{elapsedTime(new Date(props.data.created_at).getTime())}</CreatedAt>
                        </MoreBox>
                    </ContentBox>
                </Item>
                :
                <Item onClick={() => navigate(`/premus/${props.data.node_id}`)}>
                    <ImageBox>
                        <Image src={`http://localhost:8080/premus/${props.data.made_by}/${props.data.node_id}/${props.data.image}`} alt="preset_image" />
                    </ImageBox>
        
                    <ContentBox>
                        <Title>{props.data.title}</Title>
        
                        <IconsBox>
                            <IconBox>
                                <Icon src={song_ico} alt="song_ico" />
                                <IconText>{props.data.songs?.length}</IconText>
                            </IconBox>
        
                            <IconBox>
                                <Icon src={heart_ico} alt="heart_ico" />
                                <IconText>{props.data.heart_count >= 1e3 ? format(props.data.heart_count) : props.data.heart_count}</IconText>
                            </IconBox>
                        </IconsBox>
                    </ContentBox>
                </Item>
            }
        </>
    );
}

export default Preset;