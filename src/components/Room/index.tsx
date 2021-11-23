import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { CardWrapper, InputWrapper } from "components/Common/Styles";
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
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #11998e, #38ef7d);
`;

const TitleWrapper = styled.h3`
  color: #c31432;
  width: 260px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Rooms = () => {
  const [listRoom, setListRoom] = useState<Room[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { user: currentUser } = useContext(userContext);

  const history = useHistory();

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"],
    });
    socket.on("rooms", (rooms: Room[]) => {
      setListRoom(rooms);
    });

    return () => {
      setListRoom([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT]);

  useEffect(() => {
    socket.on("room-created", (room: Room) => {
      setListRoom([...listRoom, room]);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const handleCreateRoom = () => {
    if (!inputValue) return;
    socket.emit("create-room", inputValue, () => setInputValue(""));
  };

  const handleJoinRoom = (room: Room) => {
    socket.emit("join-room", currentUser, room.name, () =>
      history.push("/tictactoe", {
        username: currentUser,
        roomName: room.name,
      })
    );
  };

  return (
    <Wrapper>
      {listRoom.length ? (
        listRoom.map((room) => (
          <CardWrapper
            key={`room-${room.name}`}
            onClick={() => handleJoinRoom(room)}
          >
            {room.name} - {room.personJoined.length}/2
          </CardWrapper>
        ))
      ) : (
        <></>
      )}
      <TitleWrapper>Create Room</TitleWrapper>
      <ContentWrapper>
        <InputWrapper
          type="name"
          value={inputValue}
          placeholder="Enter room name"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.code === "Enter") handleCreateRoom();
          }}
        />
        {/* <ButtonWrapper onClick={handleCreateRoom}>Create</ButtonWrapper> */}
        <Button onClick={handleCreateRoom} content="Create" />
      </ContentWrapper>
    </Wrapper>
  );
};

export default Rooms;
