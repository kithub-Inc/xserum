import React, { useRef } from "react";
import styled from 'styled-components';
import WaveSurferOrigin from "wavesurfer.js";

export const WaveSurfer = (props: { type: 'preset' | 'music', node_id: number, data: any }) => {
    const waveform = useRef(null);
    const target = useRef(null);
    let wavesurfer: any;

    const setWaveSurfer = () => {
        if (waveform.current && target.current) {
            wavesurfer = new WaveSurferOrigin({
                container: waveform.current,
                media: target.current,
    
                width: 400,
                height: 28,
    
                barWidth: 2,
                barHeight: 0,
                barRadius: 5,
    
                cursorWidth: 0,
    
                waveColor: `#afafafaf`,
                progressColor: `#000000`
            });
        }
    }

    const PreItem = styled.div`width: 100%; height: 50px; border-radius: 5px; display: flex; flex-direction: column; align-items: flex-start; cursor: default; margin-bottom: 50px;`;
    const PreTitle = styled.p`margin-right: 25px; margin-bottom: 0 !important; padding: 5px 10px; font-size: 14px; border: 1px solid black; border-radius: 5px;`;
    const PreAudio = styled.div`padding: 10px; font-size: 14px; border: 1px solid black; border-radius: 5px; margin-top: 10px;`;
    const PreIcon = styled.img`width: 9px; margin-right: 5px;`;

    const song_ico = require(`../images/music-alt.png`);
    const play_ico = require(`../images/play.png`);
    
    return (
        <PreItem onClick={() => wavesurfer.play()}>
            <PreTitle>
                <PreIcon src={props.type === `preset` ? play_ico : song_ico} alt="icon" />
                {props.data}
            </PreTitle>

            <PreAudio ref={waveform} />
            <audio src={ `http://localhost:8080/premus/ice1github@gmail.com/${props.node_id}/${props.data}` } ref={target} onLoadStart={setWaveSurfer}></audio>
        </PreItem>
    );
}

export default WaveSurfer;