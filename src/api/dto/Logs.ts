type UserData = {
  id: number;
  lastName: string;
  firstName: string;
  role: string;
};

export interface LogDTO {
  id: number;
  account: UserData | null;
  createdDateTime: string;
  event: number;
  description: string;
  logSource: number;
}
