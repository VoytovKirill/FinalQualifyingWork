export enum RateType {
  tax = 1,
  productionCosts = 2,
}

export interface RateInfo {
  type: RateType;
  from: string;
  to: string | null;
  ratio: number;
}
