import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import { GiCrossMark, GiCircleClaws } from "react-icons/gi";
import { userContext } from "../../App";

const io = require("socket.io-client");

type BlockIndex = {
  name: string;
  step: [number, number];
  room: string;
};

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(to right, #11998e, #38ef7d);
`;

const HeaderWrapper = styled.div`
  width: 80vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 100px;
`;

const TextWrapper = styled.p<{ isCurrentStep?: boolean }>`
  font-size: 60px;
  -webkit-text-fill-color: #11998e;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #c31432;
  text-decoration: ${(props) => (props.isCurrentStep ? "underline" : "none")};
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 220px;
`;

const RowWrapper = styled.div`
  width: 70px;
  height: 70px;
  border: 1px solid #fff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BlockWin = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background: #bbd2c5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.button`
  width: 150px;
  height: 70px;
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  border: 1px solid #dd1818;
  color: #dd1818;
  font-size: 20px;
  font-weight: 700;
`;

const MessageVictory = styled.h1`
  color: #dd1818;
`;

let socket: any;
let ENDPOINT = process.env.REACt_APP_ENDPOINT;

const TicTacToeComponent = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backupActiveBlock = useRef<BlockIndex[]>([]);

  const [activeBlock, setActiveBlock] = useState<BlockIndex[]>([]);
  const [victoryMsg, setVictoryMsg] = useState("");
  const [roomInfo, setRoomInfo] = useState<Room | null>(null);
  const [currentStep, setCurrentStep] = useState("");

  const location: any = useLocation();
  const history = useHistory();
  const { user: username } = useContext(userContext);
  const { roomName } = location?.state;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"],
    });

    socket.emit("get-markDown-list", roomName, setActiveBlock);

    socket.emit("get-room-info", roomName, setRoomInfo);

    return () => {
      socket.emit("leave-room", username, roomName);
      socket.emit("reset-step", roomName);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ENDPOINT]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    socket.emit("get-room-info", roomName, setRoomInfo);
  });

  useEffect(() => {
    if (!currentStep) {
      setCurrentStep(roomInfo ? roomInfo.personJoined[0] : "");
    } else if (activeBlock.length) {
      if (currentStep === activeBlock[activeBlock.length - 1].name) {
        const currentPlayerTurn = roomInfo
          ? roomInfo.personJoined.find((name) => name !== currentStep)
          : "";
        if (currentPlayerTurn) {
          setCurrentStep(currentPlayerTurn);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomInfo, activeBlock, currentStep]);

  useEffect(() => {
    socket.on("user-won", (msg: string) => {
      setVictoryMsg(msg);
      audioRef.current?.play();
    });

    socket.on("mark-down", (step: BlockIndex) => {
      setActiveBlock([...backupActiveBlock.current, step]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    backupActiveBlock.current = [...activeBlock];
  }, [activeBlock]);

  const currentPlayer = useMemo(() => {
    return roomInfo?.personJoined.findIndex(
      (person: string) => person === username
    );
  }, [roomInfo?.personJoined, username]);

  const handleClick = useCallback(
    (firstIndex: number, secIndex: number) => {
      const blockIndex: BlockIndex = {
        step: [firstIndex, secIndex],
        name: username || "",
        room: roomName,
      };

      if (
        activeBlock.findIndex(
          (block) =>
            JSON.stringify(block.step) === JSON.stringify(blockIndex.step)
        ) !== -1
      )
        return;

      const currentPlayerStep = [...activeBlock, blockIndex].filter(
        (item) => item.name === username
      );
      const otherPlayerStep = [...activeBlock, blockIndex].filter(
        (item) => item.name !== username
      );
      if (
        (currentPlayer !== -1 &&
          currentPlayer !== 0 &&
          otherPlayerStep.length - currentPlayerStep.length === 0) ||
        (currentPlayer !== -1 &&
          currentPlayer === 0 &&
          currentPlayerStep.length - otherPlayerStep.length === 1)
      ) {
        socket.emit("select-step", blockIndex.step, username, roomName);
      }
    },
    [activeBlock, currentPlayer, roomName, username]
  );

  const handleGenerateIcon = useCallback(
    (firstIndex: number, secIndex: number) => {
      const hosted = activeBlock.findIndex((block) => {
        return (
          JSON.stringify(block.step) === JSON.stringify([firstIndex, secIndex])
        );
      });
      if (hosted === -1) return;
      const isCurrentUser = activeBlock[hosted].name === username;
      if (isCurrentUser) {
        return <GiCrossMark color="#ED213A" size={28} />;
      } else {
        return <GiCircleClaws color="#021B79" size={28} />;
      }
    },
    [username, activeBlock]
  );

  const handleGameFinished = () => {
    setActiveBlock([]);
    socket.emit("reset-step", roomName);
    socket.emit("leave-room", username, roomName);
    socket.emit("get-room-info", roomName, setRoomInfo);
    setVictoryMsg("");
    history.push("/room");
  };
  return (
    <Wrapper>
      <HeaderWrapper>
        <TextWrapper isCurrentStep={currentStep === roomInfo?.personJoined[0]}>
          {roomInfo?.personJoined[0]}
        </TextWrapper>
        <TextWrapper>VS</TextWrapper>
        <TextWrapper isCurrentStep={currentStep === roomInfo?.personJoined[1]}>
          {roomInfo?.personJoined[1]}
        </TextWrapper>
      </HeaderWrapper>
      <Container>
        {new Array(3).fill(0).map((_, firstIndex) => (
          <div key={`col-${firstIndex}`}>
            {new Array(3).fill(0).map((_, secIndex) => (
              <RowWrapper
                ref={elementRef}
                key={`row-${secIndex}`}
                id={`box-${firstIndex}-${secIndex}`}
                onClick={() => handleClick(firstIndex, secIndex)}
              >
                {handleGenerateIcon(firstIndex, secIndex)}
              </RowWrapper>
            ))}
          </div>
        ))}
      </Container>
      {victoryMsg && (
        <>
          <BlockWin>
            <MessageVictory>{victoryMsg}</MessageVictory>
            <ButtonWrapper onClick={handleGameFinished}>
              Leave Room
            </ButtonWrapper>
          </BlockWin>
          <audio autoPlay ref={audioRef}>
            <source
              src="https://tic-tac-toe-server-nodejs.herokuapp.com/victory-sound.mp3"
              type="audio/mp3"
            />
          </audio>
        </>
      )}
    </Wrapper>
  );
};

export default TicTacToeComponent;
