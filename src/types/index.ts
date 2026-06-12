export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  imageUrl?: string;
  timestamp: number;
  tokens?: number;
}

export interface AppConfig {
  apiKey: string;
  apiBase: string;
  model: string;
  voice: string;
  voiceRate: number;
  captureInterval: number;
  maxImageSize: number;
  maxContextRounds: number;
  enableVAD: boolean;
  imageQuality: number;
}

export type AppStatus = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "error";

export const DEFAULT_CONFIG: AppConfig = {
  apiKey: "",
  apiBase: "https://api.siliconflow.cn",
  model: "Qwen/Qwen3-VL-32B-Instruct",
  voice: "zh-CN-XiaoxiaoNeural",
  voiceRate: 1.0,
  captureInterval: 3,
  maxImageSize: 512,
  maxContextRounds: 10,
  enableVAD: true,
  imageQuality: 0.8,
};

export const MODEL_OPTIONS = [
  // Qwen3-VL 系列（推荐，支持视觉）
  { value: "Qwen/Qwen3-VL-32B-Instruct", label: "Qwen3-VL-32B-Instruct (硅基流动)" },
  { value: "Qwen/Qwen3-VL-32B-Thinking", label: "Qwen3-VL-32B-Thinking (硅基流动)" },
  { value: "Qwen/Qwen3-VL-8B-Instruct", label: "Qwen3-VL-8B-Instruct (硅基流动)" },
  { value: "Qwen/Qwen3-VL-8B-Thinking", label: "Qwen3-VL-8B-Thinking (硅基流动)" },
  { value: "Qwen/Qwen3-VL-30B-A3B-Instruct", label: "Qwen3-VL-30B-A3B-Instruct (硅基流动)" },
  { value: "Qwen/Qwen3-VL-30B-A3B-Thinking", label: "Qwen3-VL-30B-A3B-Thinking (硅基流动)" },
  // Qwen3-Omni 系列（多模态）
  { value: "Qwen/Qwen3-Omni-30B-A3B-Instruct", label: "Qwen3-Omni-30B-A3B-Instruct (硅基流动)" },
  { value: "Qwen/Qwen3-Omni-30B-A3B-Thinking", label: "Qwen3-Omni-30B-A3B-Thinking (硅基流动)" },
  { value: "Qwen/Qwen3-Omni-30B-A3B-Captioner", label: "Qwen3-Omni-30B-A3B-Captioner (硅基流动)" },
  // DeepSeek 系列
  { value: "deepseek-ai/DeepSeek-V3.2", label: "DeepSeek-V3.2 (硅基流动)" },
  { value: "deepseek-ai/DeepSeek-V3.1-Terminus", label: "DeepSeek-V3.1-Terminus (硅基流动)" },
  { value: "deepseek-ai/DeepSeek-V3", label: "DeepSeek-V3 (硅基流动)" },
  { value: "deepseek-ai/DeepSeek-R1", label: "DeepSeek-R1 (硅基流动)" },
  // Qwen3.5 系列
  { value: "Qwen/Qwen3.5-35B-A3B", label: "Qwen3.5-35B-A3B (硅基流动)" },
  { value: "Qwen/Qwen3.5-27B", label: "Qwen3.5-27B (硅基流动)" },
  { value: "Qwen/Qwen3.5-9B", label: "Qwen3.5-9B (硅基流动)" },
  // Qwen3 系列
  { value: "Qwen/Qwen3-32B", label: "Qwen3-32B (硅基流动)" },
  { value: "Qwen/Qwen3-14B", label: "Qwen3-14B (硅基流动)" },
  { value: "Qwen/Qwen3-Coder-30B-A3B-Instruct", label: "Qwen3-Coder-30B-A3B-Instruct (硅基流动)" },
  { value: "Qwen/Qwen3-30B-A3B-Instruct-2507", label: "Qwen3-30B-A3B-Instruct-2507 (硅基流动)" },
  // GLM 系列
  { value: "zai-org/GLM-4.5V", label: "GLM-4.5V (硅基流动)" },
  { value: "zai-org/GLM-4.5-Air", label: "GLM-4.5-Air (硅基流动)" },
  { value: "THUDM/GLM-4-32B-0414", label: "GLM-4-32B-0414 (硅基流动)" },
  // 其他
  { value: "tencent/Hunyuan-A13B-Instruct", label: "Hunyuan-A13B-Instruct (硅基流动)" },
  { value: "inclusionAI/Ling-flash-2.0", label: "Ling-flash-2.0 (硅基流动)" },
  { value: "inclusionAI/Ling-mini-2.0", label: "Ling-mini-2.0 (硅基流动)" },
  { value: "ByteDance-Seed/Seed-OSS-36B-Instruct", label: "Seed-OSS-36B-Instruct (硅基流动)" },
];

export const VOICE_OPTIONS = [
  { value: "zh-CN-XiaoxiaoNeural", label: "晓晓 (女声)" },
  { value: "zh-CN-YunxiNeural", label: "云希 (男声)" },
  { value: "zh-CN-XiaoyiNeural", label: "晓伊 (女声)" },
  { value: "zh-CN-YunjianNeural", label: "云健 (男声)" },
];
