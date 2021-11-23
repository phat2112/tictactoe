import { useEffect, useRef } from "react";

const BackgroundSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.muted = false;
      }
    }, 500);
  }, []);
  return (
    <audio controls autoPlay ref={audioRef} muted>
      <source
        src="https://tic-tac-toe-server-nodejs.herokuapp.com/purrple-cat-equinox.mp3"
        type="audio/mpeg"
      />
    </audio>
  );
};

export default BackgroundSound;
