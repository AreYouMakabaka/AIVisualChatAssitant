import { X, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import type { AppConfig } from "@/types";
import { MODEL_OPTIONS, VOICE_OPTIONS } from "@/types";

interface SettingsPanelProps {
  config: AppConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AppConfig) => void;
}

export function SettingsPanel({ config, isOpen, onClose, onSave }: SettingsPanelProps) {
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  const handleChange = (key: keyof AppConfig, value: string | number | boolean) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localConfig);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-[var(--bg-secondary)] border-l border-[var(--border-color)] overflow-y-auto animate-slide-in">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--bg-secondary)]/95 backdrop-blur border-b border-[var(--border-color)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">设置</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* API 配置 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--accent-cyan)] uppercase tracking-wider">
              API 配置
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">API Key</label>
                <input
                  type="password"
                  value={localConfig.apiKey}
                  onChange={(e) => handleChange("apiKey", e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-cyan)]/50 focus:ring-1 focus:ring-[var(--accent-cyan)]/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">API 地址</label>
                <input
                  type="text"
                  value={localConfig.apiBase}
                  onChange={(e) => handleChange("apiBase", e.target.value)}
                  placeholder="https://api.siliconflow.cn"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent-cyan)]/50 focus:ring-1 focus:ring-[var(--accent-cyan)]/20 transition-all"
                />
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                  默认使用硅基流动 API: https://api.siliconflow.cn
                </p>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">模型</label>
                <select
                  value={localConfig.model}
                  onChange={(e) => handleChange("model", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-cyan)]/50 focus:ring-1 focus:ring-[var(--accent-cyan)]/20 transition-all appearance-none cursor-pointer"
                >
                  {MODEL_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 语音设置 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--accent-purple)] uppercase tracking-wider">
              语音设置
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">语音音色</label>
                <select
                  value={localConfig.voice}
                  onChange={(e) => handleChange("voice", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-purple)]/50 focus:ring-1 focus:ring-[var(--accent-purple)]/20 transition-all appearance-none cursor-pointer"
                >
                  {VOICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  语速: {localConfig.voiceRate.toFixed(1)}x
                </label>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={localConfig.voiceRate}
                  onChange={(e) => handleChange("voiceRate", parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-purple)]"
                />
              </div>
            </div>
          </section>

          {/* 成本控制 */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--accent-pink)] uppercase tracking-wider">
              成本控制
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  截图间隔: {localConfig.captureInterval} 秒
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={localConfig.captureInterval}
                  onChange={(e) => handleChange("captureInterval", parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-pink)]"
                />
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                  间隔越长，API 调用次数越少，成本越低
                </p>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  图片尺寸: {localConfig.maxImageSize}px
                </label>
                <input
                  type="range"
                  min={256}
                  max={1024}
                  step={128}
                  value={localConfig.maxImageSize}
                  onChange={(e) => handleChange("maxImageSize", parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-pink)]"
                />
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">
                  尺寸越小，Token 消耗越少
                </p>
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  图片质量: {Math.round(localConfig.imageQuality * 100)}%
                </label>
                <input
                  type="range"
                  min={0.3}
                  max={1.0}
                  step={0.1}
                  value={localConfig.imageQuality}
                  onChange={(e) => handleChange("imageQuality", parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-pink)]"
                />
              </div>

              <div>
                <label className="block text-xs text-[var(--text-secondary)] mb-1.5">
                  最大上下文轮数: {localConfig.maxContextRounds}
                </label>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={localConfig.maxContextRounds}
                  onChange={(e) => handleChange("maxContextRounds", parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full appearance-none cursor-pointer accent-[var(--accent-pink)]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="vad"
                  checked={localConfig.enableVAD}
                  onChange={(e) => handleChange("enableVAD", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--accent-pink)] focus:ring-[var(--accent-pink)]/20"
                />
                <label htmlFor="vad" className="text-sm text-[var(--text-primary)] cursor-pointer">
                  启用语音活动检测 (VAD)
                </label>
              </div>
            </div>
          </section>

          {/* 成本提示 */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3">
            <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-400/80 leading-relaxed">
              <p className="font-medium text-yellow-400 mb-1">成本提示</p>
              <p>
                硅基流动 API 按 Token 计费。以 Qwen2-VL-72B 为例，输入约 ¥0.0035/1K tokens，输出约 ¥0.007/1K tokens。每张 512x512 图片约消耗 255 Token。建议合理设置截图间隔和图片尺寸以控制成本。
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 p-6 bg-[var(--bg-secondary)]/95 backdrop-blur border-t border-[var(--border-color)]">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-xl bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] border border-[var(--accent-cyan)]/30 font-medium text-sm btn-glow transition-all"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
}
