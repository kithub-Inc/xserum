import React from "react";
import styled from 'styled-components';

import { Ipreset, Preset } from "./Preset.tsx";

export const Presets = (props: { data: Ipreset[], short: boolean }) => {
    const Items = styled.div`
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;`;

    return (
        <Items>
            { props.data.map(e => <Preset key={e.node_id} data={e} short={props.short} />) }
        </Items>
    );
}

export default Presets;