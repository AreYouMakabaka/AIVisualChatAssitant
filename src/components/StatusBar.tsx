import { Zap, Coins } from "lucide-react";

interface StatusBarProps {
  isConversationActive: boolean;
  totalTokens: number;
  status: string;
}

export function StatusBar({ isConversationActive, totalTokens, status }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-4">
        <h1
          className="text-xl font-bold tracking-wide"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          <span className="text-[var(--accent-cyan)] neon-text">AI</span>
          <span className="text-[var(--text-primary)] mx-1">·</span>
          <span className="text-[var(--accent-purple)] neon-text-purple">VISION</span>
        </h1>

        {isConversationActive && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-cyan)]/10 border border-[var(--accent-cyan)]/20">
            <Zap size={12} className="text-[var(--accent-cyan)]" />
            <span className="text-xs text-[var(--accent-cyan)] font-medium">对话中</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)]">
        <Coins size={14} className="text-[var(--accent-pink)]" />
        <span className="text-xs text-[var(--text-secondary)]">
          {totalTokens.toLocaleString()} tokens
        </span>
      </div>
    </div>
  );
}
