import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Cookies } from 'react-cookie';
import axios from 'axios';

const Upload = () => {
    const avatar_ico = require(`../images/avatar.png`);

    const cookies = new Cookies();
    const navigate = useNavigate();
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

    const Form = styled.div`width: 500px; margin: 0 auto;`;
    const Dflex = styled.div`display: flex;`;
    const DflexItem = styled.div`width: 100%; margin-right: 25px; &:last-child { margin-right: 0; }`;
    const Input = styled.input`padding: 10px 15px; border: 1px solid black; border-radius: 5px; font-size: 16px; outline: none; width: 100%; transition: .1s; &:focus { outline: 5px solid rgba(0, 0, 0, .1); } margin-bottom: 15px !important;`;
    const Image = styled.label`margin: 0 auto; display: block; width: 200px; height: 200px; border-radius: 5px; border: 1px solid black; margin-bottom: 50px; overflow: hidden; img { width: 100%; } .uldpht { width: 25px; } display: flex; justify-content: center; align-items: center;`;
    const Title = styled.h1`text-align: center;`;
    const Description = styled.p`text-align: center;`;
    const Submit = styled.button`width: 100%; padding: 15px 15px; margin-top: 5px;`;
    const Select = styled.select`width: 50%; padding: 10px 15px; border: 1px solid black; border-radius: 5px; font-size: 16px; outline: none; width: 100%; transition: .1s; &:focus { outline: 5px solid rgba(0, 0, 0, .1); } margin-bottom: 15px !important;`;

    const [image, setImage] = useState(``);
    const imageRef: any = useRef(null);

    const saveImage = () => {
        if (imageRef.current) {
            const file = imageRef.current.files[0];
            const reader: any = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImage(reader.result);
            }
        }
    }

    const fileRef: any = useRef(null);
    const titleRef: any = useRef(null);
    const descriptionRef: any = useRef(null);
    const typeRef: any = useRef(null);
    const categoryRef: any = useRef(null);

    const uploadHandler = () => {
        if (
            fileRef.current.files.length > 0 &&
            titleRef.current.value.trim().length !== 0 &&
            descriptionRef.current.value.trim().length !== 0 &&
            [`Dance / EDM`, `R&B / Hiphop`, `Rock`, `Jazz`, `POP`, `Classic`, `Electronic`, `Ballad`, `Other`].includes(categoryRef.current.value) &&
            [`preset`, `music`].includes(typeRef.current.value.toLowerCase())
        ) {
            const formData = new FormData();
            for (let i = 0; i < fileRef.current.files.length; i++) formData.append(`${i}`, fileRef.current.files[i]);
            formData.append(`image`, image);
            formData.append(`title`, titleRef.current.value);
            formData.append(`description`, descriptionRef.current.value);
            formData.append(`type`, typeRef.current.value);
            formData.append(`category`, categoryRef.current.value);
            formData.append(`email`, session.email);
            
            axios({
                method: `post`,
                url: `http://localhost:8080/premus/upload`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(response => {
                const { status, message, node_id } = response.data;

                if (status === 200) navigate(`/premus/${node_id}`);
                else console.error(message);
            });
        }
    }

    return (
        <div className="main">
            <div className="container">
                <Form>
                    <input type="file" id="image" style={{ display: `none` }} accept="image/*" ref={imageRef} onChange={saveImage} />
                    <Image htmlFor="image">
                        { image ? <img src={image} alt="avatar" /> : <img className="uldpht" src={avatar_ico} alt="avatar" /> }
                    </Image>

                    <Title>💫 Upload</Title>
                    <Description>Put up your own music.</Description>

                    <br />

                    <p>Audio Files</p>
                    <Input type="file" id="file" accept="audio/*" multiple={true} ref={fileRef} />

                    <p>Title</p>
                    <Input placeholder="Title" required={true} ref={titleRef} />

                    <p>Description</p>
                    <Input placeholder="Description" required={true} ref={descriptionRef} />

                    <Dflex>
                        <DflexItem>
                            <p>Type</p>

                            <Select ref={typeRef}>
                                <option value="preset">Preset</option>
                                <option value="music">Music</option>
                            </Select>
                        </DflexItem>

                        <DflexItem>
                            <p>Category</p>

                            <Select ref={categoryRef}>
                                <option value="Dance / EDM">Dance / EDM</option>
                                <option value="R&B / Hiphop">R&B / Hiphop</option>
                                <option value="Rock">Rock</option>
                                <option value="Jazz">Jazz</option>
                                <option value="POP">POP</option>
                                <option value="Classic">Classic</option>
                                <option value="Electronic">Electronic</option>
                                <option value="Ballad">Ballad</option>
                                <option value="Other">Other</option>
                            </Select>
                        </DflexItem>
                    </Dflex>

                    <Submit onClick={uploadHandler}>Submit</Submit>

                    <br /><br /><br /><br />
                </Form>
            </div>
        </div>
    );
}

export default Upload;