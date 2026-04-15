export interface SummaryStat {
  title: string;
  value: string;
  icon: string;
  colorClass: string;
}

export interface VillageMetric {
  village: string;
  employment: number;
  water: number;
  literacy: number;
}

export interface ModuleRecord {
  area: string;
  status: string;
  score: number;
  updatedOn: string;
}
