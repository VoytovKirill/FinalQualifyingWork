import {EmployeeDto} from 'api/dto/Employee';
import {employeesService} from 'api/services/employeesService';
import {SearchListItem} from 'typings/global';

const transformEmployeDtoList = (employeDtoList: EmployeeDto[]): SearchListItem[] => {
  return employeDtoList.map((item) => {
    const {fio, id} = item;
    return {text: fio, id};
  });
};

export const getEmployeeList = async (isFired: boolean) => {
  try {
    const {data} = await employeesService.getEmployeeList(isFired);
    return transformEmployeDtoList(data);
  } catch (err) {
    return [];
  }
};
