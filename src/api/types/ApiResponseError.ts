export enum ErrorType {
  'General',
  'Validation',
  'Multiple',
}

export type Errors = {
  descriptions: string[];
  [key: string]: string[];
};

export type ErrorDetails = {
  title: string;
  status: number;
  type: ErrorType;
  errors: Errors | null;
};

export type Warning = {
  descriptions: string[];
  [key: string]: string[];
  errorValues: string[];
  errorKey: string[];
};
export {AxiosError as ApiFailedResponseError} from 'axios';
