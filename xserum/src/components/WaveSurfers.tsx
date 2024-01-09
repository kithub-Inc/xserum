import React from "react";

import WaveSurfer from "./WaveSurfer.tsx";

export const WaveSurfers = (props: { type: 'preset' | 'music', node_id: number, data: any[] }) => {
    return (
        props.data.map((e, idx) => <WaveSurfer type={props.type} node_id={props.node_id} key={idx} data={e} />)
    );
}

export default WaveSurfers;