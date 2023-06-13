export interface FondDto {
  id: number;
  name: string;
  monthStats: Array<MonthStats | null>;
  totalStats: MonthStats;
  budgetDifference: number | null;
  missingSalaryRates: boolean;
}

export interface MonthStats {
  workTime: number | string;
  totalCosts: number | string;
  doubleRateWorkTime?: number;
  directCosts?: number | null;
  administrativeCosts?: number | null;
}

export interface AdditionalStatsDto {
  additionalCosts: number[];
  totalAdditionalCosts: number;
  employeeStats: EmployeeStats[];
}

export interface EmployeeStats {
  fullName: string;
  missingSalaryRates: boolean;
  monthStats: (EmployeeMonthStats | null)[];
  totalStats: EmployeeMonthStats;
}

export interface EmployeeMonthStats {
  doubleRateWorkTime: number;
  workTime: number;
  sum: number;
}

export interface MonthAdditionalStatistics {
  id: number;
  name: string;
  date: string;
  cost: number;
}

export interface FullAdditionalStats {
  name: string;
  monthAdditionalStatistics: MonthAdditionalStatistics[];
  totalCost: number;
}

export interface DetailedStats {
  additionalCosts: FullAdditionalStats[];
}

export interface FullDetailedStats extends DetailedStats {
  employeeStats: EmployeeStats[];
}
