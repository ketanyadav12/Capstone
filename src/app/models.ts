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
  id: string;
  villageId?: string;
  villageName?: string;
  villageState?: string;
  area?: string;
  primaryValue?: string;
  metricValue?: number;
  status: string;
  score: number;
  updatedOn: string;
}
