export class Utils {
  static dateRange(startDate: Date, endDate: Date, stepsInDays = 1): Date[] {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      currentDate.setUTCDate(currentDate.getUTCDate() + stepsInDays);
    }

    return dateArray;
  }

  static getYearMonthDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
