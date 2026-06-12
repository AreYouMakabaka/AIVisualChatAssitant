import { forwardRef } from "react";
import { Camera, CameraOff } from "lucide-react";

interface VideoPreviewProps {
  isCameraOn: boolean;
  isRecording: boolean;
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  ({ isCameraOn, isRecording }, ref) => {
    return (
      <div className="relative w-full h-full bg-black/50 rounded-2xl overflow-hidden corner-decoration">
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-secondary)]">
            <CameraOff size={48} className="mb-3 opacity-50" />
            <p className="text-sm">摄像头未开启</p>
          </div>
        )}

        {isCameraOn && isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-recording" />
            <span className="text-xs text-red-400 font-medium">录制中</span>
          </div>
        )}

        {isCameraOn && (
          <div className="absolute bottom-4 right-4 px-2 py-1 rounded bg-black/50 text-[10px] text-[var(--text-secondary)]">
            LIVE
          </div>
        )}
      </div>
    );
  }
);

VideoPreview.displayName = "VideoPreview";
