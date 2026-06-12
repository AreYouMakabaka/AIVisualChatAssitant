import { useRef, useEffect } from "react";
import { User, Bot, Image as ImageIcon } from "lucide-react";
import type { Message } from "@/types";

interface ChatPanelProps {
  messages: Message[];
  status: string;
}

export function ChatPanel({ messages, status }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
        <h2 className="text-sm font-medium text-[var(--text-secondary)]">对话记录</h2>
        <span className="text-xs text-[var(--text-secondary)]">{messages.length} 条消息</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] opacity-50">
            <Bot size={40} className="mb-2" />
            <p className="text-sm">开始对话后，消息将显示在这里</p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 animate-slide-in ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === "user"
                  ? "bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)]"
                  : "bg-[var(--accent-purple)]/20 text-[var(--accent-purple)]"
              }`}
            >
              {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
            </div>

            <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[var(--accent-cyan)]/10 text-[var(--text-primary)] rounded-tr-sm border border-[var(--accent-cyan)]/20"
                    : "bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-tl-sm border border-[var(--border-color)]"
                }`}
              >
                {msg.imageUrl && (
                  <div className="mb-2 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <ImageIcon size={12} />
                    <span>附带画面截图</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[10px] text-[var(--text-secondary)] mt-1 px-1">
                {formatTime(msg.timestamp)}
                {msg.tokens && ` · ${msg.tokens} tokens`}
              </span>
            </div>
          </div>
        ))}

        {status === "thinking" && (
          <div className="flex gap-3 animate-slide-in">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[var(--bg-secondary)] border border-[var(--border-color)]">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full bg-[var(--accent-purple)]"
                  style={{ animation: "thinking-dots 1s ease-in-out infinite" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[var(--accent-purple)]"
                  style={{ animation: "thinking-dots 1s ease-in-out 0.2s infinite" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-[var(--accent-purple)]"
                  style={{ animation: "thinking-dots 1s ease-in-out 0.4s infinite" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
