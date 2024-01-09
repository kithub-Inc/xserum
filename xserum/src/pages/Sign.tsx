import React, { useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { Cookies } from 'react-cookie';

const Sign = () => {
    const avatar_ico = require(`../images/avatar.png`);

    const { type } = useParams();

    const Form = styled.div`width: 500px; margin: 0 auto;`;
    const Dflex = styled.div`display: flex;`;
    const DflexItem = styled.div`flex: 1; margin-right: 25px; &:last-child { margin-right: 0; }`;
    const Input = styled.input`padding: 10px 15px; border: 1px solid black; border-radius: 5px; font-size: 16px; outline: none; width: 100%; transition: .1s; &:focus { outline: 5px solid rgba(0, 0, 0, .1); } margin-bottom: 15px !important;`;
    const Avatar = styled.label`margin: 0 auto; display: block; width: 200px; height: 200px; border-radius: 100%; border: 1px solid black; margin-bottom: 50px; overflow: hidden; img { width: 100%; } .uldpht { width: 25px; } display: flex; justify-content: center; align-items: center;`;
    const Title = styled.h1`text-align: center;`;
    const Description = styled.p`text-align: center;`;
    const Submit = styled.button`width: 100%; padding: 15px 15px; margin-top: 5px;`;

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

    const nameRef: any = useRef(null);
    const emailRef: any = useRef(null);
    const passwordRef: any = useRef(null);

    const submitHandler = () => {
        if (
            /^[A-Za-z0-9][A-Za-z0-9]*$/.test(nameRef.current.value) &&
            // eslint-disable-next-line no-useless-escape
            /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(emailRef.current.value) &&
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(passwordRef.current.value)
        ) {
            const formData = new FormData();
            formData.append(`avatar`, image);
            formData.append(`name`, nameRef.current.value);
            formData.append(`email`, emailRef.current.value);
            formData.append(`password`, passwordRef.current.value);
            
            axios({
                method: `post`,
                url: `http://localhost:8080/oauth/generate`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(response => {
                const { status, message, token } = response.data;

                if (status === 200) {
                    const cookies = new Cookies();
                    cookies.set(`_tkn`, token);

                    window.location.href = `/profile?author=${emailRef.current.value}`;
                } else console.error(message);
            });
        }
    }

    const loginHandler = () => {
        if (
            // eslint-disable-next-line no-useless-escape
            /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-za-z0-9\-]+/.test(emailRef.current.value) &&
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(passwordRef.current.value)
        ) {
            axios({
                method: `post`,
                url: `http://localhost:8080/oauth/validation`,
                data: { email: emailRef.current.value, password: passwordRef.current.value }
            }).then(response => {
                const { status, message, token } = response.data;

                if (status === 200) {
                    const cookies = new Cookies();
                    cookies.set(`_tkn`, token);

                    window.location.href = `/profile?author=${emailRef.current.value}`;
                } else console.error(message);
            });
        }
    }

    return (
        <div className="main">
            <div className="container">
                {
                    type === `signin` ?
                    <Form>
                        <br /><br /><br /><br /><br /><br /><br /><br />

                        <Title>💫 Account Login</Title>
                        <Description>Go ahead and login an account and upload your preset, music!</Description>

                        <br />
                        <Dflex>
                            <DflexItem>
                                <p>Email</p>
                                <Input ref={emailRef} placeholder="Email" required={true} />
                            </DflexItem>

                            <DflexItem>
                                <p>Password</p>
                                <Input ref={passwordRef} placeholder="Password" type="password" required={true} />
                            </DflexItem>
                        </Dflex>

                        <Submit onClick={loginHandler}>Submit</Submit>

                        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    </Form>
                    :
                    <Form>
                        <input type="file" id="avatar" style={{ display: `none` }} accept="image/*" ref={imageRef} onChange={saveImage} />
                        <Avatar htmlFor="avatar">
                            { image ? <img src={image} alt="avatar" /> : <img className="uldpht" src={avatar_ico} alt="avatar" /> }
                        </Avatar>

                        <Title>💫 Account Generate</Title>
                        <Description>Go ahead and create an account and upload your preset, music!</Description>

                        <br />

                        <p>Name</p>
                        <Input ref={nameRef} placeholder="Name" required={true} />

                        <Dflex>
                            <DflexItem>
                                <p>Email</p>
                                <Input ref={emailRef} placeholder="Email" required={true} />
                            </DflexItem>

                            <DflexItem>
                                <p>Password</p>
                                <Input ref={passwordRef} placeholder="Password" type="password" required={true} />
                            </DflexItem>
                        </Dflex>

                        <br />

                        <p>Name: English, number included <br /> Password: 8 or more characters, numbers, special characters included</p>

                        <Submit onClick={submitHandler}>Submit</Submit>

                        <br /><br /><br /><br />
                    </Form>
                }
            </div>
        </div>
    );
}

export default Sign;