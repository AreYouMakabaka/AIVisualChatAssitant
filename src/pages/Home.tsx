import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore } from "@/store/appStore";
import { useCamera } from "@/hooks/useCamera";
import { useSpeech } from "@/hooks/useSpeech";
import { useAI } from "@/hooks/useAI";
import { VideoPreview } from "@/components/VideoPreview";
import { ChatPanel } from "@/components/ChatPanel";
import { ControlBar } from "@/components/ControlBar";
import { SettingsPanel } from "@/components/SettingsPanel";
import { StatusBar } from "@/components/StatusBar";
import type { Message } from "@/types";

export default function Home() {
  const {
    config,
    messages,
    status,
    isSettingsOpen,
    isCameraOn,
    isMicOn,
    isConversationActive,
    currentImage,
    totalTokens,
    errorMessage,
    setConfig,
    addMessage,
    setStatus,
    setSettingsOpen,
    setCameraOn,
    setMicOn,
    setConversationActive,
    setCurrentImage,
    addTokens,
    setError,
    clearMessages,
  } = useAppStore();

  const { videoRef, startCamera, stopCamera, captureFrame } = useCamera();
  const { startListening, stopListening, speak, stopSpeaking, isSpeaking: isAIPeaking } = useSpeech();
  const { sendMessage, cancelRequest, isAbortError } = useAI();

  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isProcessingRef = useRef(false);
  const lastUserSpeechTimeRef = useRef(0);
  const listeningRef = useRef(false);
  const onResultRef = useRef<(text: string, isFinal: boolean) => void>();
  const [interimText, setInterimText] = useState("");

  // Capture frame periodically
  const startCapture = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    captureIntervalRef.current = setInterval(() => {
      if (isCameraOn) {
        const frame = captureFrame(config.maxImageSize, config.imageQuality);
        if (frame) {
          setCurrentImage(frame);
        }
      }
    }, config.captureInterval * 1000);
  }, [isCameraOn, config.maxImageSize, config.imageQuality, config.captureInterval, captureFrame, setCurrentImage]);

  const stopCapture = useCallback(() => {
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  }, []);

  // Handle AI conversation
  const handleUserSpeech = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      if (!config.apiKey) {
        setError("请先配置 API Key");
        return;
      }

      isProcessingRef.current = true;
      setStatus("thinking");
      lastUserSpeechTimeRef.current = Date.now();

      // Add user message
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text,
        imageUrl: currentImage || undefined,
        timestamp: Date.now(),
      };
      addMessage(userMsg);

      try {
        const response = await sendMessage([...messages, userMsg], currentImage, config);

        // Add AI message
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.content,
          timestamp: Date.now(),
          tokens: response.tokens,
        };
        addMessage(aiMsg);
        addTokens(response.tokens);

        // Speak the response with onEnd callback
        setStatus("speaking");
        speak(response.content, config.voice, config.voiceRate, () => {
          if (isConversationActive) {
            setStatus("listening");
          } else {
            setStatus("idle");
          }
          isProcessingRef.current = false;
        });
      } catch (err) {
        if (isAbortError(err)) {
          console.log("[Abort] Request was cancelled");
          isProcessingRef.current = false;
          return;
        }
        const errorMsg = err instanceof Error ? err.message : "请求失败";
        setError(errorMsg);
        isProcessingRef.current = false;
        if (isConversationActive) {
          setStatus("listening");
        }
      }
    },
    [config, messages, currentImage, isConversationActive, addMessage, addTokens, setStatus, setError, sendMessage, speak, isAbortError]
  );

  // Keep the speech result callback ref up to date (no deps needed)
  useEffect(() => {
    onResultRef.current = (text: string, isFinal: boolean) => {
      // Skip if AI is processing/speaking to prevent echo feedback loop
      if (isProcessingRef.current) return;
      if (isFinal) {
        setInterimText("");
        handleUserSpeech(text);
      } else {
        setInterimText(text);
      }
    };
  });

  // Manage speech recognition listening state
  // Only depends on mic/conversation/AI state - NOT on status or handleUserSpeech
  useEffect(() => {
    const shouldListen = isMicOn && isConversationActive && !isAIPeaking;

    if (shouldListen && !listeningRef.current) {
      listeningRef.current = true;
      startListening((text, isFinal) => onResultRef.current?.(text, isFinal));
    } else if (!shouldListen && listeningRef.current) {
      listeningRef.current = false;
      stopListening();
      setInterimText("");
    }
  }, [isMicOn, isConversationActive, isAIPeaking, startListening, stopListening]);

  // Toggle camera
  const handleToggleCamera = useCallback(async () => {
    if (isCameraOn) {
      stopCamera();
      stopCapture();
      setCameraOn(false);
    } else {
      const success = await startCamera();
      if (success) {
        setCameraOn(true);
        if (isConversationActive) {
          startCapture();
        }
      } else {
        setError("无法访问摄像头，请检查权限设置");
      }
    }
  }, [isCameraOn, isConversationActive, startCamera, stopCamera, startCapture, stopCapture, setCameraOn, setError]);

  // Toggle mic
  const handleToggleMic = useCallback(() => {
    if (isMicOn) {
      stopListening();
      setMicOn(false);
    } else {
      setMicOn(true);
    }
  }, [isMicOn, stopListening, setMicOn]);

  // Toggle conversation
  const handleToggleConversation = useCallback(() => {
    if (isConversationActive) {
      setConversationActive(false);
      stopListening();
      stopSpeaking();
      stopCapture();
      cancelRequest();
      isProcessingRef.current = false;
      listeningRef.current = false;
    } else {
      if (!config.apiKey) {
        setError("请先配置 API Key");
        setSettingsOpen(true);
        return;
      }
      setConversationActive(true);
      if (isCameraOn) {
        startCapture();
      }
      // Status is already set to "listening" when mic is on by the store's setConversationActive
      // But we explicitly set it here for clarity
      if (isMicOn) {
        setStatus("listening");
      }
    }
  }, [isConversationActive, isCameraOn, isMicOn, config.apiKey, setConversationActive, stopListening, stopSpeaking, stopCapture, cancelRequest, startCapture, setError, setSettingsOpen, setStatus]);

  // Update store status to match listening state (derived state, no re-render loop)
  useEffect(() => {
    if (isConversationActive && listeningRef.current && status !== "listening" && status !== "thinking" && status !== "speaking") {
      setStatus("listening");
    }
  }, [isConversationActive, status, setStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCapture();
      stopListening();
      stopSpeaking();
      cancelRequest();
    };
  }, [stopCapture, stopListening, stopSpeaking, cancelRequest]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      {/* Status Bar */}
      <StatusBar
        isConversationActive={isConversationActive}
        totalTokens={totalTokens}
        status={status}
      />

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 pt-0 min-h-0">
        {/* Video Area */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 min-h-0">
            <VideoPreview
              ref={videoRef}
              isCameraOn={isCameraOn}
              isRecording={isConversationActive}
            />
          </div>

          {/* Interim text display */}
          {interimText && (
            <div className="px-4 py-2 rounded-xl bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20 text-sm text-[var(--accent-cyan)] animate-slide-in">
              {interimText}
            </div>
          )}

          {/* Error message */}
          {errorMessage && (
            <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-slide-in">
              {errorMessage}
            </div>
          )}

          {/* Control Bar */}
          <ControlBar
            isCameraOn={isCameraOn}
            isMicOn={isMicOn}
            isConversationActive={isConversationActive}
            status={status}
            onToggleCamera={handleToggleCamera}
            onToggleMic={handleToggleMic}
            onToggleConversation={handleToggleConversation}
            onOpenSettings={() => setSettingsOpen(true)}
            onClearChat={clearMessages}
          />
        </div>

        {/* Chat Area */}
        <div className="w-[380px] flex-shrink-0 glass rounded-2xl overflow-hidden hidden lg:flex flex-col">
          <ChatPanel messages={messages} status={status} />
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={setConfig}
      />
    </div>
  );
}