import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export const voiceWave = [
  8, 14, 22, 12, 28, 34, 20, 12, 26, 18, 36, 24, 14, 30, 38, 22, 12, 20, 32, 26,
  16, 24, 12, 8,
];
export const voiceTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

export function AudioMessagePlayer({
  url,
  duration = 14,
  mine = false,
}: {
  url?: string;
  duration?: number;
  mine?: boolean;
}) {
  const total = Number.isFinite(duration) && duration > 0 ? duration : 14;
  const audio = useRef<HTMLAudioElement>(null);
  const request = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [simulated, setSimulated] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(1);
  const position = useRef(0);
  const updatePosition = (value: number) => {
    position.current = value;
    setElapsed(value);
  };

  useEffect(() => {
    const element = audio.current;
    setPlaying(false);
    setSimulated(false);
    updatePosition(0);
    return () => {
      request.current += 1;
      element?.pause();
    };
  }, [url, total]);
  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed;
  }, [speed, url]);
  useEffect(() => {
    if (!playing || !simulated) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const next = Math.min(
        total,
        position.current + ((now - last) / 1000) * speed,
      );
      last = now;
      updatePosition(next);
      if (next >= total) setPlaying(false);
    }, 100);
    return () => window.clearInterval(timer);
  }, [playing, simulated, speed, total]);

  const toggle = async () => {
    const token = ++request.current;
    const element = audio.current;
    if (playing) {
      setPlaying(false);
      element?.pause();
      return;
    }
    if (position.current >= total) {
      updatePosition(0);
      if (element) element.currentTime = 0;
    }
    setPlaying(true);
    if (!url || simulated || !element) {
      setSimulated(true);
      return;
    }
    // A bounded wait also covers browsers that leave play() pending indefinitely.
    const timeout = window.setTimeout(() => {
      if (request.current === token) {
        request.current += 1;
        element.pause();
        setSimulated(true);
      }
    }, 1800);
    try {
      element.playbackRate = speed;
      await element.play();
      if (request.current !== token) element.pause();
    } catch {
      if (request.current === token) setSimulated(true);
    } finally {
      window.clearTimeout(timeout);
    }
  };

  return (
    <div className={`voice-player ${mine ? "voice-player-mine" : ""}`}>
      <audio
        ref={audio}
        src={url}
        preload="none"
        onTimeUpdate={() => {
          if (!simulated && audio.current) {
            updatePosition(Math.min(total, audio.current.currentTime));
            if (audio.current.currentTime >= total) {
              audio.current.pause();
              setPlaying(false);
            }
          }
        }}
        onEnded={() => {
          updatePosition(total);
          setPlaying(false);
        }}
        onError={() => {
          audio.current?.pause();
          setSimulated(true);
        }}
      />
      <button
        type="button"
        className="voice-play"
        onClick={() => void toggle()}
        aria-label={playing ? "Mettre en pause" : "Écouter la note vocale"}
      >
        {playing ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" />
        )}
      </button>
      <div className="voice-track">
        <svg viewBox="0 0 144 40" className="voice-wave" aria-hidden="true">
          {voiceWave.map((height, index) => (
            <rect
              key={index}
              x={index * 6}
              y={(40 - height) / 2}
              width="3"
              height={height}
              rx="1.5"
              className={
                index / voiceWave.length < elapsed / total ? "played" : ""
              }
            />
          ))}
        </svg>
        <span className="voice-time">
          {voiceTime(elapsed)} / {voiceTime(total)}
        </span>
      </div>
      <button
        type="button"
        className="voice-speed"
        aria-label={`Vitesse de lecture : ${speed}x`}
        onClick={() =>
          setSpeed((current) => (current === 1 ? 1.5 : current === 1.5 ? 2 : 1))
        }
      >
        {speed}x
      </button>
      {simulated && (
        <small className="voice-fallback">
          Aperçu simulé · audio indisponible
        </small>
      )}
    </div>
  );
}
