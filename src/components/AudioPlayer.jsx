import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import '../styles/AudioPlayer.css';

const songs = {
  song: [
    "https://listen.openstream.co/4428/audio",
    "https://prclive1.listenon.in/",
    "https://www.liveradio.es/http://radios.crabdance.com:8002/1",
    "https://radios.crabdance.com:8002/2",
    "https://www.liveradio.es/http://radios.crabdance.com:8002/4"
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    audioRefs.current = songs.song.map((url, index) => {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.muted = isMuted;
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      return audio;
    });

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
        audio.onplay = null;
        audio.onpause = null;
      });
    };
  }, []);

  useEffect(() => {
    audioRefs.current.forEach((audio) => {
      audio.volume = volume;
      audio.muted = isMuted;
    });
  }, [volume, isMuted]);

  useEffect(() => {
    const currentAudio = audioRefs.current[currentIndex];
    audioRefs.current.forEach((audio, index) => {
      if (index === currentIndex) {
        if (isPlaying) {
          currentAudio.play().catch((error) => {
            console.error("Failed to play audio:", error);
            setIsPlaying(false); // Fallback to pause state if play fails
          });
        }
      } else {
        audio.pause();
      }
    });
  }, [currentIndex, isPlaying]);

  const togglePlay = () => {
    const currentAudio = audioRefs.current[currentIndex];
    if (isPlaying) {
      currentAudio.pause();
    } else {
      currentAudio.play().catch((error) => {
        console.error("Failed to play audio:", error);
        setIsPlaying(false); // Fallback to pause state if play fails
      });
    }
  };

  const changeSong = (newIndex) => {
    audioRefs.current[currentIndex].pause();
    setCurrentIndex(newIndex);
    setIsPlaying(true);
    audioRefs.current[newIndex].play().catch((error) => {
      console.error("Failed to play audio:", error);
      setIsPlaying(false); // Fallback to pause state if play fails
    });
  };

  const nextSong = () => {
    const newIndex = (currentIndex + 1) % songs.song.length;
    changeSong(newIndex);
  };

  const prevSong = () => {
    const newIndex = (currentIndex - 1 + songs.song.length) % songs.song.length;
    changeSong(newIndex);
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setVolume(newMuted ? 0 : 1); // Set volume to 0 when muted, restore to 1 when unmuted
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0); // Mute if volume is 0
  };

  return (
    <div className="audio-player-wrapper">
      <div className="song-info">
        <img src={songs.images[currentIndex]} alt="Song Cover" className="song-cover" />
        <p className="song-title">{songs.song_name[currentIndex]}</p>
      </div>

      <div className="audio-player">
        <div className="controls">
          <button onClick={prevSong} className="control-btn">
            <SkipBack size={22} />
          </button>
          <button onClick={togglePlay} className="play-pause-btn">
            {isPlaying ? <Pause size={28} /> : <Play size={28} />}
          </button>
          <button onClick={nextSong} className="control-btn">
            <SkipForward size={22} />
          </button>
        </div>

        <div className="volume-container">
          <button onClick={toggleMute} className="volume-btn">
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
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
