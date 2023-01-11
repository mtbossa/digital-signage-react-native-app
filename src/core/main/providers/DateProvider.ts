export type UnitTypes = "day" | "isoweekday" | "month" | "year";
export interface DateProvider {
  isDateAfterToday(dateToCompare: string): boolean;
  isDateBeforeToday(dateToCompare: string): boolean;
  isNowBetweenTimes(startTime: string, endTime: string): boolean;
  isTodaySameUnitValue(value: number, unit: UnitTypes): boolean;
}
