import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import dayjs from 'dayjs';

import {FundInfo, GeneralFundInfo} from 'modules/FundDetails/CostsTable/columns';
import {StatisticsDataModels} from 'shared/components/Funds/monthData';
import {currentMonth, currentYear} from 'shared/constants/actualDate';
import {getLastDayDate} from 'shared/utils/prepareDate/getLastDayDate';
import {initialStartDate} from 'shared/utils/prepareDate/prepareDate';

export interface Rename {
  oldName: string;
  newName: string;
}

interface NewExpenses {
  name: string;
  id: number;
  expenses: number;
  date: string;
}

interface UpdateExpenses {
  id: number;
  expenses: number;
  name: string;
}

interface Date {
  start: string;
  end: string;
}

const detailsInfo = createSlice({
  name: 'detailsFund',
  initialState: {
    fundInfo: [] as FundInfo[],
    startDate: initialStartDate(),
    endDate: dayjs(getLastDayDate(new Date(currentYear, currentMonth, 1))).format('YYYY-MM-DD'),
    isActive: false,
    isCommercial: false,
    isHourly: false,
  },

  reducers: {
    setDetailsInfo(state, action: PayloadAction<FundInfo[]>) {
      state.fundInfo = action.payload;
    },
    setChangeName(state, action: PayloadAction<Rename>) {
      const {oldName, newName} = action.payload;
      const existName = state.fundInfo.filter((item) => item.type === 'additional' && item.name === newName);
      if (existName.length) {
        const [renamedExpenses] = state.fundInfo.filter((item) => item.type === 'additional' && item.name === oldName);
        const {expenses, statisticsDataModels} = renamedExpenses;
        const modifiableExpenses = existName[0];
        const newExpenses = Number(modifiableExpenses.expenses) + Number(expenses);
        const updatedStaticsDataModels = modifiableExpenses.statisticsDataModels.map((stat, index) => {
          if (stat.id === -1 && statisticsDataModels[index].id !== -1) {
            return statisticsDataModels[index];
          } else if (stat.id !== -1 && statisticsDataModels[index].id !== -1) {
            const prevMonthExpenses = Number(stat.expenses) || 0;
            const newMonthExpenses = Number(statisticsDataModels[index].expenses) || 0;
            return {...stat, expenses: newMonthExpenses + prevMonthExpenses};
          } else {
            return stat;
          }
        });

        const [modifiedExpenses] = state.fundInfo.filter((item) => item.name === newName);
        modifiedExpenses.expenses = newExpenses;
        modifiedExpenses.statisticsDataModels = updatedStaticsDataModels;
        state.fundInfo = state.fundInfo.filter((item) => item.name !== oldName);
      } else {
        state.fundInfo = state.fundInfo.map((item) => {
          if (item.type !== 'additional') return item;
          if (item.name === oldName) {
            return {...item, name: newName};
          }
          return item;
        });
      }
    },
    setNewExpenses(state, action: PayloadAction<NewExpenses>) {
      const {name, date, expenses, id} = action.payload;
      state.fundInfo = state.fundInfo.map((item) => {
        if (item.name === name) {
          const newStat = item.statisticsDataModels.map((stat) => {
            if (new Date(stat.dateFrom).getMonth() === new Date(date).getMonth()) {
              return {...stat, id, dateFrom: date, expenses};
            }
            return stat;
          });
          const newTotalCost = newStat.reduce((sum: number, currentStat: StatisticsDataModels) => {
            if (Number(currentStat.expenses)) return sum + Number(currentStat.expenses);
            return sum;
          }, 0);
          return {...item, statisticsDataModels: newStat, expenses: newTotalCost};
        }
        return item;
      });
    },
    setUpdateExpenses(state, action: PayloadAction<UpdateExpenses>) {
      const {name, expenses, id} = action.payload;
      state.fundInfo = state.fundInfo.map((item) => {
        if (item.name === name) {
          item.statisticsDataModels.forEach((stat) => {
            if (stat.id === id) stat.expenses = expenses;
          });
          const newTotalCost = item.statisticsDataModels.reduce((sum: number, currentStat: StatisticsDataModels) => {
            if (Number(currentStat.expenses)) return sum + Number(currentStat.expenses);
            return sum;
          }, 0);
          return {...item, expenses: newTotalCost};
        }
        return item;
      });
    },
    setDefaultExpenses(state, action: PayloadAction<FundInfo[]>) {
      const oldNames = state.fundInfo.map((item) => {
        return item.name;
      });

      const newExpenses = action.payload.filter((item: FundInfo) => !oldNames.includes(item.name));

      if (newExpenses.length) {
        state.fundInfo = [...state.fundInfo, ...newExpenses];
      }
    },
    setDeleteExpenses(state, action: PayloadAction<string>) {
      state.fundInfo = state.fundInfo.filter((item) => item.name !== action.payload);
    },
    setDate(state, action: PayloadAction<Date>) {
      const {start, end} = action.payload;
      state.startDate = start;
      state.endDate = end;
    },
    setProjectInfo(state, action: PayloadAction<GeneralFundInfo>) {
      const {isActive, name, status} = action.payload;
      state.isActive = isActive;
      state.isCommercial = status > 1;
      state.isHourly = name.includes('(FP)');
    },
  },
});

export const {
  actions: detailsInfoActions,
  caseReducers: detailsInfoCaseReducers,
  reducer: detailsInfoReducer,
} = detailsInfo;
