import { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { InputWrapper } from "components/Common/Styles";
import Button from "components/Common/Button";
import { userContext } from "../../App";

const io = require("socket.io-client");

let socket: any;
let ENDPOINT = process.env.REACt_APP_ENDPOINT;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #11998e, #38ef7d);
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  margin: auto;
`;

const TitleWrapper = styled.h1`
  color: #c31432;
  transition: 0.3s;
  font-size: 60px;
  min-width: 500px;
  -webkit-text-fill-color: #11998e;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #c31432;
`;

const ErrorText = styled.p`
  color: red;
`;
const Login = () => {
  const [inputValue, setInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [title, setTitle] = useState("");
  const currentTitle = useRef("WebSocket");

  const { setUser } = useContext(userContext);

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"],
    });
    return () => {
      socket.emit("disconnect");
      socket.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("error", (message: string) => setErrorMsg(message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    const randomTime = Math.random() * (300 - 100) + 100;
    let timerId: any;

    if (title.length < currentTitle.current.length) {
      timerId = setTimeout(() => {
        setTitle(title + currentTitle.current[title.length]);
      }, randomTime);
    } else {
      currentTitle.current =
        currentTitle.current === "WebSocket" ? "Socketio" : "WebSocket";
      setTimeout(() => {
        setTitle("");
      }, 600);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [title]);

  const history = useHistory();

  const handleRedirectRoom = () => {
    if (inputValue) {
      socket.emit("create-user", inputValue, () => {
        setErrorMsg("");
        setUser(inputValue);
        history.push("/room", { username: inputValue });
      });
    } else {
      alert("please enter username");
    }
  };
  return (
    <Wrapper>
      <TitleWrapper>Demo {title}</TitleWrapper>
      <ContentWrapper>
        <InputWrapper
          type="text"
          placeholder="Enter Username"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <Button onClick={handleRedirectRoom} content="Login" />
        {errorMsg && <ErrorText>{errorMsg}</ErrorText>}
      </ContentWrapper>
    </Wrapper>
  );
};

export default Login;
