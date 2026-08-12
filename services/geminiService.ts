import { GoogleGenAI, Type } from "@google/genai";
import { FoodItem, City, MealTime, PhDMajor, FortuneDetail, FortuneResult } from "../types";

// 离线算法概率词库（确保无网络或无API Key时，每次抽签同样极其丰富且绝不重复）
const MAJOR_TERMS: Record<PhDMajor, { verbs: string[]; nouns: string[]; jargon: string[] }> = {
  [PhDMajor.HYDRO]: {
    verbs: ["数值模拟", "水文推演", "模型收敛", "纳维-斯托克斯方程求解", "水库优化调度", "泥沙演进计算"],
    nouns: ["三峡数据", "流体力学网格", "水质监控图谱", "遥感降水反演", "水利部重点项目", "水科院南院数据"],
    jargon: ["流体顺畅无阻", "雷诺数恰到好处", "水头损失降至最低", "泥沙淤积自动清零", "水位预测误差<0.01%"]
  },
  [PhDMajor.CS_AI]: {
    verbs: ["GPU超频", "Transformer调参", "Loss曲线断崖下跌", "注意力机制收敛", "梯度下降", "代码一次Passed"],
    nouns: ["A100显卡集群", "CVPR/NeurIPS顶刊", "Github开源星数", "训练集特征向量", "大模型推理时延"],
    jargon: ["过拟合风险自动抵消", "学习率衰减至完美点", "显存使用率稳定在99%", "数据蒸馏无损提速"]
  },
  [PhDMajor.BIO_CHEM]: {
    verbs: ["PCR扩增", "蛋白结晶", "显微镜成像", "化合物提纯", "气相色谱分析", "细胞复苏"],
    nouns: ["Cell/Nature主刊", "离心机转速", "实验室特级试剂", "阳性对照组", "目标基因表达"],
    jargon: ["杂菌污染率归零", "吸光度绝对线性", "产率飙升300%", "假阳性干扰自动消除"]
  },
  [PhDMajor.HUMANITIES]: {
    verbs: ["田野调查", "SPSS回归分析", "文献综述撰写", "质性编码分析", "核心期刊审稿", "学术框架构建"],
    nouns: ["CSSCI双核心", "问卷回收有效率", "扎根理论范式", "专著出版计划", "基金开题报告"],
    jargon: ["显著性水平p<0.001", "R方解释度高达95%", "审稿意见大修变小修", "学术语境圆融无碍"]
  },
  [PhDMajor.MECH_CIVIL]: {
    verbs: ["ANSYS有限元分析", "拓扑优化", "应力集中消除", "振动模态测试", "BIM三维建模", "疲劳寿命计算"],
    nouns: ["国家大科学工程", "高强合金材料", "传感器校准", "风洞试验数据", "关键构件图纸"],
    jargon: ["安全系数提至3.0", "应力变幻皆在掌控", "结构变形完全可逆", "公差配合精密无缝"]
  },
  [PhDMajor.PHYS_MATH]: {
    verbs: ["量子态叠加", "数学归纳法证明", "矩阵特征值求解", "拓扑相变推演", "哈密顿量对角化", "微分方程定性分析"],
    nouns: ["Physical Review Letters", "庞加莱猜想推导", "超导临界温度", "相干时间延长", "粒子对撞数据"],
    jargon: ["解析解优雅导出", "系统熵减自发进行", "对称性破缺完美解释", "扰动项高阶修正完成"]
  }
};

const YI_POOL = [
  "提交Manuscript draft", "找导师签进度表", "修改盲审意见", "在实验室加爆记忆体",
  "重跑被断掉的实验", "开启大修Major Revision", "在组会展示惊艳PPT", "给论文添两幅高清矢量图",
  "投递Nature/Science子刊", "充值咖啡卡继续发奋", "将代码Push到Main分支", "深呼吸并清理桌面"
];

const JI_POOL = [
  "与导师眼神直视超过3秒", "组会上主动抢答难题", "在群里发送未审校的PDF", "深夜修改核心算法逻辑",
  "手贱点开审核系统邮箱", "质疑审稿人2的学术专业度", "用实验室网速下4K电影", "连续熬夜不吃早饭"
];

const WISDOM_PATTERNS = [
  "【因果律食物】在{city}吃这道{food}，能激活你体内潜在的{verb}能量。科研之道，在于气血充沛，今日必定{jargon}！",
  "【导师认可签】正在苦苦啃{jargon}？{food}中的能量将帮你理清{noun}的逻辑漏洞。吃完这顿，修改意见手到擒来！",
  "【学术高光】此乃{city}博生圈相传之神物！午餐/晚餐一落肚，{verb}效率提升300%，今晚不仅不用熬夜，数据还将自动呈现Sigmoid完美曲线。",
  "【大修必备】面对审稿人的苛刻质问，你需要这盘{food}充当防具。碳水补足，大脑神清气爽，{jargon}，毕业近在咫尺！"
];

// 智能离线生成器（确保即使没网，每次抽签文案也千变万化）
export const generateSmartOfflineFortune = (
  food: FoodItem,
  city: City,
  mealTime: MealTime,
  luck: string,
  major: PhDMajor
): FortuneDetail => {
  const terms = MAJOR_TERMS[major] || MAJOR_TERMS[PhDMajor.CS_AI];
  const verb = terms.verbs[Math.floor(Math.random() * terms.verbs.length)];
  const noun = terms.nouns[Math.floor(Math.random() * terms.nouns.length)];
  const jargon = terms.jargon[Math.floor(Math.random() * terms.jargon.length)];

  const yi = YI_POOL[Math.floor(Math.random() * YI_POOL.length)];
  const ji = JI_POOL[Math.floor(Math.random() * JI_POOL.length)];

  const rawPattern = WISDOM_PATTERNS[Math.floor(Math.random() * WISDOM_PATTERNS.length)];
  const wisdom = rawPattern
    .replace('{city}', city)
    .replace('{food}', food.name)
    .replace('{verb}', verb)
    .replace('{noun}', noun)
    .replace('{jargon}', jargon);

  const titles = [
    `【${luck}·${jargon.slice(0, 4)}】`,
    `【${luck}·${verb.slice(0, 4)}】`,
    `【${luck}·${food.name.slice(0, 4)}】`,
    `【${luck}·突破瓶颈】`
  ];

  const title = titles[Math.floor(Math.random() * titles.length)];
  const boostVal = (Math.random() * 2 + 0.8).toFixed(1);
  const paperBoost = `论文写作提速 +${boostVal}%, ${noun}精度提升 ${(Math.random() * 5 + 90).toFixed(1)}%`;

  return {
    title,
    yi: `宜：${yi}`,
    ji: `忌：${ji}`,
    wisdom,
    paperBoost,
    isAIGenerated: false
  };
};

export const getPhDFortune = async (
  food: FoodItem,
  city: City,
  mealTime: MealTime,
  luck: string,
  major: PhDMajor
): Promise<FortuneDetail> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    console.warn("Gemini API Key missing, using Smart Offline Engine");
    return generateSmartOfflineFortune(food, city, mealTime, luck, major);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
你是一位极其幽默、深谙博士生痛点与科研梗的“博士灵签解签老导师”。
请为正在求签选择餐点的博士生生成一份个性化【灵签解签】。

背景信息：
- 所在城市/科研据点：${city}
- 当前餐饮时段：${mealTime}
- 抽到的推荐美食：${food.name} (${food.description})
- 今日抽到的运势：${luck}
- 博士研究专业方向：${major}

请严格输出 JSON 格式，包含以下字段：
1. "title": 4-8字吉利签文标题（例如："【大吉·数值模拟通畅】" 或 "【上上签·审稿人全赞成】"）
2. "yi": 适合今天做的一件学术/生活的具体事（例如："宜：提交Manuscript，找导师签字"）
3. "ji": 今天应避免的一件坑人小事（例如："忌：与导师眼神直视超过三秒"）
4. "wisdom": 70字左右解签评语。结合${major}专业梗、${food.name}的美食特色，语言接地气，幽默且充满正向情绪价值！
5. "paperBoost": 具体的论文/科研提升幽默数值（例如："毕业进度 +1.5%, Loss 下降 0.08"）

注意：仅返回纯 JSON 格式，不要添加 markdown 标记之外的内容。
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
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

    const responseText = response.text;
    if (responseText) {
      const parsed = JSON.parse(responseText) as FortuneDetail;
      return {
        ...parsed,
        isAIGenerated: true
      };
    }
  } catch (error) {
    console.error("Gemini API generate fortune error:", error);
  }

  // 出错时使用智能本地算法生成，确保绝不重复
  return generateSmartOfflineFortune(food, city, mealTime, luck, major);
};

// 交互式 AI 导师解签对话功能
export const askPhDMentor = async (
  userQuestion: string,
  result: FortuneResult,
  chatHistory: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> => {
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    return `（智囊导师）：同学，关于你问的“${userQuestion}”，老夫建议你先把眼前这份${result.food.name}吃完！胃里有食物，脑里才有思路，${result.detail.yi}，今日大吉，必无险阻！`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const historyPrompt = chatHistory.map(m => `${m.role === 'user' ? '博士生' : '解签导师'}: ${m.text}`).join('\n');

    const prompt = `
你是一位懂科研、体贴学生、幽默智慧的博导解签人。
当前学生抽到的灵签背景：
- 城市：${result.city}
- 推荐食物：${result.food.name}
- 专业方向：${result.major}
- 今日运势：${result.luck}
- 签文：${result.detail.title} - ${result.detail.wisdom}

学生向你发起的提问：
"${userQuestion}"

历史对话：
${historyPrompt}

请以“博导解签人”的口吻，用100字以内给出幽默、真诚、有具体指导意义的回答，帮他排解科研焦虑，或者给出具体的补给建议。
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.8
      }
    });

    return response.text || `先把这顿【${result.food.name}】吃好，科研没有什么是一顿美食解决不了的！`;
  } catch (e) {
    console.error("askPhDMentor error:", e);
    return `（智囊导师）：科研路漫漫，先把眼前这盘【${result.food.name}】吃光。补充好血糖，再回去把问题拿捏得死死的！`;
  }
};
