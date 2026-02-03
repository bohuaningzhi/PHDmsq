
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

export interface FoodItem {
  name: string;
  description: string;
  tags: string[];
  phdNote: string;
}

export interface FortuneResult {
  luck: string; // e.g., "上上签", "大吉"
  food: FoodItem;
  wisdom: string; // AI generated PhD wisdom
}
