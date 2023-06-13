export enum FileFormat {
  'OpenXml' = 0,
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ParamsSerialize {
  dateRange: DateRange;
  fileFormat: number;
  fundsIds: number[];
}
