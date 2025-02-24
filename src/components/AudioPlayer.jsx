import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import "../styles/AudioPlayer.css";

const songs = {
  song: [
    "https://listen.openstream.co/4428/audio",
    "https://radios.crabdance.com:8002/5",
    "https://www.liveradio.es/http://radios.crabdance.com:8002/1",
    "https://radios.crabdance.com:8002/2",
    "https://radios.crabdance.com:8002/4"
  ],
  images: ["hfm.png", "rcfm.png", "rmfm.png", "sfm.png", "bigfm.png"],
  song_name: [
    "Hello FM 106.4",
    "Radio City 91.1",
    "Radio Mirchi 98.3",
    "Suriyan FM 93.5",
    "Big FM 92.7"
  ]
};

const AudioPlayer = () => {
  const audioRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioRefs.current = songs.song.map((url, index) => {
      const audio = new Audio(url);
      audio.loop = true;
      audio.play().catch((error) => console.error("Audio play error:", error));
      audio.muted = index !== currentIndex;
      audio.volume = volume;
      return audio;
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  useEffect(() => {
    audioRefs.current.forEach((audio, index) => {
      audio.muted = index !== currentIndex || isMuted;
      audio.volume = volume;
    });
  }, [currentIndex, volume, isMuted]);

  const nextStation = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.song.length);
  };

  const prevStation = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + songs.song.length) % songs.song.length);
  };

  const togglePlayPause = () => {
    const currentAudio = audioRefs.current[currentIndex];
    currentAudio.muted = !currentAudio.muted;
    setIsMuted(currentAudio.muted);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="audio-player-wrapper">
      <div className="song-info">
        <img src={songs.images[currentIndex]} alt="Station Cover" className="song-cover" />
        <p className="song-title">{songs.song_name[currentIndex]}</p>
      </div>

      <div className="audio-player">
        <div className="controls">
          <button onClick={prevStation} className="control-btn">
            <SkipBack size={22} />
          </button>
          <button onClick={togglePlayPause} className="play-pause-btn">
            {isMuted ? <Play size={28} /> : <Pause size={28} />}
          </button>
          <button onClick={nextStation} className="control-btn">
            <SkipForward size={22} />
          </button>
        </div>

        <div className="volume-container">
          <button onClick={toggleMute} className="volume-btn">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
