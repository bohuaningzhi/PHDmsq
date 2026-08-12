import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API 1: 智能解签生成
  app.post("/api/fortune", async (req, res) => {
    try {
      const { food, city, mealTime, luck, major } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

      if (!apiKey) {
        return res.json({ error: "NO_API_KEY" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
你是一位极其幽默风趣、精通科研玄学与博导心理学的“博士灵签大宗师”。
请为正在求签选餐的博士生生成一份独一无二、梗多料足的【灵签解签】。

求签背景：
- 所在城市/科研据点：${city}
- 餐饮时段：${mealTime}
- 抽到的推荐美食：${food.name} (特色描述：${food.description || ''})
- 今日运势吉凶：${luck}
- 博士研究专业方向：${major}
- 随机种子标识：${Date.now()}-${Math.random()}

生成要求：
1. "title": 4-8字霸气幽默签文标题（如："【大吉·纳维斯托克斯收敛】"、"【上上签·审稿人全票通过】"、"【大吉·显存无限暴涨】"）。
2. "yi": 适合今天做的一件非常具体的科研/生活小事（如："宜：将修改稿件中的Figure 3替换为4K高清矢量图"）。
3. "ji": 今天极力规避的坑人操作（如："忌：在组会上跟导师眼神碰撞超过三秒"）。
4. "wisdom": 80-120字生动解签。一定要将【${food.name}】的食材口感与【${major}】专业的科研梗（如代码/实验/论文/模型/答辩/审稿）深度融合，用风趣幽默的语言给博士生极大的情绪价值与灵感启发！
5. "paperBoost": 幽默搞笑的科研能力加成数据（如："论文写作速度 +2.3%, Loss 曲线骤降 0.12"）。

请严格输出 JSON 格式。`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.9,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              yi: { type: Type.STRING },
              ji: { type: Type.STRING },
              wisdom: { type: Type.STRING },
              paperBoost: { type: Type.STRING }
            },
            required: ["title", "yi", "ji", "wisdom", "paperBoost"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json({ ...parsed, isAIGenerated: true });
      } else {
        return res.json({ error: "EMPTY_RESPONSE" });
      }
    } catch (err: any) {
      console.error("Server /api/fortune error:", err);
      return res.status(500).json({ error: err.message || "INTERNAL_ERROR" });
    }
  });

  // API 2: 博导 AI 智能解签对话
  app.post("/api/ask-mentor", async (req, res) => {
    try {
      const { userQuestion, result, chatHistory } = req.body;
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

      if (!apiKey) {
        return res.json({ error: "NO_API_KEY" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const formattedHistory = (chatHistory || [])
        .map((m: any) => `${m.role === 'user' ? '博士生' : '博导'}: ${m.text}`)
        .join('\n');

      const prompt = `
你是一位懂科研痛苦、体贴幽默、历经百战的资深“博士生导师解签人”。
学生当前求签背景：
- 城市：${result?.city || '城市'}
- 研究专业：${result?.major || '科研'}
- 推荐美食：${result?.food?.name || '美食'}
- 今日运势：${result?.luck || '大吉'} (${result?.detail?.title || ''})

历史对话记录：
${formattedHistory}

学生发起的最新提问：
"${userQuestion}"

请针对学生的具体问题"${userQuestion}"给出【针对性极强】、【切中痛点】且【充满正向情绪与幽默智慧】的解答（80-150字）：
1. 绝对不要用模板套话回复，针对他提出的具体困惑（例如拒稿/开题/代码报错/导师压力/择业/毕业/吃不饱等）给针对性建议。
2. 巧妙结合他今天抽到的美食【${result?.food?.name}】作为能量支点或幽默喻体。
3. 语调亲切幽默，像一位老博导师兄/导师在夜宵摊旁给他排忧解难。
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.85
        }
      });

      return res.json({ answer: response.text || "把眼前这顿美食吃完，胃里有底气，科研就没有过不去的关！" });
    } catch (err: any) {
      console.error("Server /api/ask-mentor error:", err);
      return res.status(500).json({ error: err.message || "INTERNAL_ERROR" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
