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

// 智能离线生成器（确保即使无网络/API Key，每次抽签文案也千变万化）
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

// 智能离线 mentor 对话生成器（根据问题关键词定制，绝不简单重复）
export const generateSmartOfflineMentorAnswer = (
  userQuestion: string,
  result: FortuneResult
): string => {
  const q = userQuestion.toLowerCase();
  const foodName = result.food.name;
  const major = result.major;

  if (q.includes("拒稿") || q.includes("被拒") || q.includes("审稿") || q.includes("修改") || q.includes("reject")) {
    const answers = [
      `（博导解签）：审稿人给意见是好事！这说明论文离发表只有一步之遥。吃盘【${foodName}】把血糖拉高，把意见拆成10个具体修改项，大修（Major Revision）变小修，这篇${major}论文必拿下！`,
      `（博导解签）：老夫当年也被拒过三四次！科研的韧性就是这么磨出来的。先享用这顿【${foodName}】，今晚按审稿人的要求补充对比实验，补完数据论文质感瞬间提升！`,
      `（博导解签）：被拒稿不要沮丧！往往改投另一个顶刊反而直接被接收。吃饱【${foodName}】，重新调整Abstract和Intro，明晚重新Push投递！`
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  }

  if (q.includes("开题") || q.includes("答辩") || q.includes("汇报") || q.includes("组会") || q.includes("ppt") || q.includes("导师")) {
    const answers = [
      `（博导解签）：组会汇报最忌空腹上阵！吃好【${foodName}】，把逻辑框架理清晰。导师提问时保持从容，懂的自信作答，不确定的坦承“会后重点跟进”，稳稳过关！`,
      `（博导解签）：导师也是从博士过来的，最看重的是你的研究态度和逻辑链。吃完【${foodName}】，给PPT加上清晰的示意图与对比表格，组会上一定让导师眼前一亮！`,
      `（博导解签）：汇报前深呼吸！今天运势处于${result.luck}，吃顿【${foodName}】补充气血，你的汇报思路会像滑溜的面条一样顺畅，不必焦虑。`
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  }

  if (q.includes("代码") || q.includes("bug") || q.includes("报错") || q.includes("模型") || q.includes("跑不通") || q.includes("loss")) {
    const answers = [
      `（博导解签）：代码跑不通往往是因为盯着屏幕久了陷入思维定势。吃顿【${foodName}】换个环境，回来加几个Print或断点，5分钟就能定位那个隐藏Bug！`,
      `（博导解签）：调参就像煮【${foodName}】，火候与学习率都要慢慢试。今天抽中${result.luck}，吃饱饭后重跑一次，Loss 曲线绝对给你展现完美的下降趋势！`,
      `（博导解签）：先把显存释放一下，安心吃完【${foodName}】。脑子清醒后重新检查输入维度与数据清洗脚本，代码一次Passed就在今晚！`
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  }

  if (q.includes("毕业") || q.includes("延毕") || q.includes("学位") || q.includes("文章") || q.includes("发表")) {
    const answers = [
      `（博导解签）：博士毕业是一场马拉松而非百米冲刺。今天这顿【${foodName}】就是你的中途补给站。一步一个脚印，把论文大纲写实，毕业证书近在咫尺！`,
      `（博导解签）：焦虑源于对未知的不确定。吃饱【${foodName}】，列出毕业前的三个最关键任务清单，每天完成一点点，按时顺利毕业指日可待！`
    ];
    return answers[Math.floor(Math.random() * answers.length)];
  }

  if (q.includes("吃") || q.includes("味道") || q.includes("好吃") || q.includes("量") || q.includes("推荐")) {
    return `（博导解签）：这道【${foodName}】在${result.city}可是口碑佳品！碳水扎实，热乎暖胃。吃饱了不仅心情愉悦，脑力细胞活跃度还能飙升，赶紧去尝尝！`;
  }

  // 默认多样化随机回复
  const defaultAnswers = [
    `（博导解签）：同学，“${userQuestion}”这个问题问得深刻！科研路上遇到瓶颈很正常。眼下最好的策略就是吃饱这顿【${foodName}】，让大脑在饱腹状态下重新演算，答案往往不期而至。`,
    `（博导解签）：老导师告诉你个秘诀：80%的科研焦虑都是因为低血糖。先把【${foodName}】吃完，今晚精神抖擞，无论是改论文还是做模拟，统统不在话下！`,
    `（博导解签）：关于“${userQuestion}”，其实你心里已经有了答案。保持节奏，吃好这顿【${foodName}】，给自己的脑细胞做个全套SP，今晚效率起飞！`,
    `（博导解签）：在${result.city}做${result.major}，最重要就是一口气。吃完【${foodName}】，去实验室把手头的事做专做精，你的成果迟早会闪耀全场！`
  ];

  return defaultAnswers[Math.floor(Math.random() * defaultAnswers.length)];
};

// 交互式 AI 灵签获取（优先调用后端 Gemini 服务，失败后无缝切换智能离线引擎）
export const getPhDFortune = async (
  food: FoodItem,
  city: City,
  mealTime: MealTime,
  luck: string,
  major: PhDMajor
): Promise<FortuneDetail> => {
  try {
    const res = await fetch("/api/fortune", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ food, city, mealTime, luck, major })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.title && data.wisdom && !data.error) {
        return {
          title: data.title,
          yi: data.yi,
          ji: data.ji,
          wisdom: data.wisdom,
          paperBoost: data.paperBoost,
          isAIGenerated: true
        };
      }
    }
  } catch (err) {
    console.warn("Call /api/fortune error, switching to smart offline generator:", err);
  }

  return generateSmartOfflineFortune(food, city, mealTime, luck, major);
};

// 交互式 AI 导师解签对话（优先调用后端 Gemini 服务，失败后调用智能离线回答引擎）
export const askPhDMentor = async (
  userQuestion: string,
  result: FortuneResult,
  chatHistory: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<string> => {
  try {
    const res = await fetch("/api/ask-mentor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userQuestion, result, chatHistory })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.answer && !data.error) {
        return data.answer;
      }
    }
  } catch (err) {
    console.warn("Call /api/ask-mentor error, switching to offline mentor answer:", err);
  }

  return generateSmartOfflineMentorAnswer(userQuestion, result);
};
