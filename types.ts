
export enum City {
  LANZHOU = '兰州',
  BEIJING = '北京',
  HARBIN = '哈尔滨',
  XIAN = '西安',
  TIANJIN = '天津'
}

export enum MealTime {
  BREAKFAST = '早饭',
  LUNCH = '中饭',
  DINNER = '晚饭'
}

export enum PhDMajor {
  HYDRO = '水利/环境/地理',
  CS_AI = '计算机/AI/软件',
  BIO_CHEM = '生化/环材/医药',
  HUMANITIES = '人文/社科/经济',
  MECH_CIVIL = '土木/机械/自动化',
  PHYS_MATH = '数理/物理/基础学科'
}

export interface FoodItem {
  name: string;
  description: string;
  tags: string[];
  phdNote: string;
}

export interface FortuneDetail {
  title: string;       // 签文四字题记/主题
  yi: string;          // 宜
  ji: string;          // 忌
  wisdom: string;      // 深度个性化解签
  paperBoost: string;  // 论文/科研提速提升值
  isAIGenerated?: boolean;
}

export interface FortuneResult {
  luck: string;        // e.g. "大吉", "上上签"
  food: FoodItem;
  detail: FortuneDetail;
  major: PhDMajor;
  city: City;
  mealTime: MealTime;
  timestamp: number;
}
