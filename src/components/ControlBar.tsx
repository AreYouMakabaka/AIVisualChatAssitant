import { Camera, CameraOff, Mic, MicOff, Play, Square, Settings, Trash2 } from "lucide-react";

interface ControlBarProps {
  isCameraOn: boolean;
  isMicOn: boolean;
  isConversationActive: boolean;
  status: string;
  onToggleCamera: () => void;
  onToggleMic: () => void;
  onToggleConversation: () => void;
  onOpenSettings: () => void;
  onClearChat: () => void;
}

export function ControlBar({
  isCameraOn,
  isMicOn,
  isConversationActive,
  status,
  onToggleCamera,
  onToggleMic,
  onToggleConversation,
  onOpenSettings,
  onClearChat,
}: ControlBarProps) {
  const getStatusLabel = () => {
    switch (status) {
      case "idle":
        return "就绪";
      case "connecting":
        return "连接中...";
      case "listening":
        return "聆听中";
      case "thinking":
        return "思考中...";
      case "speaking":
        return "播放中";
      case "error":
        return "错误";
      default:
        return "就绪";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "listening":
        return "bg-[var(--accent-cyan)]";
      case "thinking":
        return "bg-[var(--accent-purple)]";
      case "speaking":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-[var(--text-secondary)]";
    }
  };

  return (
    <div className="glass rounded-2xl p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()} animate-pulse`} />
        <span className="text-xs text-[var(--text-secondary)] font-medium">{getStatusLabel()}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleCamera}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isCameraOn
              ? "bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 btn-glow"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]"
          }`}
          title={isCameraOn ? "关闭摄像头" : "开启摄像头"}
        >
          {isCameraOn ? <Camera size={18} /> : <CameraOff size={18} />}
        </button>

        <button
          onClick={onToggleMic}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isMicOn
              ? "bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 btn-glow"
              : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)]"
          }`}
          title={isMicOn ? "关闭麦克风" : "开启麦克风"}
        >
          {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>

        <div className="w-px h-6 bg-[var(--border-color)] mx-1" />

        <button
          onClick={onToggleConversation}
          disabled={!isCameraOn && !isMicOn}
          className={`h-10 px-5 rounded-xl flex items-center gap-2 font-medium text-sm transition-all duration-200 ${
            isConversationActive
              ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
              : "bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30 btn-glow-purple"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isConversationActive ? <Square size={16} /> : <Play size={16} />}
          {isConversationActive ? "停止" : "开始对话"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onClearChat}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-red-400 transition-colors"
          title="清空对话"
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-primary)] transition-colors"
          title="设置"
        >
          <Settings size={16} />
        </button>
      </div>
    </div>
  );
}
