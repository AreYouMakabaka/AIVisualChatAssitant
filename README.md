# AI 视觉对话助手

一个基于 React + TypeScript + Vite 构建的 AI 视觉对话应用，支持摄像头画面实时理解、语音双向交互，接入硅基流动（SiliconFlow）API。

## 功能特性

- **视觉理解**：通过摄像头实时捕捉画面，AI 能够理解视频内容并做出回应
- **语音双向交互**：用户通过语音与 AI 对话，AI 以语音方式回复
- **多模型支持**：支持硅基流动平台的多款模型，包括 Qwen3-VL、DeepSeek-V3、GLM 等
- **成本控制**：可配置截图间隔、图片尺寸、质量、上下文轮数等参数
- **回声消除**：AI 播放语音时自动屏蔽麦克风输入，防止自我对话循环

## 技术栈

- React 18 + TypeScript + Vite 6
- Tailwind CSS 3
- Zustand v5（状态管理）
- 浏览器原生 Web Speech API（语音识别与合成）
- 硅基流动 API（多模态大模型）

## 快速开始

### 环境要求

- Node.js >= 18
- 现代浏览器（支持 Web Speech API 和 getUserMedia）
- 麦克风与摄像头权限

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 类型检查

```bash
npm run check
```

## 使用说明

1. 首次打开应用后，点击右上角 **设置** 按钮
2. 在设置面板中填入你的 **硅基流动 API Key**
3. 选择想要使用的 **模型**（推荐 Qwen3-VL 系列，支持视觉理解）
4. 开启 **摄像头** 和 **麦克风**
5. 点击 **开始对话**，即可与 AI 进行语音+视觉交互

### 成本控制设置

- **截图间隔**：控制摄像头画面发送给 AI 的频率，间隔越长 API 调用越少
- **图片尺寸**：越小 Token 消耗越少
- **图片质量**：越低 Token 消耗越少
- **最大上下文轮数**：限制对话历史长度

## 支持的模型

| 系列 | 代表模型 | 视觉支持 |
|------|---------|---------|
| Qwen3-VL | Qwen/Qwen3-VL-32B-Instruct | 是 |
| Qwen3-Omni | Qwen/Qwen3-Omni-30B-A3B-Instruct | 是 |
| DeepSeek | deepseek-ai/DeepSeek-V3.2 | 否 |
| Qwen3.5 | Qwen/Qwen3.5-35B-A3B | 否 |
| GLM | zai-org/GLM-4.5V | 是 |
| 其他 | Hunyuan、Ling、Seed 等 | 部分 |

## 项目结构

```
src/
  components/      # UI 组件
    ChatPanel.tsx       # 对话消息面板
    ControlBar.tsx      # 底部控制栏（摄像头/麦克风/对话开关）
    SettingsPanel.tsx   # 右侧设置抽屉
    StatusBar.tsx       # 顶部状态栏
    VideoPreview.tsx    # 摄像头预览
  hooks/
    useAI.ts            # AI API 请求（硅基流动）
    useCamera.ts        # 摄像头管理
    useSpeech.ts        # 语音识别与合成
  pages/
    Home.tsx            # 主页面，整合所有逻辑
  store/
    appStore.ts         # Zustand 全局状态
  types/
    index.ts            # TypeScript 类型定义与配置常量
  App.tsx              # 路由入口
  main.tsx             # 应用挂载
  index.css            # 全局样式（深色科技风主题）
```

## 注意事项

- 应用使用浏览器原生 Web Speech API，语音识别质量取决于浏览器实现（Chrome 效果最佳）
- 摄像头画面通过 Canvas 截图压缩后转为 base64 发送给 API
- API Key 保存在浏览器 LocalStorage 中，仅在本地使用
- 建议在安静环境下使用，以获得更好的语音识别效果

## 许可证

MIT
