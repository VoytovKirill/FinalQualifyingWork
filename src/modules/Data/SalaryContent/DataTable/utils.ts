const currentMounth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export const isAvailableForEdit = (idMonth: number, year: number) => {
  if (year === currentYear) {
    return idMonth === currentMounth + 1 || idMonth === currentMounth + 2;
  }
  if (year === currentYear + 1 && currentMounth === 11) {
    return idMonth === 1;
  } else {
    return false;
  }
};

export const getFromRequestString = (idMonth: number, year: number) => {
  return `${year}-${idMonth}-01`;
};

export const getColumnsData = (year: number) => {
  return [
    {
      id: 'employeeFullName',
      name: 'Имя партнёра',
      isAvailableForEdit: false,
      from: null,
    },
    {
      id: 'lastYearDecember',
      name: 'Декабрь пр.года',
      isAvailableForEdit: false,
      from: null,
    },
    {
      id: 'january',
      name: 'Январь',
      isAvailableForEdit: isAvailableForEdit(1, year),
      from: getFromRequestString(1, year),
    },
    {
      id: 'february',
      name: 'Февраль',
      isAvailableForEdit: isAvailableForEdit(2, year),
      from: getFromRequestString(2, year),
    },
    {
      id: 'march',
      name: 'Март',
      isAvailableForEdit: isAvailableForEdit(3, year),
      from: getFromRequestString(3, year),
    },
    {
      id: 'april',
      name: 'Апрель',
      isAvailableForEdit: isAvailableForEdit(4, year),
      from: getFromRequestString(4, year),
    },
    {
      id: 'may',
      name: 'Май',
      isAvailableForEdit: isAvailableForEdit(5, year),
      from: getFromRequestString(5, year),
    },
    {
      id: 'june',
      name: 'Июнь',
      isAvailableForEdit: isAvailableForEdit(6, year),
      from: getFromRequestString(6, year),
    },
    {
      id: 'july',
      name: 'Июль',
      isAvailableForEdit: isAvailableForEdit(7, year),
      from: getFromRequestString(7, year),
    },
    {
      id: 'august',
      name: 'Август',
      isAvailableForEdit: isAvailableForEdit(8, year),
      from: getFromRequestString(8, year),
    },
    {
      id: 'september',
      name: 'Сентябрь',
      isAvailableForEdit: isAvailableForEdit(9, year),
      from: getFromRequestString(9, year),
    },
    {
      id: 'october',
      name: 'Октябрь',
      isAvailableForEdit: isAvailableForEdit(10, year),
      from: getFromRequestString(10, year),
    },
    {
      id: 'november',
      name: 'Ноябрь',
      isAvailableForEdit: isAvailableForEdit(11, year),
      from: getFromRequestString(11, year),
    },
    {
      id: 'december',
      name: 'Декабрь',
      isAvailableForEdit: isAvailableForEdit(12, year),
      from: getFromRequestString(12, year),
    },
  ];
};
