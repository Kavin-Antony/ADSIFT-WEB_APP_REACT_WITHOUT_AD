import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import "../styles/AudioPlayer.css";

const songs = {
  id : [1,2,3,4,5],
  song: [
    "https://listen.openstream.co/4428/audio",
    "https://radios.crabdance.com:8002/5",
    "https://radios.crabdance.com:8002/1",
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

const NUM_BARS = 20; // number of visualizer bars

const AudioPlayer = () => {
  const audioRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [started, setStarted] = useState(false);
  // state for temporarily pausing visualizer on volume change if needed
  const [changingVolume, setChangingVolume] = useState(false);

  const initializeAudios = () => {
    audioRefs.current = songs.song.map((url, index) => {
      const audio = new Audio(url);
      audio.loop = true;
      audio.muted = index !== currentIndex || isMuted;
      audio.volume = volume;
      
      // Set error handling for each audio
      audio.onerror = () => {
        console.error(`Error loading ${songs.song_name[index]} (${url}). Skipping station...`);
        // If the broken station is the current station, move to the next station
        if (index === currentIndex) {
          nextStation();
        }
      };

      return audio;
    });
    // Play all audios (only the active one is unmuted)
    audioRefs.current.forEach(audio => {
      audio.play().catch((error) => console.error("Audio play error:", error));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  // Update audio parameters when currentIndex, volume, or isMuted changes
  useEffect(() => {
    audioRefs.current.forEach((audio, index) => {
      audio.muted = index !== currentIndex || isMuted;
      audio.volume = volume;
    });

    // Check the current audio's network state to auto-skip if there's no source.
    const currentAudio = audioRefs.current[currentIndex];
    if (currentAudio && currentAudio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
      console.warn("No audio source detected, skipping station...");
      nextStation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // When the volume is being changed, set the changingVolume flag to true
    setChangingVolume(true);
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    // For example, remove the flag after a short delay (adjust as needed)
    setTimeout(() => {
      setChangingVolume(false);
    }, 300);
  };

  const handleStart = () => {
    setStarted(true);
  };

  // Create an array for visualizer bars with randomized maximum heights and animation delays.
  const visualizerBars = Array.from({ length: NUM_BARS }, (_, index) => {
    const animationDelay = Math.random() * 2; // random delay up to 2s
    // randomized max height between 20px and 85px (20 + up to 65)
    const maxHeight = 20 + Math.random() * 65;
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

  // Determine if visualizer should animate. If muted (paused) or volume is changing, pause animation.
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
                  // Pass max height as a CSS variable so the keyframes can use it.
                  "--max-height": `${bar.maxHeight}px`
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
