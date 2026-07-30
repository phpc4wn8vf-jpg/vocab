# Vocab - 雅思单词本 (Netlify 版)

## 功能
- 4 种输入方式：单个、批量、AI 识图、JSON 导入
- 拼写复习 + 听力复习 + 错词本
- AI 图片识别提取单词（Kimi 视觉大模型）
- 真人发音（Web Speech API）
- 跨设备同步（Netlify Blobs 存储）

## 部署步骤

### 1. 准备 GitHub 仓库
将以下文件结构推送到 GitHub 仓库：
```
vocab/
├── index.html
├── netlify.toml
├── netlify/functions/words.js
├── netlify/functions/ai.js
└── package.json
```

### 2. Netlify 部署
1. 打开 https://netlify.com → 用 GitHub 登录
2. Add new site → Import an existing project
3. 选择 GitHub 仓库
4. Build command: `npm install`
5. Publish directory: `.`
6. Functions directory: `netlify/functions`
7. Advanced → Environment variables 添加：`MOONSHOT_API_KEY` = 你的 Kimi Key
8. Deploy

### 3. 验证
打开 `https://xxx.netlify.app`：
- 点「＋ 单个」→ 输入单词回车 → 自动查词
- 📷 AI 识图 → 上传图片 → 返回单词
- 刷新页面 → 单词还在（云端同步）

## 环境变量
| Key | Value |
|---|---|
| `MOONSHOT_API_KEY` | platform.moonshot.cn 申请的 API Key |

## 免费额度
- 100GB 带宽/月
- 125,000 次 Functions 调用/月
- 300 构建分钟/月
- Netlify Blobs 存储（Beta 免费）
