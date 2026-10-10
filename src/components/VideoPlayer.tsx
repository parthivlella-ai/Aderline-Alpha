"use client";

import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RotateCcw,
  AlertCircle,
  Loader2,
  Film,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ src, poster, title, autoPlay = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    setCurrentTime(0);
  }, [src]);

  function handlePlayPause() {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        // Autoplay policy or codec error
      });
    }
  }

  function handleTimeUpdate() {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  }

  function handleLoadedMetadata() {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const time = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (!videoRef.current) return;
    videoRef.current.volume = val;
    setIsMuted(val === 0);
  }

  function toggleMute() {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.5;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }

  function formatTime(seconds: number) {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  function handleMouseMove() {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group select-none shadow-2xl border border-[#271f43]"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        autoPlay={autoPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        onClick={handlePlayPause}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Loading Overlay */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-[#9d7bf5] animate-spin" />
            <span className="text-xs font-mono text-white/80">Buffering 4K stream...</span>
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-[#0d091a] flex flex-col items-center justify-center p-6 text-center z-20">
          <AlertCircle className="w-12 h-12 text-rose-400 mb-3" />
          <h3 className="text-base font-bold text-white">Playback Error</h3>
          <p className="text-xs text-[#9b92b6] mt-1 max-w-md">
            The requested video could not be played directly in this browser or format.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#9d7bf5] text-[#0b0914] text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry Playback
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#1d1633] border border-[#3b2d66] text-[#c4b5fd] text-xs font-semibold hover:text-white"
            >
              Open Direct Stream
            </a>
          </div>
        </div>
      )}

      {/* Center Big Play Button (when paused and not loading) */}
      {!isPlaying && !isLoading && !hasError && (
        <button
          type="button"
          onClick={handlePlayPause}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#9d7bf5]/90 hover:bg-[#b094fa] text-[#0b0914] flex items-center justify-center shadow-2xl transition-transform hover:scale-110 z-10"
          aria-label="Play video"
        >
          <Play className="w-7 h-7 fill-current translate-x-0.5" />
        </button>
      )}

      {/* Video Controls Bar */}
      {!hasError && (
        <div
          className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 z-30 transition-opacity duration-300 ${
            showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Progress Seek Bar */}
          <div className="relative mb-3 flex items-center">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 hover:bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#9d7bf5] transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Left Controls: Play/Pause, Mute/Volume, Time */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePlayPause}
                className="p-1.5 rounded-lg text-white hover:text-[#9d7bf5] transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current" />
                )}
              </button>

              <div className="flex items-center gap-1.5 group/vol">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-white hover:text-[#9d7bf5] transition-colors"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#9d7bf5]"
                />
              </div>

              <div className="text-[11px] font-mono text-[#c4b5fd]">
                <span>{formatTime(currentTime)}</span>
                <span className="text-[#7e749e] mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Title tag + Fullscreen */}
            <div className="flex items-center gap-3">
              {title && (
                <span className="text-xs font-medium text-[#c4b5fd]/80 truncate max-w-[200px] hidden sm:inline">
                  {title}
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#9d7bf5] bg-[#9d7bf5]/10 border border-[#9d7bf5]/30">
                PRORES 4K
              </span>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg text-white hover:text-[#9d7bf5] transition-colors"
                aria-label="Toggle Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
