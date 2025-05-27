// app/(dashboard)/(routes)/music/page.tsx
"use client";

import { z } from "zod";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Music,
  Wand2,
  Sparkles,
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  RefreshCw,
  Sliders,
  Radio,
  Disc3,
  ChevronDown,
  Info,
  Music2,  // Alternative to Piano
  Music3,  // Alternative to Guitar
  Music4,  // Alternative to Drum
  Mic,
  Clock,
  Waves,
  Share2,
  Heart,
  SkipBack,
  SkipForward,
  Repeat
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

import { formSchema } from "./constants";

const MusicPage = () => {
  const proModal = useProModal();
  const router = useRouter();
  const [music, setMusic] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Quick prompts for instant inspiration
  const quickPrompts = [
    { label: "Relaxing Piano", icon: Music2, prompt: "Peaceful piano melody for meditation" },
    { label: "Epic Orchestra", icon: Disc3, prompt: "Epic orchestral soundtrack with dramatic strings" },
    { label: "Electronic Beat", icon: Radio, prompt: "Modern electronic dance music with heavy bass" },
    { label: "Acoustic Guitar", icon: Music3, prompt: "Warm acoustic guitar folk melody" },
    { label: "Jazz Ensemble", icon: Music4, prompt: "Smooth jazz with saxophone and piano" },
    { label: "Ambient Soundscape", icon: Waves, prompt: "Atmospheric ambient music for focus" }
  ];

  // Audio control functions
  useEffect(() => {
    if (audioRef.current && mounted) {
      audioRef.current.volume = volume;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isLooping, mounted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Audio play failed:', error);
          toast.error('Failed to play audio');
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      audioRef.current.currentTime = percentage * duration;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);
      setIsPlaying(false);

      const response = await axios.post("/api/music", values);

      setMusic(response.data.audio);
      form.reset();
      toast.success("Music generated successfully!");
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error("Failed to generate music. Please try again.");
      }
    } finally {
      router.refresh();
    }
  };

  const downloadMusic = () => {
    if (music && typeof window !== 'undefined') {
      const link = document.createElement('a');
      link.href = music;
      link.download = `generated-music-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Music downloaded successfully!");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-cyan-600/20 blur-3xl" />

        <div className="relative px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4 mb-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-cyan-600 p-4 rounded-2xl">
                <Music className="w-10 h-10 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                Music Generation
              </h1>
              <p className="text-gray-400 mt-1">Create unique melodies with AI</p>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="mb-8 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.1s_forwards]">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Quick Start</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={prompt.label}
                  onClick={() => form.setValue('prompt', prompt.prompt)}
                  className="flex items-center gap-3 p-3 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800 hover:border-emerald-500/50 transition-all group opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
                  style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
                >
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 group-hover:bg-emerald-500/20">
                    <prompt.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-300">{prompt.label}</p>
                    <p className="text-xs text-gray-500 truncate">{prompt.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Prompt Input */}
                  <FormField
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-12 pr-4 py-6 text-lg rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              disabled={isLoading}
                              placeholder="Describe the music you want to create..."
                              {...field}
                            />
                            <Wand2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Advanced Settings */}
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                    Advanced Settings
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} />
                  </button>

                  {showAdvanced && (
                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4 transition-all duration-300">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Info className="w-4 h-4" />
                        <p className="text-sm">Advanced settings coming soon...</p>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-white py-6 text-lg"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Composing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generate Music
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            </form>
          </Form>
        </div>
      </div>

      {/* Results Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-500/20 rounded-full animate-spin border-t-emerald-500" />
              <Music className="w-10 h-10 text-emerald-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-4 text-gray-400">Composing your melody...</p>
          </div>
        )}

        {/* Empty State */}
        {!music && !isLoading && (
          <div className="text-center py-20 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
            <div className="w-20 h-20 mx-auto bg-gray-900/50 rounded-full flex items-center justify-center mb-4">
              <Music className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No music yet</h3>
            <p className="text-gray-500 mb-8">Enter a prompt above to generate your first track</p>
          </div>
        )}

        {/* Music Player */}
        {music && (
          <div className="max-w-3xl mx-auto opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 p-6 sm:p-8">
              <audio
                ref={audioRef}
                src={music}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* Visualizer */}
              <div className="mb-8 h-32 bg-gray-800/50 rounded-xl p-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 mx-0.5 bg-emerald-500 rounded-full transition-all duration-300"
                      style={{
                        height: `${Math.random() * 100}%`,
                        opacity: isPlaying ? 0.8 : 0.3,
                        transform: isPlaying ? 'scaleY(1)' : 'scaleY(0.3)'
                      }}
                    />
                  ))}
                </div>
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 rounded-full p-4">
                      <Music className="w-12 h-12 text-emerald-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">AI Generated Track</h3>
                <p className="text-gray-400">Based on: &quot;{form.getValues('prompt') || 'Custom prompt'}&quot;</p>
              </div>

              {/* Progress Bar */}
              <div
                className="mb-4 bg-gray-800 rounded-full h-2 cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full relative"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Time Display */}
              <div className="flex justify-between text-sm text-gray-400 mb-6">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => audioRef.current && (audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10))}
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="p-4 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full hover:from-emerald-600 hover:to-cyan-700 transition-all shadow-lg"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>

                <button
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => audioRef.current && (audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10))}
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume and Options */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="w-32 h-2 bg-gray-800 rounded-full cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = x / rect.width;
                    const newVolume = Math.max(0, Math.min(1, percentage));
                    setVolume(newVolume);
                    if (audioRef.current) {
                      audioRef.current.volume = newVolume;
                      setIsMuted(false);
                      audioRef.current.muted = false;
                    }
                  }}>
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsLooping(!isLooping)}
                    className={`text-gray-400 hover:text-white transition-colors ${isLooping ? 'text-emerald-500' : ''}`}
                  >
                    <Repeat className="w-5 h-5" />
                  </button>
                  <button
                    onClick={downloadMusic}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  onClick={downloadMusic}
                  variant="secondary"
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Save to Library
                </Button>
                <Button
                  variant="secondary"
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Share2 className="w-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
      `}</style>
    </div>
  );
};

export default MusicPage;
