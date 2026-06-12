import { create } from "zustand";
import type { Message, AppConfig, AppStatus } from "@/types";
import { DEFAULT_CONFIG, MODEL_OPTIONS } from "@/types";

interface AppState {
  config: AppConfig;
  messages: Message[];
  status: AppStatus;
  isSettingsOpen: boolean;
  isCameraOn: boolean;
  isMicOn: boolean;
  isConversationActive: boolean;
  currentImage: string | null;
  totalTokens: number;
  errorMessage: string | null;

  // Actions
  setConfig: (config: Partial<AppConfig>) => void;
  addMessage: (message: Message) => void;
  setStatus: (status: AppStatus) => void;
  setSettingsOpen: (open: boolean) => void;
  setCameraOn: (on: boolean) => void;
  setMicOn: (on: boolean) => void;
  setConversationActive: (active: boolean) => void;
  setCurrentImage: (image: string | null) => void;
  addTokens: (tokens: number) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  resetState: () => void;
}

const loadConfig = (): AppConfig => {
  try {
    const saved = localStorage.getItem("ai-visual-config");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old config to latest SiliconFlow models
      if (parsed.apiBase === "https://api.openai.com") {
        parsed.apiBase = DEFAULT_CONFIG.apiBase;
      }
      const validModels = MODEL_OPTIONS.map((m) => m.value);
      if (parsed.model && !validModels.includes(parsed.model)) {
        parsed.model = DEFAULT_CONFIG.model;
      }
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_CONFIG;
};

const initialState = {
  config: loadConfig(),
  messages: [],
  status: "idle" as AppStatus,
  isSettingsOpen: false,
  isCameraOn: false,
  isMicOn: false,
  isConversationActive: false,
  currentImage: null,
  totalTokens: 0,
  errorMessage: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setConfig: (config) =>
    set((state) => {
      const newConfig = { ...state.config, ...config };
      localStorage.setItem("ai-visual-config", JSON.stringify(newConfig));
      return { config: newConfig };
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setStatus: (status) => set({ status }),

  setSettingsOpen: (open) => set({ isSettingsOpen: open }),

  setCameraOn: (on) => set({ isCameraOn: on }),

  setMicOn: (on) => set({ isMicOn: on }),

  setConversationActive: (active) =>
    set({ isConversationActive: active, status: active ? "connecting" : "idle" }),

  setCurrentImage: (image) => set({ currentImage: image }),

  addTokens: (tokens) =>
    set((state) => ({ totalTokens: state.totalTokens + tokens })),

  setError: (error) => set({ errorMessage: error, status: error ? "error" : "idle" }),

  clearMessages: () => set({ messages: [], totalTokens: 0 }),

  resetState: () => set({ ...initialState, config: loadConfig() }),
}));
