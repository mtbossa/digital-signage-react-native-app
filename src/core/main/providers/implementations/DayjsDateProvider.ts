import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import type { DateProvider, UnitTypes } from "../DateProvider";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(isoWeek);

export default class DayjsDateProvider implements DateProvider {
	private convertUnit(unit: UnitTypes) {
		switch (unit) {
			case "day":
				return "date";
			case "isoweekday":
				return "isoWeekday";
			default:
				return unit;
		}
	}

	public isTodaySameUnitValue(value: number, unit: UnitTypes): boolean {
		const unitConverted = this.convertUnit(unit);
		const now = dayjs();
		if (unitConverted === "month") {
			value = value - 1;
		}
		return now[unitConverted]() === value;
	}
	/**
	 * @param dateToCompare {string} Expectect format 'YYYY-MM-DD'
	 */
	public isDateAfterToday(dateToCompare: string): boolean {
		const now = dayjs();
		const compare = dayjs(dateToCompare);

		return compare.isAfter(now, "day");
	}

	isDateBeforeToday(dateToCompare: string): boolean {
		const now = dayjs();
		const compare = dayjs(dateToCompare);
		return compare.isBefore(now, "day");
	}

	isNowBetweenTimes(startTime: string, endTime: string): boolean {
		const now = dayjs();
		const start = dayjs(`${now.format("YYYY-MM-DD")} ${startTime}`);
		const end = dayjs(`${now.format("YYYY-MM-DD")} ${endTime}`);

		if (start.isAfter(end, "hour") || (start.isSame(end, "hour") && start.isAfter(end, "minute"))) {
			const startOfToday = now.startOf("day");
			const endOfToday = now.endOf("day");

			const endYesterdayMinutesShowToday = Math.abs(startOfToday.diff(end, "minutes"));
			const todayShowEndYesterday = startOfToday.add(endYesterdayMinutesShowToday, "minutes");

			const startTodayMinutesShowToday = Math.abs(endOfToday.diff(start, "minutes"));
			const todayShowStartToday = endOfToday.subtract(startTodayMinutesShowToday, "minutes");

			if (now.isBetween(todayShowEndYesterday, todayShowStartToday, "minute", "[)")) {
				return false;
			}

			return true;
		}

		if (now.isBetween(start, end, "minute", "[)")) {
			return true;
		}

		return false;
	}
}
