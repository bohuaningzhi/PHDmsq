
import { City, MealTime, FoodItem } from './types';

export const FOOD_DATABASE: Record<City, Record<MealTime, FoodItem[]>> = {
  [City.LANZHOU]: {
    [MealTime.BREAKFAST]: [
      { name: "兰州牛肉面", description: "一清二白三红四绿五黄，唤醒科研之魂。", tags: ["热乎", "管饱"], phdNote: "加个肉和蛋，实验不白干。" },
      { name: "甜胚子奶茶", description: "发酵的燕麦香气，天然的能量补给。", tags: ["甜口", "特色"], phdNote: "发酵过程就像你的论文，需要时间酝酿。" },
      { name: "鸡蛋醪糟", description: "温润养胃，适合早起赶班车的博士。", tags: ["养生", "快速"], phdNote: "胃暖了，心就不凉了。" }
    ],
    [MealTime.LUNCH]: [
      { name: "炒面片", description: "劲道爽滑，丰富的配菜均衡营养。", tags: ["家常", "丰富"], phdNote: "面片要一片片炒，实验要一步步做。" },
      { name: "羊肉粉汤", description: "肉烂汤鲜，驱散西北的寒气。", tags: ["暖胃", "扎实"], phdNote: "暖意十足，对抗组会后的emo。" },
      { name: "烤馕饼夹肉", description: "便携耐饿，适合在实验室里快速解决。", tags: ["便携", "高能"], phdNote: "一手拿馕，一手看文献。" }
    ],
    [MealTime.DINNER]: [
      { name: "炕锅羊排", description: "偶尔犒劳一下奋斗的自己。", tags: ["硬菜", "解馋"], phdNote: "跑通一个代码，就该吃顿好的。" },
      { name: "酿皮子", description: "酸辣开胃，洗去一天的疲惫。", tags: ["开胃", "轻食"], phdNote: "生活的酸辣，都在这碗里了。" },
      { name: "灰豆子", description: "绵软香甜，最佳的科研宵夜补给。", tags: ["甜品", "传统"], phdNote: "甜甜嘴，晚上熬夜不觉苦。" }
    ]
  },
  [City.BEIJING]: {
    [MealTime.BREAKFAST]: [
      { name: "煎饼馃子", description: "五道口/学院路标配，加双蛋是最后的倔强。", tags: ["经典", "快捷"], phdNote: "加个薄脆，生活也要脆生生的。" },
      { name: "驴打滚豆汁儿", description: "挑战极限，或者享受传统。", tags: ["硬核", "特色"], phdNote: "能喝下豆汁儿的人，没有写不出的综述。" },
      { name: "庆丰包子", description: "中规中矩，稳健的科研起点。", tags: ["踏实", "管饱"], phdNote: "包子皮厚心实，做人也要踏实。" }
    ],
    [MealTime.LUNCH]: [
      { name: "老北京炸酱面", description: "七碟八碗小菜，拌出生活百味。", tags: ["爽口", "仪式感"], phdNote: "面条长长，科研路漫漫。" },
      { name: "驴肉火烧", description: "酥脆的外皮，鲜美的驴肉。", tags: ["高性价比", "解馋"], phdNote: "天上龙肉，地上驴肉，导师都没你懂肉。" },
      { name: "食堂大锅菜", description: "最具性价比的博士生生存基石。", tags: ["便宜", "均衡"], phdNote: "省下的钱，都是为了买显卡跑数据。" }
    ],
    [MealTime.DINNER]: [
      { name: "炙子烤肉", description: "烟火气十足，三五同窗小聚。", tags: ["聚餐", "肉食"], phdNote: "吐槽导师的最佳伴侣。" },
      { name: "麻辣烫", description: "自由组合，掌控自己的卡路里。", tags: ["自选", "重口味"], phdNote: "万物皆可麻辣烫，万事皆可被解决。" },
      { name: "三里屯轻食", description: "偶尔精致，平衡学术与生活。", tags: ["低脂", "洋气"], phdNote: "哪怕在实验室，也要优雅生活。" }
    ]
  },
  [City.HARBIN]: {
    [MealTime.BREAKFAST]: [
      { name: "大列巴配红肠", description: "俄式风情，极其耐饿。", tags: ["硬核", "饱腹"], phdNote: "牙口要好，搞科研的意志也要硬。" },
      { name: "豆腐脑配油条", description: "东北特色咸口豆腐脑，大碗厚实。", tags: ["暖和", "地道"], phdNote: "像东北人一样，豪爽面对审稿意见。" },
      { name: "烤冷面", description: "街头霸主，虽然它是早餐但它无所不在。", tags: ["快手", "街头"], phdNote: "热腾腾的醋香味，一秒回神。" }
    ],
    [MealTime.LUNCH]: [
      { name: "锅包肉", description: "外酥里嫩，酸甜适口，补充糖分。", tags: ["必吃", "能量"], phdNote: "甜入心扉，治愈被模型气炸的心。" },
      { name: "铁锅炖鱼", description: "热气腾腾，适合组里多人共餐。", tags: ["大分量", "社交"], phdNote: "众人拾柴火焰高，大家一起改论文。" },
      { name: "排骨炖豆角", description: "家常温暖，给疲惫的博士一个拥抱。", tags: ["家乡味", "实在"], phdNote: "肉和豆角的完美结合，就像理论与实践。" }
    ],
    [MealTime.DINNER]: [
      { name: "马迭尔冰棍", description: "零下三十度的浪漫。", tags: ["甜品", "打卡"], phdNote: "冷冷静静，清醒一下乱掉的逻辑。" },
      { name: "俄式西餐", description: "庄重的浪漫，庆祝小论文接收。", tags: ["格调", "仪式"], phdNote: "学术之外，也需要艺术的熏陶。" },
      { name: "烧烤哈啤", description: "东北社交的灵魂终点。", tags: ["解压", "狂欢"], phdNote: "一顿烧烤，烦恼全倒。" }
    ]
  },
  [City.XIAN]: {
    [MealTime.BREAKFAST]: [
      { name: "肉夹馍配肉丸胡辣汤", description: "西安早餐黄金搭档，重口味醒神。", tags: ["硬核", "醒脑"], phdNote: "这一碗下去，能看五十篇Abstract。" },
      { name: "油茶麻花", description: "口感丰富，热乎乎的满足感。", tags: ["传统", "酥软"], phdNote: "麻花在油茶里泡软，就像你被科研磨平了棱角。" },
      { name: "甑糕", description: "软糯香甜，枣香味浓。", tags: ["甜品", "软糯"], phdNote: "生活苦，就得来点糯叽叽的甜。" }
    ],
    [MealTime.LUNCH]: [
      { name: "羊肉泡馍", description: "自己掰馍的过程就是一种修行。", tags: ["耗时", "美味"], phdNote: "掰馍要耐心，调参也要细心。" },
      { name: "Biangbiang面", description: "宽度惊人，一根吃饱。", tags: ["带劲", "碳水炸弹"], phdNote: "名字最难写的面，给最有挑战的博士。" },
      { name: "凉皮肉夹馍", description: "清爽与厚重的完美平衡。", tags: ["经典", "利索"], phdNote: "科研也要有张有弛。" }
    ],
    [MealTime.DINNER]: [
      { name: "葫芦头泡馍", description: "鲜香肥美，老西安人的心头好。", tags: ["小众", "惊艳"], phdNote: "有些东西，得静下心来才能品出好。" },
      { name: "洒金桥夜市小吃", description: "随便吃，盲选不踩雷。", tags: ["多样", "烟火"], phdNote: "在繁华的夜市里，找寻失落的灵感。" },
      { name: "陕菜拼盘", description: "精致陕菜，体验古都底蕴。", tags: ["全面", "丰盛"], phdNote: "学识要渊博，菜色也要多样。" }
    ]
  },
  [City.TIANJIN]: {
    [MealTime.BREAKFAST]: [
      { name: "天津煎饼馃子", description: "纯绿豆面，不加火腿生菜，卫嘴子的信仰。", tags: ["正宗", "碳水"], phdNote: "就像你的原始数据，纯粹才是力量。" },
      { name: "嘎巴菜 (锅巴菜)", description: "浓郁卤汁，绿豆锅巴，天津人晨起的灵魂。", tags: ["独特", "浓郁"], phdNote: "生活复杂如卤汁，但依然有嚼劲。" },
      { name: "耳朵眼炸糕", description: "外焦里嫩，糯米香甜。", tags: ["甜食", "百年老字号"], phdNote: "炸得金黄，愿你的学术成果也这般耀眼。" }
    ],
    [MealTime.LUNCH]: [
      { name: "八珍豆腐", description: "嫩滑豆腐配海鲜山珍，内容极丰富。", tags: ["丰盛", "咸鲜"], phdNote: "你的模型变量要像这盘豆腐一样，多而不乱。" },
      { name: "糖醋里脊", description: "酸甜口，外壳酥脆，非常下饭。", tags: ["解馋", "国民菜"], phdNote: "科研之路酸酸甜甜，最后总是香的。" },
      { name: "炸酱面 (卫式)", description: "菜码丰富，面条筋道。", tags: ["家常", "饱腹"], phdNote: "生活需要一些“菜码”来装饰枯燥的计算。" }
    ],
    [MealTime.DINNER]: [
      { name: "砂锅牛肉", description: "小火慢熬，牛肉软烂入味。", tags: ["暖心", "慢炖"], phdNote: "论文也需要砂锅这种慢工出细活的精神。" },
      { name: "卷圈配大饼", description: "炸得酥脆的豆皮卷，配上刚出炉的大饼。", tags: ["特色", "快捷"], phdNote: "简单、直接、高效，适合刚出实验室的你。" },
      { name: "熟梨糕", description: "五彩斑斓，小时候的味道。", tags: ["甜点", "情怀"], phdNote: "不论实验多难，别忘了童年的色彩。" }
    ]
  }
};

export const LUCK_LEVELS = ["上上签", "大吉", "中吉", "上吉", "小吉"];
