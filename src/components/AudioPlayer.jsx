import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import "../styles/AudioPlayer.css";

const songs = {
  id: [1, 2, 3, 4, 5],
  song: [
     "https://listen.openstream.co/4428/audio",
    // "https://centova.aarenworld.com/proxy/894tamilfm/stream",
    "https://radios.crabdance.com:8002/5",
    // "https://www.liveradio.es/http://stream.zeno.fm/ihpr0rqzoxquv",
    "https://radios.crabdance.com:8002/1",
    // "https://www.liveradio.es/http://radio.lotustechnologieslk.net:8006/;stream.mp3",
    "https://radios.crabdance.com:8002/2",
    // "https://jayamfm-prabak78.radioca.st/stream",
    "https://radios.crabdance.com:8002/4",  
  ],
  images: ["hfm.png", "rcfm.png", "rmfm.png", "sfm.png", "bigfm.png"],
  song_name: [
    "Hello FM 106.4",
    "Radio City 91.1",
    "Radio Mirchi 98.3",
    "Suriyan FM 93.5",
    "Big FM 92.7",
  ],
};

const NUM_BARS = 25;

const AudioPlayer = () => {
  const audioRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [started, setStarted] = useState(false);
  const [changingVolume, setChangingVolume] = useState(false);

  const initializeAudios = () => {
    audioRefs.current = songs.song.map((url, index) => {
      const audio = new Audio(url);
      audio.loop = true;
      audio.muted = index !== currentIndex || isMuted;
      audio.volume = volume;
      return audio;
    });

    audioRefs.current.forEach((audio) => {
      audio.play().catch(() => {});
    });
  };

  useEffect(() => {
    if (started) {
      initializeAudios();
    }
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, [started]);

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
    if (!currentAudio) return;
    currentAudio.muted = !currentAudio.muted;
    setIsMuted(currentAudio.muted);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setChangingVolume(true);
    setVolume(parseFloat(e.target.value));
    setTimeout(() => {
      setChangingVolume(false);
    }, 300);
  };

  const handleStart = () => {
    setStarted(true);
  };

  const visualizerBars = Array.from({ length: NUM_BARS }, (_, index) => {
    const animationDelay = Math.random() * 2;
    const maxHeight = 35 + Math.random() * 30;
    return { animationDelay, maxHeight, key: index };
  });

  if (!started) {
    return (
      <div className="start-screen" onClick={handleStart} style={{ cursor: "pointer" }}>
        <div className="adsift-container">
          <h1 className="adsift-title">ADSIFT</h1>
          <div className="big-play-icon">
            <Play size={200} />
          </div>
        </div>
      </div>
    );
  }

  const visualizerAnimationPaused = isMuted || changingVolume;

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

        <div className="visualizer-container">
          <div className={`visualizer ${visualizerAnimationPaused ? "paused" : ""}`}>
            {visualizerBars.map((bar) => (
              <div
                key={bar.key}
                className="visualizer-bar"
                style={{
                  animationDelay: `${bar.animationDelay}s`,
                  "--max-height": `${bar.maxHeight}px`,
                }}
              />
            ))}
          </div>
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
