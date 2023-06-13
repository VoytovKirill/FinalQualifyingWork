export interface EmployeeDto {
  employeeId: number;
  employeeFullName: string;
  isMissingSalaryRates: boolean;
  salaryRates: (number | null)[];
}

export interface EmployeesSalaryRatesDTO {
  items: EmployeeDto[];
  totalSize: number;
  paginationSize: number;
}
