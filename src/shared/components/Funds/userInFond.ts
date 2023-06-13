import {MonthStats} from 'api/dto/Fund';

export interface UserInFond {
  fullName: string;
  monthStats: MonthStats[];
  totalStats: MonthStats;
  missingSalaryRates: boolean;
}
