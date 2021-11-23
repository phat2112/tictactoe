import React, { useEffect, useRef } from "react";
import { ButtonWrapper } from "components/Common/Styles";

type Props = {
  onClick: () => void;
  content: string;
};

const Button: React.FC<Props> = ({ onClick, content }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    if (audioRef.current) {
      await audioRef.current.play();
    }
    onClick();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
    }
  }, []);
  return (
    <div>
      <ButtonWrapper onClick={handleClick}>{content}</ButtonWrapper>
      <audio autoPlay ref={audioRef}>
        <source
          src="https://tic-tac-toe-server-nodejs.herokuapp.com/click-effect.wav"
          type="audio/wav"
        />
      </audio>
    </div>
  );
};

export default Button;
